import { useState, type CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { Action, Frame, Header } from '../components/app-shell';
import { CenteredHeader } from './reference-common';
import studyPlanLoadingArt from '../assets/reference/study-plan-loading.png';
import studyPlanFailedArt from '../assets/reference/study-plan-failed.png';
import studyPlanEmptyArt from '../assets/reference/study-plan-empty.png';
import planCalendarArt from '../assets/reference/plan-calendar.png';
import planTargetArt from '../assets/reference/plan-target.png';
import planFolderArt from '../assets/reference/plan-folder.png';
import resourcesEmptyArt from '../assets/reference/resources-empty.png';
import { CircleCheck, ChevronRight, Plus } from 'lucide-react';
import { useStudyFlow } from '../lib/study-flow-store';
import { buildLocalStudyPlan, getPlanRequirements } from '../lib/local-plan-builder';

const studyPlanTabs = [
  { label: 'Overview', path: '/study-plan' },
  { label: 'Studyplan', path: '/study-plan/days' },
  { label: 'Resources', path: '/study-plan/resources' },
] as const;

function StudyPlanTabs({ active }: { active: string }) {
  const [, go] = useLocation();
  return (
    <nav className="reference-plan-tabs" aria-label="Study plan sections">
      {studyPlanTabs.map(({ label, path }) => (
        <button
          type="button"
          key={path}
          className={active === label ? 'active' : ''}
          aria-current={active === label ? 'page' : undefined}
          onClick={() => go(path)}
          data-testid={`button-plan-tab-${label.toLowerCase()}`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

function PlanSubtitle() {
  return (
    <div className="reference-plan-subtitle">
      <p>Your schedule is based on your saved<br />subjects, dates, and study time.</p>
    </div>
  );
}

function CreateLocalPlan() {
  const { data, saveStudyPlan } = useStudyFlow();
  const [, go] = useLocation();
  const [error, setError] = useState('');
  const missing = getPlanRequirements(data.subjects, data.preferences.dailyHours);
  const create = () => {
    if (missing.length) {
      setError(missing.join(' '));
      return;
    }
    saveStudyPlan(buildLocalStudyPlan(data.subjects, data.preferences.dailyHours));
    go('/study-plan/days');
  };
  return (
    <div className="local-plan-create">
      <button className="button-primary" type="button" data-testid="button-create-local-plan" onClick={create}>
        Create local draft
      </button>
      <small>Uses a fixed schedule from your saved data. AI plan generation is not connected.</small>
      {error && <p role="alert" className="local-plan-error">{error}</p>}
    </div>
  );
}

export function EmptyStudyPlan({ active = 'Studyplan' }: { active?: string }) {
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-empty">
        <Header title="Study Plan" back="/dashboard" right={<img className="plan-header-art target-art" src={planTargetArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active={active} />
        <div className="empty-study-plan-state">
          <img src={studyPlanEmptyArt} alt="" />
          <h2>No study plan yet</h2>
          <p>Your personalized study schedule will appear here once your plan is generated.</p>
          <CreateLocalPlan />
        </div>
      </section>
    </Frame>
  );
}

export function PlanGenerating() {
  const { data } = useStudyFlow();
  const [, go] = useLocation();
  if (data.studyPlan) return (
    <Frame nav>
      <section className="plan-generating-reference" data-testid="screen-study-plan-saved">
        <CenteredHeader title="Study plan" back="/study-plan/days" className="plan-status-header" />
        <img className="plan-generating-art" src={studyPlanLoadingArt} alt="" />
        <h2>Your local plan is ready</h2>
        <p>This schedule is based on your saved<br />subjects and preferences.</p>
        <Action testId="button-open-saved-plan" onClick={() => go('/study-plan/days')}>Open study plan</Action>
      </section>
    </Frame>
  );
  return (
    <Frame nav>
      <section className="plan-generating-reference" data-testid="screen-study-plan-generating">
        <CenteredHeader title="Study plan" back="/study-plan/days" className="plan-status-header" />
        <img className="plan-generating-art" src={studyPlanLoadingArt} alt="" />
        <h2>AI plan generation is not connected</h2>
        <p>You can create a local draft from your saved<br />subjects, exam dates, and study time.</p>
        <CreateLocalPlan />
      </section>
    </Frame>
  );
}

export function PlanGenerationFailure() {
  const [, go] = useLocation();
  return (
    <Frame>
      <section className="plan-failure-reference" data-testid="screen-study-plan-error">
        <CenteredHeader title="AI study plan" back="/study-plan" className="plan-status-header" />
        <img src={studyPlanFailedArt} alt="" />
        <h2>AI plan generation unavailable</h2>
        <p>No AI service is connected. You can<br />create a local draft instead.</p>
        <CreateLocalPlan />
        <button className="button-outline" data-testid="button-back-study-plan" onClick={() => go('/study-plan')}>Go back</button>
      </section>
    </Frame>
  );
}

export function StudyPlanOverview() {
  const [, go] = useLocation();
  const { data } = useStudyFlow();
  const plan = data.studyPlan;
  if (!plan) return <EmptyStudyPlan active="Overview" />;
  const dates = Array.from(new Set(plan.tasks.map(task => task.scheduledFor))).sort();
  const weeks = Array.from({ length: Math.ceil(dates.length / 7) }, (_, index) => {
    const weekDates = dates.slice(index * 7, index * 7 + 7);
    const weekTasks = plan.tasks.filter(task => weekDates.includes(task.scheduledFor));
    return {
      number: index + 1,
      progress: weekTasks.length ? Math.round(weekTasks.filter(task => task.completedAt).length / weekTasks.length * 100) : 0,
      color: ['red', 'purple', 'green', 'olive'][index % 4],
    };
  });
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-overview">
        <Header title="Plan overview" back="/dashboard" right={<img className="plan-header-art" src={planCalendarArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Overview" />
        <h2 className="plan-section-heading">Weekly Breakdown</h2>
        <div className="plan-weeks">
          {weeks.map(week => (
            <button type="button" className="plan-week-card" key={week.number} onClick={() => go('/study-plan/days')} data-testid={`button-plan-week-${week.number}`}>
              <span className={`week-number ${week.color}`}>{week.number}</span>
              <b>Week - {week.number}</b>
              <span
                className="week-progress-ring"
                style={{ '--week-progress': `${week.progress}%` } as CSSProperties}
                aria-label={`${week.progress}% complete`}
              >
                <i>{week.progress > 0 && `${week.progress}%`}</i>
              </span>
              <ChevronRight size={25} />
            </button>
          ))}
        </div>
        <div className="plan-consistency-note"><span>!</span><b>Local draft · update your subject dates<br />to rebuild this schedule.</b></div>
      </section>
    </Frame>
  );
}

const planDays = [
  { day: 1, date: 'May 5, 2026', locked: false, complete: true },
  { day: 2, date: 'May 6, 2026', locked: false, complete: false },
  { day: 3, date: 'May 7, 2026', locked: true, complete: false },
  { day: 4, date: 'May 8, 2026', locked: true, complete: false },
];

export function StudyPlanDays() {
  const { data, completeTask } = useStudyFlow();
  const [, go] = useLocation();
  const plan = data.studyPlan;
  if (!plan) return <EmptyStudyPlan active="Studyplan" />;
  const days = Array.from(new Set(plan.tasks.map(task => task.scheduledFor))).sort();
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-days">
        <Header title="Study Plan" back="/dashboard" right={<img className="plan-header-art target-art" src={planTargetArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Studyplan" />
        <div className="day-plan-heading"><h2>Our Plan</h2><button type="button" onClick={() => go('/study-plan')}>Overview<ChevronRight size={19} /></button></div>
        <div className="plan-day-list">
          {days.map((date, dayIndex) => (
            <section className="plan-day-group" key={date}>
              <h3>Day {dayIndex + 1} · {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
              {plan.tasks.filter(task => task.scheduledFor === date).map(task => {
                const subject = data.subjects.find(item => item.id === task.subjectId);
                return (
                  <article className={`plan-day-card ${task.completedAt ? 'selected' : ''}`} key={task.id} data-testid={`task-${task.id}`}>
                    <div className="plan-day-name"><b>{task.title}</b><small>{subject?.name ?? 'Removed subject'} · {task.minutes} min</small></div>
                    <button type="button" className="plan-task-toggle" disabled={Boolean(task.completedAt)} onClick={() => completeTask(task.id)} data-testid={`button-complete-task-${task.id}`}>
                      {task.completedAt ? <><CircleCheck className="day-completed-icon" size={25} /> Completed</> : 'Mark complete'}
                    </button>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
        <p className="local-plan-note">This is a local draft schedule. No AI-generated plan is connected.</p>
      </section>
    </Frame>
  );
}

function FileBadge({ type }: { type: string }) {
  return <span className={`reference-file-badge ${type}`}>{type.toUpperCase()}</span>;
}

export function StudyPlanResources() {
  const [, go] = useLocation();
  const { data, setSelectedSubject } = useStudyFlow();
  if (!data.materials.length) return <EmptyStudyPlanResources />;
  const groups = data.subjects
    .map(subject => ({
      subject,
      materials: data.materials.filter(material => material.subjectId === subject.id),
    }))
    .filter(group => group.materials.length > 0);
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-resources">
        <Header title="Resources" back="/dashboard" right={<img className="plan-header-art" src={planFolderArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Resources" />
        <div className="resources-section-heading"><h2>Study material for your subjects</h2><button type="button" onClick={() => go('/materials')}>View All <ChevronRight size={19} /></button></div>
        <div className="resource-group-list">
          {groups.map(group => (
            <section className="resource-group-card" key={group.subject.id}>
              <header>
                <h3>{group.subject.name}</h3>
                <button type="button" aria-label={`Add ${group.subject.name} resource`} onClick={() => { setSelectedSubject(group.subject.id); go('/subject/materials'); }}><Plus size={22} /></button>
              </header>
              {group.materials.map(material => {
                const detail = material.sourceUrl ? 'External link' : material.size ? `${(material.size / (1024 * 1024)).toFixed(1)} MB` : 'Metadata only';
                const content = (
                  <>
                    <FileBadge type={material.type} />
                    <span><b>{material.name}</b><small>{detail}</small></span>
                  </>
                );
                return material.sourceUrl ? (
                  <button type="button" className="resource-file-card" key={material.id} onClick={() => window.open(material.sourceUrl, '_blank', 'noopener,noreferrer')} data-testid={`button-open-resource-${material.id}`}>
                    {content}
                  </button>
                ) : (
                  <div className="resource-file-card" key={material.id}>{content}</div>
                );
              })}
            </section>
          ))}
        </div>
      </section>
    </Frame>
  );
}

export function EmptyStudyPlanResources() {
  const [, go] = useLocation();
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-resources-empty">
        <Header title="Resources" back="/dashboard" right={<img className="plan-header-art" src={planFolderArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Resources" />
        <div className="empty-plan-resources">
          <img src={resourcesEmptyArt} alt="" />
          <h2>No resources yet</h2>
          <p>Add resource links or upload files<br />when secure storage is connected.</p>
          <Action testId="button-add-resources" onClick={() => go('/materials')}>Add Resources</Action>
        </div>
      </section>
    </Frame>
  );
}
