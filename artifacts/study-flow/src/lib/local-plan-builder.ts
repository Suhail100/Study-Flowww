import { makeId, type StudyPlan, type StudyTask, type Subject } from './study-flow-store';

function localDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hoursAsMinutes(value: string) {
  if (!value.trim()) return 0;
  if (value.includes('-')) {
    const numbers = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    return numbers.length >= 2 ? Math.round(((numbers[0] + numbers[1]) / 2) * 60) : 0;
  }
  const number = Number(value.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
  return Math.round(number * 60);
}

export function getPlanRequirements(subjects: Subject[], dailyHours: string) {
  const missing: string[] = [];
  const today = localDate(new Date());
  if (!subjects.length) missing.push('Add at least one subject.');
  if (!dailyHours.trim() || hoursAsMinutes(dailyHours) < 30) missing.push('Set your daily study time in Goal settings.');
  if (subjects.some(subject => !subject.examDate || Number.isNaN(new Date(`${subject.examDate}T12:00:00`).getTime()) || subject.examDate < today)) {
    missing.push('Add a valid exam date on or after today for every subject.');
  }
  if (subjects.some(subject => !subject.goal.trim() || !/\d/.test(subject.goal))) {
    missing.push('Add a target score for every subject.');
  }
  return missing;
}

export function buildLocalStudyPlan(subjects: Subject[], dailyHours: string): Omit<StudyPlan, 'id' | 'createdAt'> {
  const requirements = getPlanRequirements(subjects, dailyHours);
  if (requirements.length) throw new Error(requirements.join(' '));
  const dailyMinutes = hoursAsMinutes(dailyHours);
  const now = new Date();
  const today = localDate(now);
  const closestExamDate = Math.min(...subjects.map(subject => new Date(`${subject.examDate}T12:00:00`).getTime()));
  const todayAtNoon = new Date(`${today}T12:00:00`).getTime();
  const untilExam = Math.max(1, Math.ceil((closestExamDate - todayAtNoon) / (24 * 60 * 60 * 1000)) + 1);
  const dayCount = Math.max(1, Math.min(7, untilExam));
  const sessionMinutes = Math.max(15, Math.min(60, Math.floor(dailyMinutes / 2)));
  const tasks: StudyTask[] = [];

  for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayIndex);
    const subject = subjects[dayIndex % subjects.length];
    tasks.push({
      id: makeId('task'),
      subjectId: subject.id,
      title: `Review key ideas in ${subject.name}`,
      scheduledFor: localDate(day),
      minutes: sessionMinutes,
      completedAt: null,
    });
    tasks.push({
      id: makeId('task'),
      subjectId: subject.id,
      title: `Practice questions for ${subject.name}`,
      scheduledFor: localDate(day),
      minutes: Math.max(15, dailyMinutes - sessionMinutes),
      completedAt: null,
    });
  }

  return { kind: 'local-draft', tasks };
}
