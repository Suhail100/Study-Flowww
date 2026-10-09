import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'study-flow-data:v1';
const LEGACY_PROFILE_KEY = 'study-profile';
const LEGACY_SUBJECTS_KEY = 'study-subjects';

export type Profile = {
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  hours: string;
  score: string;
  avatar: string;
};

export type Subject = {
  id: string;
  name: string;
  examDate: string;
  goal: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: number;
};

export type SubjectDraft = Omit<Subject, 'id' | 'createdAt'>;

export type Material = {
  id: string;
  subjectId: string;
  name: string;
  type: string;
  size: number;
  objectPath?: string;
  sourceUrl?: string;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'system';
  text: string;
  createdAt: number;
};

export type StudyTask = {
  id: string;
  subjectId: string;
  title: string;
  scheduledFor: string;
  minutes: number;
  completedAt: number | null;
};

export type StudyPlan = {
  id: string;
  createdAt: number;
  kind: 'local-draft';
  tasks: StudyTask[];
};

export type QuizAnswer = {
  questionId: string;
  selectedOption: number;
  correctOption: number;
  topic: string;
};

export type QuizAttempt = {
  id: string;
  subjectId: string;
  subjectName: string;
  completedAt: number;
  durationSeconds: number;
  total: number;
  correct: number;
  answers: QuizAnswer[];
};

export type QuizSession = {
  subjectId: string;
  difficulty: string;
  unit: string;
  questionIds: string[];
  answers: (number | null)[];
  currentIndex: number;
  startedAt: number;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  href: string;
};

export type StudyFlowData = {
  profile: Profile;
  preferences: { dailyHours: string; targetScore: string };
  subjects: Subject[];
  selectedSubjectId: string | null;
  subjectDraft: SubjectDraft | null;
  materials: Material[];
  chats: Record<string, ChatMessage[]>;
  studyPlan: StudyPlan | null;
  quizSession: QuizSession | null;
  quizAttempts: QuizAttempt[];
  lastQuizAttemptId: string | null;
  notifications: AppNotification[];
};

const blankProfile: Profile = {
  name: '',
  email: '',
  college: '',
  course: '',
  year: '',
  hours: '',
  score: '',
  avatar: '',
};

function blankData(): StudyFlowData {
  return {
    profile: blankProfile,
    preferences: { dailyHours: '', targetScore: '' },
    subjects: [],
    selectedSubjectId: null,
    subjectDraft: null,
    materials: [],
    chats: {},
    studyPlan: null,
    quizSession: null,
    quizAttempts: [],
    lastQuizAttemptId: null,
    notifications: [],
  };
}

