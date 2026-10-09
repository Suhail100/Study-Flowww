import { useState, type CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { Action, Frame, Header } from '../components/app-shell';
import { CenteredHeader } from './reference-common';
import studyPlanLoadingArt from '../assets/reference/study-plan-loading.png';
import studyPlanFailedArt from '../assets/reference/study-plan-failed.png';
import planCalendarArt from '../assets/reference/plan-calendar.png';
import planTargetArt from '../assets/reference/plan-target.png';
import planFolderArt from '../assets/reference/plan-folder.png';
import resourcesEmptyArt from '../assets/reference/resources-empty.png';
import { CircleCheck, ChevronRight, LockKeyhole, MoreVertical, Play, Plus } from 'lucide-react';

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
      <p>Here’s how your Ai has structured<br />your preparation.</p>
    </div>
  );
}

export function PlanGenerating() {
  return (
    <Frame>
      <section className="plan-generating-reference" data-testid="screen-study-plan-generating">
        <CenteredHeader title="AI study plan" back="/study-plan" className="plan-status-header" />
        <img className="plan-generating-art" src={studyPlanLoadingArt} alt="" />
        <span className="reference-loading-ring" role="status" aria-label="Loading" />
        <h2>Generating your study plan...</h2>
        <p>This may take a few moments.<br />our AI is creating a personalized<br />plan for you</p>
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
        <h2>Failed to generate plan</h2>
        <p>We couldn’t generate your study plan<br />right now. please try again later.</p>
        <Action testId="button-retry-study-plan" onClick={() => go('/study-plan/generating')}>Try Again</Action>
        <button className="button-outline" data-testid="button-back-study-plan" onClick={() => go('/study-plan')}>Go back</button>
      </section>
    </Frame>
  );
}

export function StudyPlanOverview() {
  const [, go] = useLocation();
  const weeks = [
    { number: 1, progress: 50, color: 'red' },
    { number: 2, progress: 0, color: 'purple' },
    { number: 3, progress: 0, color: 'green' },
    { number: 4, progress: 0, color: 'olive' },
  ];
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
        <div className="plan-consistency-note"><span>!</span><b>Your plan adapts to your pace.<br />stay consistent</b></div>
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
  const [selectedDay, setSelectedDay] = useState(2);
  const [completed, setCompleted] = useState(false);
  const [, go] = useLocation();
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-days">
        <Header title="Study Plan" back="/dashboard" right={<img className="plan-header-art target-art" src={planTargetArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Studyplan" />
        <div className="day-plan-heading"><h2>Our Plan</h2><button type="button" onClick={() => go('/study-plan')}>View All<ChevronRight size={19} /></button></div>
        <div className="plan-day-list">
          {planDays.map(item => {
            const dayComplete = item.complete || (item.day === 2 && completed);
            return (
              <button
                type="button"
                key={item.day}
                className={`plan-day-card ${selectedDay === item.day ? 'selected' : ''} ${item.locked ? 'locked' : ''}`}
                onClick={() => {
                  if (!item.locked) setSelectedDay(item.day);
                }}
                aria-disabled={item.locked}
                data-testid={`button-plan-day-${item.day}`}
              >
                <span className="plan-day-name">Day {item.day}<small>{item.date}</small></span>
                <span className="plan-day-tasks">· Normalization<br />· Practice questions(10)</span>
                {item.locked ? <LockKeyhole size={25} /> : dayComplete ? <CircleCheck className="day-completed-icon" size={32} /> : <Play className="day-play-icon" size={28} />}
              </button>
            );
          })}
        </div>
        <Action testId="button-mark-day-complete" onClick={() => setCompleted(true)}>{completed ? 'Completed' : 'Mark as completed'}</Action>
      </section>
    </Frame>
  );
}

const resourceGroups = [
  {
    subject: 'DBMS',
    files: [
      { title: 'DBMS Notes.pdf', detail: '2.4 MB', type: 'pdf', summary: true },
      { title: 'DB Notes.word', detail: '2025 paper', type: 'word' },
    ],
  },
  {
    subject: 'Operating system',
    files: [
      { title: 'Previous year imp', detail: '2026 paper', type: 'ppt' },
      { title: 'OS Notes.pdf', detail: '3.4 MB', type: 'pdf' },
    ],
  },
  {
    subject: 'Computer network',
    files: [
      { title: 'Important question', detail: '2014 paper', type: 'doc' },
      { title: 'CN Notes.pdf', detail: '4.4 MB', type: 'pdf' },
    ],
  },
];

function FileBadge({ type }: { type: string }) {
  return <span className={`reference-file-badge ${type}`}>{type.toUpperCase()}</span>;
}

export function StudyPlanResources() {
  const [, go] = useLocation();
  return (
    <Frame nav>
      <section className="study-plan-reference" data-testid="screen-study-plan-resources">
        <Header title="Resources" back="/dashboard" right={<img className="plan-header-art" src={planFolderArt} alt="" />} />
        <PlanSubtitle />
        <StudyPlanTabs active="Resources" />
        <div className="resources-section-heading"><h2>Study material for your subjects</h2><button type="button" onClick={() => go('/materials')}>View All <ChevronRight size={19} /></button></div>
        <div className="resource-group-list">
          {resourceGroups.map(group => (
            <section className="resource-group-card" key={group.subject}>
              <header>
                <h3>{group.subject}</h3>
                <button type="button" aria-label={`Add ${group.subject} resource`} onClick={() => go('/materials')}><Plus size={22} /></button>
                <button type="button" aria-label={`${group.subject} resource options`}><MoreVertical size={21} /></button>
              </header>
              {group.files.map(file => {
                const content = (
                  <>
                    <FileBadge type={file.type} />
                    <span><b>{file.title}</b><small>{file.detail}</small></span>
                  </>
                );
                return file.summary ? (
                  <button type="button" className="resource-file-card" key={file.title} onClick={() => go('/assistant/material-summary')} data-testid="button-open-dbms-summary">
                    {content}
                  </button>
                ) : (
                  <div className="resource-file-card" key={file.title}>{content}</div>
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
          <p>Add notes , PDF’s or study<br />materials for subjects</p>
          <Action testId="button-add-resources" onClick={() => go('/materials')}>Add Resources</Action>
        </div>
      </section>
    </Frame>
  );
}