function createId(prefix: string) {
  const randomId = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${randomId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

function readLegacyData(): StudyFlowData {
  const state = blankData();
  if (typeof window === 'undefined') return state;

  try {
    const legacyProfile = JSON.parse(localStorage.getItem(LEGACY_PROFILE_KEY) ?? 'null') as Partial<Profile> | null;
    if (legacyProfile) {
      const oldDefaults: Profile = {
        name: 'Suhail khan',
        email: 'suhailkhan@gmail.com',
        college: 'Sathyabama university',
        course: 'B.E - CSE',
        year: '3rd year',
        hours: '4 - 5 hours',
        score: '80%',
        avatar: '',
      };
      for (const key of Object.keys(blankProfile) as (keyof Profile)[]) {
        const oldValue = legacyProfile[key];
        if (key !== 'avatar' && typeof oldValue === 'string' && oldValue !== oldDefaults[key]) {
          state.profile[key] = oldValue;
        }
      }
      state.preferences.dailyHours = state.profile.hours;
      state.preferences.targetScore = state.profile.score;
    }
  } catch {
    // Ignore malformed data from an earlier prototype version.
  }

  try {
    const legacySubjects = JSON.parse(localStorage.getItem(LEGACY_SUBJECTS_KEY) ?? '[]') as Partial<Subject>[];
    const seededNames = new Set([
      'dbms',
      'computer networks',
      'operating system',
      'software engineering',
    ]);
    state.subjects = legacySubjects
      .filter(subject => typeof subject.name === 'string' && !seededNames.has(subject.name.trim().toLowerCase()))
      .map(subject => ({
        id: typeof subject.id === 'string' ? subject.id : createId('subject'),
        name: subject.name!.trim(),
        examDate: typeof subject.examDate === 'string'
          ? subject.examDate
          : typeof (subject as Partial<Subject> & { date?: unknown }).date === 'string'
            ? (() => {
              const parsedDate = new Date((subject as Partial<Subject> & { date: string }).date);
              return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
            })()
            : '',
        goal: typeof subject.goal === 'string' ? subject.goal : '',
        priority: subject.priority === 'High' || subject.priority === 'Low' ? subject.priority : 'Medium',
        createdAt: typeof subject.createdAt === 'number' ? subject.createdAt : Date.now(),
      }));
  } catch {
    // Ignore malformed data from an earlier prototype version.
  }

  return state;
}

function loadData(): StudyFlowData {
  if (typeof window === 'undefined') return blankData();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return readLegacyData();
    const parsed = JSON.parse(saved) as Partial<StudyFlowData>;
    const empty = blankData();
    return {
      ...empty,
      ...parsed,
      profile: { ...empty.profile, ...parsed.profile },
      preferences: { ...empty.preferences, ...parsed.preferences },
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
      materials: Array.isArray(parsed.materials) ? parsed.materials : [],
      chats: parsed.chats && typeof parsed.chats === 'object' ? parsed.chats : {},
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  } catch {
    return readLegacyData();
  }
}

type StudyFlowContextValue = {
  data: StudyFlowData;
  persistenceAvailable: boolean;
  updateProfile: (patch: Partial<Profile>) => void;
  updatePreferences: (patch: Partial<StudyFlowData['preferences']>) => void;
  setSelectedSubject: (subjectId: string | null) => void;
  setSubjectDraft: (draft: SubjectDraft | null) => void;
  addSubject: (draft: SubjectDraft) => Subject | null;
  updateSubject: (subjectId: string, patch: Partial<SubjectDraft>) => void;
  deleteSubject: (subjectId: string) => void;
  addMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  deleteMaterial: (materialId: string) => void;
  addChatMessage: (subjectId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  saveStudyPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => void;
  completeTask: (taskId: string) => void;
  setQuizSession: (session: QuizSession | null) => void;
  saveQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
};

const StudyFlowContext = createContext<StudyFlowContextValue | null>(null);

export function StudyFlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyFlowData>(loadData);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        profile: { ...data.profile, avatar: '' },
      }));
      setPersistenceAvailable(true);
    } catch {
      setPersistenceAvailable(false);
    }
  }, [data]);

  useEffect(() => {
    const syncFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as StudyFlowData;
        if (parsed && Array.isArray(parsed.subjects)) setData(parsed);
      } catch {
        // Leave the in-memory state untouched if another tab writes invalid JSON.
      }
    };
    window.addEventListener('storage', syncFromAnotherTab);
    return () => window.removeEventListener('storage', syncFromAnotherTab);
  }, []);

  const value = useMemo<StudyFlowContextValue>(() => {
    const pushNotification = (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
      const entry: AppNotification = {
        ...notification,
        id: createId('notification'),
        createdAt: Date.now(),
        read: false,
      };
      setData(current => ({ ...current, notifications: [entry, ...current.notifications] }));
    };

    return {
      data,
      persistenceAvailable,
      updateProfile: patch => setData(current => ({
        ...current,
        profile: { ...current.profile, ...patch },
        preferences: {
          dailyHours: patch.hours ?? current.preferences.dailyHours,
          targetScore: patch.score ?? current.preferences.targetScore,
        },
      })),
      updatePreferences: patch => setData(current => ({
        ...current,
        preferences: { ...current.preferences, ...patch },
        profile: {
          ...current.profile,
          hours: patch.dailyHours ?? current.profile.hours,
          score: patch.targetScore ?? current.profile.score,
        },
      })),
      setSelectedSubject: subjectId => setData(current => ({ ...current, selectedSubjectId: subjectId })),
      setSubjectDraft: subjectDraft => setData(current => ({ ...current, subjectDraft })),
      addSubject: draft => {
        if (data.subjects.some(subject => subject.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) return null;
        const subject: Subject = { ...draft, id: createId('subject'), createdAt: Date.now() };
        setData(current => ({
          ...current,
          subjects: [...current.subjects, subject],
          selectedSubjectId: subject.id,
          subjectDraft: null,
          studyPlan: null,
        }));
        pushNotification({
          title: 'Subject added',
          message: `${subject.name} is ready in your subjects.`,
          href: '/subjects',
        });
        return subject;
      },
      updateSubject: (subjectId, patch) => setData(current => ({
        ...current,
        subjects: current.subjects.map(subject => subject.id === subjectId ? { ...subject, ...patch } : subject),
        studyPlan: patch.examDate !== undefined || patch.goal !== undefined ? null : current.studyPlan,
      })),
      deleteSubject: subjectId => setData(current => {
        const subjects = current.subjects.filter(subject => subject.id !== subjectId);
        const chats = { ...current.chats };
        delete chats[subjectId];
        return {
          ...current,
          subjects,
          selectedSubjectId: current.selectedSubjectId === subjectId ? (subjects[0]?.id ?? null) : current.selectedSubjectId,
          materials: current.materials.filter(material => material.subjectId !== subjectId),
          chats,
          studyPlan: current.studyPlan
            ? { ...current.studyPlan, tasks: current.studyPlan.tasks.filter(task => task.subjectId !== subjectId) }
            : null,
        };
      }),
      addMaterial: material => {
        setData(current => ({
          ...current,
          materials: [...current.materials, { ...material, id: createId('material'), createdAt: Date.now() }],
        }));
        pushNotification({
          title: 'Resource added',
          message: `${material.name} was added to your subject materials.`,
          href: '/study-plan/resources',
        });
      },
      deleteMaterial: materialId => setData(current => ({
        ...current,
        materials: current.materials.filter(material => material.id !== materialId),
      })),
      addChatMessage: (subjectId, message) => setData(current => ({
        ...current,
        chats: {
          ...current.chats,
          [subjectId]: [
            ...(current.chats[subjectId] ?? []),
            { ...message, id: createId('chat'), createdAt: Date.now() },
          ],
        },
      })),
      saveStudyPlan: plan => setData(current => ({
        ...current,
        studyPlan: { ...plan, id: createId('plan'), createdAt: Date.now() },
      })),
      completeTask: taskId => {
        const target = data.studyPlan?.tasks.find(task => task.id === taskId);
        if (!target || target.completedAt) return;
        setData(current => {
          if (!current.studyPlan) return current;
          return {
            ...current,
            studyPlan: {
              ...current.studyPlan,
              tasks: current.studyPlan.tasks.map(task => task.id === taskId ? { ...task, completedAt: Date.now() } : task),
            },
          };
        });
        const subjectName = data.subjects.find(subject => subject.id === target?.subjectId)?.name ?? 'Study task';
        pushNotification({ title: 'Study task completed', message: subjectName, href: '/progress' });
      },
      setQuizSession: quizSession => setData(current => ({ ...current, quizSession })),
      saveQuizAttempt: attempt => {
        const entry: QuizAttempt = { ...attempt, id: createId('quiz'), completedAt: Date.now() };
        setData(current => ({
          ...current,
          quizSession: null,
          quizAttempts: [entry, ...current.quizAttempts],
          lastQuizAttemptId: entry.id,
        }));
        pushNotification({
          title: 'Quiz completed',
          message: `${entry.subjectName}: ${entry.correct}/${entry.total} correct.`,
          href: '/quiz/results',
        });
      },
      markNotificationRead: notificationId => setData(current => ({
        ...current,
        notifications: current.notifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      })),
    };
  }, [data, persistenceAvailable]);

  return <StudyFlowContext.Provider value={value}>{children}</StudyFlowContext.Provider>;
}

export function useStudyFlow() {
  const context = useContext(StudyFlowContext);
  if (!context) throw new Error('useStudyFlow must be used inside StudyFlowProvider');
  return context;
}

export function makeId(prefix: string) {
  return createId(prefix);
}
