import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import {
  BookOpen, CircleHelp, UserRound, Bell, ArrowRight,
  ChevronLeft, ChevronRight, Search, Plus, MoreVertical, Clock3, Target, Flame,
  CircleCheck, CircleX, Trophy, Lightbulb, Upload, NotebookPen, CalendarClock,
  GraduationCap, Settings, Mail, Building2, Goal, User, X, Brain, FileText,
  CircleUserRound, Medal, Star, Sparkles, ChartLine,
  Bot, CloudUpload, Pencil, AlarmClock, AlertTriangle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Action, Frame, Header } from './components/app-shell';
import profileIllustration from './assets/profile-illustration.png';
import emptyBooks from './assets/empty-books.png';
import trophyIllustration from './assets/trophy.png';
import subjectBookReference from './assets/reference/subject-book.png';
import { EmptyProgress, EmptyQuizAttempts, EmptyMaterials, UploadFailure, EmptySubjectSearch, OfflineScreen } from './pages/reference-states';
import { SettingsPage, EmptyNotifications, NotificationsList } from './pages/reference-preferences';
import { AssistantUnavailable, AssistantHome, AssistantChat, MaterialSummary } from './pages/reference-assistant';
import {
  PlanGenerating,
  PlanGenerationFailure,
  StudyPlanOverview,
  StudyPlanDays,
  StudyPlanResources,
  EmptyStudyPlanResources,
} from './pages/reference-study-plan';
import './index.css';
import './reference-screens.css';

type Subject = { name: string; date: string; goal: string; priority: string; progress: number };
type Profile = { name: string; email: string; college: string; course: string; year: string; hours: string; score: string; avatar: string };
const starterSubjects: Subject[] = [
  { name: 'DBMS', date: '15 Nov 2026', goal: '85%', priority: 'High', progress: 60 },
  { name: 'Computer networks', date: '20 Nov 2026', goal: '80%', priority: 'Medium', progress: 40 },
  { name: 'Operating System', date: '25 Nov 2026', goal: '80%', priority: 'Medium', progress: 20 },
  { name: 'Software engineering', date: '30 Nov 2026', goal: '75%', priority: 'Low', progress: 10 },
];
const initialProfile: Profile = { name:'Suhail khan', email:'suhailkhan@gmail.com', college:'Sathyabama university', course:'B.E - CSE', year:'3rd year', hours:'4 - 5 hours', score:'80%', avatar:'' };
function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial; } catch { return initial; }
  });
  const save = (next: T) => { setValue(next); localStorage.setItem(key, JSON.stringify(next)); };
  return [value, save] as const;
}
function Welcome() {
 const [,go]=useLocation();
 return <main className="welcome-screen" data-testid="screen-welcome">
  <div className="welcome-stars"><span>✦</span><span>✧</span><span>·</span></div>
  <div className="welcome-brand"><span className="brand-mark">ϟ</span><strong>StudyFlow</strong></div>
  <p className="welcome-tagline">Your <span>AI</span> Study Partner</p>
  <p className="welcome-motto">Plan • Learn • Practice • Grow</p>
  <div className="welcome-illustration" aria-hidden="true"><div className="float-icon i1"><Pencil/></div><div className="float-icon i2"><Settings/></div><div className="float-icon i3"><Target/></div><div className="orbit"></div><div className="bot-figure"><div className="bot-antenna"></div><div className="bot-head"><div className="bot-face"><i/><i/></div></div><div className="bot-body"><BookOpen size={28}/></div><div className="bot-leg l1"/><div className="bot-leg l2"/></div></div>
  <button className="welcome-cta" data-testid="button-get-started" onClick={()=>go('/intro')}>Get Started <ArrowRight size={22}/></button>
  <div className="welcome-spark">✦</div>
 </main>;
}
function Intro() {
 const [,go]=useLocation();
 return <Frame><div className="intro-page" data-testid="screen-intro">
  <h1><span>Welcome To</span><br/>StudyFlow</h1>
  <p className="subtitle center">Your Personalized Study Companion<br/>With AI Powered Quizzes, Study Plan<br/>and Progress Tracking</p>
  <div className="intro-features">
   <div><span><FileText/></span>Smart Study plan</div><div><span><Brain/></span>AI Generated quizzes</div><div><span><ChartLine/></span>Track Your Progress</div>
  </div>
  <Action testId="button-next-profile" onClick={()=>go('/profile-details')}>Next <ArrowRight size={19}/></Action>
  <p className="login-prompt">Already have an account? <span data-testid="text-login-label">Log in</span></p>
 </div></Frame>;
}
function ProfileDetails() {
 const [profile,save]=useSaved<Profile>('study-profile',initialProfile); const [,go]=useLocation();
 const fields:[string,keyof Profile][]=[['Full Name','name'],['College/University','college'],['Degree/Course','course'],['Year/Semester','year']];
 return <Frame><section data-testid="screen-profile-details" className="profile-details">
   <h1 className="title">Tell Us About Yourself</h1><p className="subtitle">Let’s set up your profile to<br/> get started</p>
   <div className="profile-symbol"><CircleUserRound size={94} strokeWidth={1.1}/><Plus className="profile-add" size={24}/></div>
   <form onSubmit={(e:FormEvent)=>{e.preventDefault();go('/avatar')}}>{fields.map(([label,key])=><label className="field-label" key={key}>{label}<input data-testid={`input-${key}`} className="input" value={profile[key]} onChange={e=>save({...profile,[key]:e.target.value})}/></label>)}
   <button className="button-primary profile-next" data-testid="button-next-avatar" type="submit">Next <ArrowRight size={19}/></button></form>
  </section></Frame>;
}
function AvatarPage() {
 const [profile,save]=useSaved<Profile>('study-profile',initialProfile); const [,go]=useLocation();
 const handleFile=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(file){const r=new FileReader();r.onload=()=>save({...profile,avatar:String(r.result)});r.readAsDataURL(file);}};
 return <Frame><section className="avatar-page" data-testid="screen-avatar">
  <h1 className="title">Add Profile Picture</h1><p className="subtitle">Choose a photo or upload<br/> one from your gallery.</p>
  <div className="avatar-ring">{profile.avatar?<img src={profile.avatar} alt="Profile avatar"/>:<UserRound size={95} strokeWidth={.8}/>}</div>
  <label className="button-primary upload-button"><Upload size={18}/> Upload photo<input type="file" accept="image/*" onChange={handleFile} data-testid="input-avatar-upload"/></label>
  <button className="gallery-button" data-testid="button-choose-gallery" onClick={()=>document.querySelector<HTMLInputElement>('[data-testid="input-avatar-upload"]')?.click()}>Choose From Gallery</button>
  <button className="skip-link" data-testid="button-skip-avatar" onClick={()=>go('/goal')}>Skip</button>
 </section></Frame>;
}
function GoalPage() {
 const [,go]=useLocation(); const [goal,setGoal]=useSaved('study-goal','80%'); const [hours,setHours]=useSaved('study-hours','2hrs'); const [selectedGoal,setSelectedGoal]=useState('');
 const choices:[string,string,LucideIcon][]=[['Score 90%','High performance',Trophy],['Score 80%','Top performer',Medal],['Score 70%','Good grades,decent marks',Medal],['Score 60%','Pass with good marks',Star]];
 return <Frame><section data-testid="screen-goal"><h1 className="title">Set Your Goal</h1><p className="subtitle">What is Your Main Goal For<br/> This Semester?</p>
  <div className="goal-options">{choices.map(([name,desc,Icon])=><button key={String(name)} className={`goal-option ${selectedGoal===String(name).slice(6)?'chosen':''}`} data-testid={`button-goal-${String(name).slice(6,8)}`} onClick={()=>{const value=String(name).slice(6);setSelectedGoal(value);setGoal(value);}}><Icon size={39} strokeWidth={1.35}/><span><b>{name}</b><small>{desc}</small></span></button>)}</div>
  <label className="select-label">Target score<input className="input" data-testid="input-target-score" value={goal} onChange={e=>setGoal(e.target.value)}/></label>
  <label className="select-label">Daily study Time<select className="input" value={hours} data-testid="select-study-hours" onChange={e=>setHours(e.target.value)}>{['1hr','2hrs','3hrs','4 - 5 hours','6+ hours'].map(x=><option key={x}>{x}</option>)}</select></label>
  <div style={{margin:'28px 5px 0'}}><Action testId="button-next-subjects" onClick={()=>go('/add-subjects')}>Next</Action></div>
 </section></Frame>;
}
function AddSubjectsIntro() {
 const [,go]=useLocation(); const [subjects,save]=useSaved<Subject[]>('study-subjects',starterSubjects); const [files,setFiles]=useState<string[]>([]); const starters=['data structures','AIML','Python','English','Language'];
 const add=(name:string)=>{if(!subjects.some(x=>x.name.toLowerCase()===name.toLowerCase()))save([...subjects,{name,date:'15 Nov 2026',goal:'80%',priority:'Medium',progress:0}]);};
 return <Frame><section data-testid="screen-add-subjects"><h1 className="title">Add Your Subject</h1><p className="subtitle">Upload your subjects files or add them<br/> manually,you can rename them later.</p>
   <label className="file-drop"><CloudUpload size={56} strokeWidth={1.1}/><b>{files.length?`${files.length} file${files.length>1?'s':''} selected`:'upload your Subjects'}</b><small>{files.length?files.join(', '):'PDF,DOC/DOCX,PPT/PPTX,JPG/PNG'}</small><input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" data-testid="input-subject-files" onChange={e=>setFiles(Array.from(e.target.files??[]).map(file=>file.name))}/></label>
   <h2 className="muted-heading">Or add manually</h2>
   <div className="starter-subjects">{starters.map((s,i)=><button key={s} className="starter-row" data-testid={`button-add-${s.replaceAll(' ','-')}`} onClick={()=>add(s)}><span className={`note-icon note-${i}`}><NotebookPen size={26}/></span>{s}<ChevronRight size={22}/></button>)}</div>
   <div className="onboard-next"><Action testId="button-finish-onboarding" onClick={()=>go('/dashboard')}>Next</Action></div>
 </section></Frame>;
}
function Dashboard() {
 const [profile]=useSaved<Profile>('study-profile',initialProfile); const [subjects]=useSaved<Subject[]>('study-subjects',starterSubjects); const [showTip,setShowTip]=useState(true); const [,go]=useLocation();
 return <Frame nav><section className="dashboard" data-testid="screen-dashboard">
   <div className="dash-heading"><div><h1 className="title">Good Morning, {profile.name.split(' ')[0]}</h1><p className="subtitle">Keep going! You’re Doing Great</p></div><button className="icon-btn" data-testid="icon-notifications" aria-label="Notifications" onClick={()=>go('/notifications')}><Bell/></button></div>
  <div className="goal-card card"><div><h3>Your Goal</h3><p>Score <b>{profile.score}</b></p></div><div className="ring-chart"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43"/><circle className="ring-progress" cx="50" cy="50" r="43"/></svg><strong>75%</strong><small>Overall progress</small></div>
   <div className="stat-strip"><div><b>{subjects.length}</b><span>Subjects</span></div><div><b>3h</b><span>Study time</span></div><div><b>15 Nov</b><span>Exam date</span></div></div>
  </div>
   <div className="focus-head"><h2>Today’s Focus</h2><Link href="/study-plan" data-testid="link-view-plans">View Plans <ArrowRight size={19}/></Link></div>
  <div className="focus-cards">{['DBMS','OS','CN'].map(x=><button key={x} data-testid={`card-focus-${x}`} onClick={()=>go('/subject/overview')} className="focus-card"><b>{x}</b><span>30 Mins</span></button>)}</div>
   {showTip&&<div className="assistant-banner" role="link" tabIndex={0} data-testid="button-open-assistant" onClick={()=>go('/assistant')} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go('/assistant');}}}><Bot size={42}/><div><b>AI assistant</b><p>You’re doing Great! Focus more<br/> on normalisation Today</p></div><button data-testid="button-dismiss-tip" aria-label="Dismiss" onClick={e=>{e.stopPropagation();setShowTip(false);}}><X size={21}/></button><span className="tip-star">✦</span></div>}
 </section></Frame>;
}
function SubjectsPage({empty=false}:{empty?:boolean}) {
 const [subjects,save]=useSaved<Subject[]>('study-subjects',starterSubjects); const [query,setQuery]=useState(''); const [tab,setTab]=useState<'mine'|'all'>('mine'); const [,go]=useLocation();
 const filtered=useMemo(()=>subjects.filter(s=>s.name.toLowerCase().includes(query.toLowerCase())),[subjects,query]);
 return <Frame nav><section data-testid={empty?'screen-empty-subjects':'screen-subjects'} className="subjects-page">
  <div className="subjects-heading"><h1 className="title">Subjects</h1>{!empty&&<><button className="search-icon" data-testid="button-focus-search" onClick={()=>document.querySelector<HTMLInputElement>('[data-testid="input-search-subjects"]')?.focus()}><Search/></button><Link className="add-pill" href="/subject/add" data-testid="link-add-subject"><Plus size={15}/> Add</Link></>}</div>
   <div className="search-box"><Search size={18}/><input data-testid="input-search-subjects" placeholder="Search Subjects.." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&query.trim()&&!filtered.length)go('/subjects/no-results');}}/></div>
  <div className="tabs"><button className={tab==='mine'?'active':''} data-testid="button-tab-my-subjects" onClick={()=>setTab('mine')}>My Subjects</button><button className={tab==='all'?'active':''} data-testid="button-tab-all-subjects" onClick={()=>setTab('all')}>All</button></div>
  {(empty||(!filtered.length&&subjects.length===0))?<div className="empty-state"><div className="book-stack"><img src={emptyBooks} alt="" /></div><h2>No Subjects added yet</h2><p>Add your subjects to start building<br/> your personalized study plan</p><Link href="/subject/add" className="button-primary empty-add" data-testid="link-empty-add"><Plus size={20}/> Add Subjects</Link></div>
   :!filtered.length?<div className="empty-search"><Search size={40}/><p>No subjects match “{query}”</p></div>:
    <div className="subject-list">{filtered.map((s,i)=><article className="subject-row list-card" key={s.name} data-testid={`card-subject-${s.name.toLowerCase().replaceAll(' ','-')}`} onClick={()=>go('/subject/overview')}>
      <div className={`subject-art art-${i%4}`}><DatabaseArt/></div><div className="subject-info"><b>{s.name}</b><small>5 Units · {s.date}</small><div className="progress-bar"><span style={{width:`${s.progress}%`,background:['#3e70e5','#20c64f','#be32c9','#7a26b7'][i%4]}}/></div></div>
      <div className="mini-ring" style={{'--pct':`${s.progress}%`} as React.CSSProperties}><b>{s.progress}%</b></div><button className="more-btn" data-testid={`button-menu-subject-${i}`} onClick={e=>{e.stopPropagation();const ok=window.confirm(`Remove ${s.name}?`);if(ok)save(subjects.filter(x=>x.name!==s.name));}} aria-label={`Remove ${s.name}`}><MoreVertical size={21}/></button>
    </article>)}</div>}
 </section></Frame>;
}
function DatabaseArt(){return <div className="db-art" aria-hidden="true"><span/><i/><b/><em/></div>}
function AddSubjectForm(){return <SubjectForm/>}
function AddSubjectValidation(){return <SubjectForm validation/>}
function SubjectForm({validation=false}:{validation?:boolean}) {
  const [subjects,save]=useSaved<Subject[]>('study-subjects',starterSubjects); const [,go]=useLocation(); const [name,setName]=useState(validation?'':'Database management'); const [date,setDate]=useState(validation?'':'2026-10-15'); const [goal,setGoal]=useState(validation?'':'85%'); const [priority,setPriority]=useState('High'); const [error,setError]=useState(validation?'Please fill in all required fields':'');
  const submit=(e:FormEvent)=>{e.preventDefault();if(!name.trim()||!date||!goal.trim()){setError('Please fill in all required fields');if(!validation)go('/subject/add/validation-error');return;}if(subjects.some(s=>s.name.toLowerCase()===name.toLowerCase())){setError('That subject is already in your list.');return;}save([...subjects,{name:name.trim(),date:new Date(`${date}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),goal,priority,progress:0}]);go('/subjects');};
  return <Frame><section className={validation?'subject-add-validation':''} data-testid={validation?'screen-add-subject-validation':'screen-add-subject'}><Header title="Add subject" back={validation?'/subject/add':'/subjects'}/><div className="form-book">{validation?<img src={subjectBookReference} alt=""/>:<BookOpen size={46}/>}</div><h2 className="center form-title">Enter Subject details</h2><p className="subtitle center form-subtitle">Add subject name, goal,exam date and<br/> set its priority.</p>
  <form onSubmit={submit} className="subject-form">
    <label className="form-box"><b>Subject Name<span>*</span></b><div><BookOpen size={22}/><input placeholder={validation?'e.g. Database management':undefined} data-testid="input-subject-name" value={name} onChange={e=>{setName(e.target.value);setError('');}}/></div></label>
    <label className="form-box"><b>Exam Date<span>*</span></b><div><CalendarClock size={22}/><input type={validation?'text':'date'} placeholder={validation?'Select Date':undefined} data-testid="input-exam-date" value={date} onChange={e=>{setDate(e.target.value);setError('');}}/></div></label>
    <label className="form-box"><b>Goal ( Target score)<span>*</span></b><div><Target size={22}/><input placeholder={validation?'e.g. 80%':undefined} data-testid="input-subject-goal" value={goal} onChange={e=>{setGoal(e.target.value);setError('');}}/></div></label>
   <fieldset className="form-box priority-field"><legend>Priority</legend><div className="priority-options">{['High','Medium','Low'].map(x=><button type="button" key={x} data-testid={`button-priority-${x.toLowerCase()}`} className={priority===x?'selected':''} onClick={()=>setPriority(x)}>{x}</button>)}</div></fieldset>
    {error&&<p role="alert" className={validation?'subject-validation-error':'error-text'} data-testid="status-subject-error">{validation&&<AlertTriangle size={20}/>} {error}</p>}
    {!validation&&<button className="button-primary create-subject" data-testid="button-create-subject" type="submit">Create subject <ArrowRight size={18}/></button>}<button type="button" className={`button-outline cancel-subject ${validation?'validation-cancel':''}`} data-testid="button-cancel-subject" onClick={()=>go(validation?'/subject/add':'/subjects')}>Cancel</button>
  </form>
 </section></Frame>;
}
function QuizHome() {
 const [,go]=useLocation(); const [subjects]=useSaved<Subject[]>('study-subjects',starterSubjects);
 const shown=subjects.length?subjects:starterSubjects;
 return <Frame nav><section data-testid="screen-quiz-home" className="quiz-home">
  <h1 className="quiz-page-title">Quiz</h1><p className="subtitle">Test Your Knowledge, improve Your<br/> Understanding and track Your progress</p>
  <div className="quiz-promo"><div><b>Small steps<br/> make big progress!</b><p>Take quizzes, learn faster.</p></div><div className="promo-mascot"><Bot size={62}/><BookOpen size={24}/></div></div>
  <div className="section-row"><h2>Your Subjects</h2><button data-testid="button-quiz-view-all" onClick={()=>go('/subjects')}>View All <ArrowRight size={18}/></button></div>
  <div className="quiz-subjects">{shown.slice(0,4).map((s,i)=><button className="quiz-subject card" key={s.name} data-testid={`button-quiz-subject-${i}`} onClick={()=>go('/quiz/setup')}><DatabaseArt/><span><b>{s.name}</b><small>{[5,4,3,3][i%4]} quizzes · {[120,96,72,68][i%4]} questions</small></span><ChevronRight size={22}/></button>)}</div>
  <div className="section-row recent-row"><h2>Recent Quiz Attempts</h2><button data-testid="button-recent-view-all" onClick={()=>go('/quiz/results')}>View All <ArrowRight size={18}/></button></div>
  <button className="recent-quiz list-card" data-testid="button-recent-quiz" onClick={()=>go('/quiz/results')}><span className="success-ring">80%</span><span><b>DBMS- Unit 1</b><small>8/10 correct · 12 min ago</small></span><ChevronRight/></button>
 </section></Frame>;
}
function QuizSetup() {
 const [,go]=useLocation(); const [difficulty,setDifficulty]=useState('Easy'); const [count,setCount]=useState(10); const [unit,setUnit]=useState('Unit 1: introduction to DBMS');
 return <Frame nav><section data-testid="screen-quiz-setup"><Header title="Quiz Setup" back="/quiz"/><div className="setup-subject"><DatabaseArt/><div><b>DBMS</b><small>{unit}</small></div><button data-testid="button-change-subject" onClick={()=>go('/quiz')}>Change</button></div>
  <label className="setup-label">Select Topic/Unit<select className="input" value={unit} data-testid="select-quiz-unit" onChange={e=>setUnit(e.target.value)}>{['Unit 1: introduction to DBMS','Unit 2: Relational model','Unit 3: Normalization','Unit 4: Indexes'].map(x=><option key={x}>{x}</option>)}</select></label>
  <fieldset className="choice-field"><legend>Difficulty Level</legend><div className="choice-row">{['Easy','Medium','Hard'].map(x=><button key={x} data-testid={`button-difficulty-${x.toLowerCase()}`} className={`difficulty ${difficulty===x?'selected '+x.toLowerCase():''}`} onClick={()=>setDifficulty(x)}>{x}</button>)}</div></fieldset>
  <fieldset className="choice-field"><legend>Number of Questions</legend><div className="choice-row question-count">{[5,10,15,20].map(x=><button key={x} data-testid={`button-question-count-${x}`} className={count===x?'selected':''} onClick={()=>setCount(x)}>{x}</button>)}</div></fieldset>
  <div className="ai-quiz-note"><Sparkles size={23}/><div><b>AI Powered Quiz</b><p>We’ll generate questions based on<br/> your selected topic and difficulty level</p></div></div>
  <Action testId="button-generate-quiz" onClick={()=>go('/quiz/question')}>Generate Quiz</Action>
 </section></Frame>;
}
function QuizQuestion() {
 const [,go]=useLocation(); const [selected,setSelected]=useState('B'); const time='08:45';
 return <Frame><section data-testid="screen-quiz-question" className="question-page">
  <div className="question-header"><Header title="DBMS Quiz" back="/quiz/setup"/><span>3/10　{time}</span></div>
  <div className="progress-bar quiz-progress"><span style={{width:'25%'}}/></div>
  <article className="question-card card"><span className="question-type">Multiple choice</span><h2>Which of the following is the primary key characteristic of a DBMS</h2>
   <div className="answers">{[['A','Data independence'],['B','Reduced data redundancy'],['C','increased data duplication'],['D','Faster transaction speed']].map(([letter,text])=><button key={letter} className={`answer ${selected===letter?'picked':''}`} data-testid={`button-answer-${letter.toLowerCase()}`} onClick={()=>setSelected(letter)}><i>{selected===letter&&<span/>}</i><b>{letter}.</b>{text}</button>)}</div>
  </article>
  <div className="question-controls"><button data-testid="button-previous-question" onClick={()=>go('/quiz/setup')}><ChevronLeft/> Previous</button><button data-testid="button-next-question" onClick={()=>go('/quiz/results')}>Next <ArrowRight size={19}/></button></div>
 </section></Frame>;
}
function QuizResults() {
 const [,go]=useLocation();
 return <Frame nav><section data-testid="screen-quiz-results" className="results-page"><Header title="Quiz results" back="/quiz"/>
  <div className="trophy-art"><img src={trophyIllustration} alt="" /></div><h1 className="center result-title">Great job!</h1><p className="subtitle center">You’ve Completed the quiz successfully.</p>
  <div className="result-card card"><div className="result-ring"><strong>80%</strong></div><div className="result-stats"><p><CircleCheck/> <b>8</b> Correct</p><p><CircleX/> <b>2</b> Incorrect</p><p><AlarmClock/> <b>12m 34s</b><small>Time Taken</small></p></div></div>
  <div className="insight-card card"><div><Lightbulb size={28}/><h2>AI Insight</h2></div><p>You did great! You have a strong<br/> grasp of the topic. Focus more on<br/> normalization concepts to improve<br/> your score further</p></div>
  <Action testId="button-try-again" onClick={()=>go('/quiz/question')}>Try Again</Action><button className="back-quiz" data-testid="button-back-to-quiz" onClick={()=>go('/quiz')}>Back to quiz</button>
 </section></Frame>;
}
function Progress() {
 const [,go]=useLocation();
 const bars=[40,70,45,90,65,85];
 return <Frame nav><section data-testid="screen-progress" className="progress-page"><h1 className="section-head">Progress</h1><p className="subtitle">Track your preparation and stay on top of your<br/> goal.</p>
  <div className="overall-card card"><div><h2>Overall progress</h2><p>Your preparation at a glance</p></div><div className="overall-main"><div className="result-ring small-ring"><strong>62%</strong></div><div className="chart-bars">{bars.map((n,i)=><div key={i}><b>{n}</b><span style={{height:`${n}%`}}/><small>may-{4+i}</small></div>)}</div></div>
  <div className="progress-stats"><div><Clock3/><span>Study Time<b>42.5 hrs</b></span></div><div><Target/><span>Quiz accuracy<b>76%</b></span></div><div><Flame/><span>Days Streak<b>6 Days</b></span></div></div></div>
  <div className="section-row subject-wise"><h2>Subject-Wise Progress</h2><Link href="/subjects" data-testid="link-progress-view-all">View All</Link></div>
  <div className="progress-grid">{[['DBMS',72],['Operating System',58],['Computer Network',45],['Software Engineering',68]].map(([n,p],i)=><button className="progress-subject card" key={n} data-testid={`card-progress-${i}`} onClick={()=>go('/subject/overview')}><DatabaseArt/><div><b>{n}</b><small>{['12/16 topics','9/15 topics','7/15 Topics','11/16 Topics'][i]}</small><strong>{p}%</strong><div className="progress-bar"><span style={{width:`${p}%`}}/></div></div></button>)}</div>
  <button className="recommend-banner" data-testid="button-progress-recommendations" onClick={()=>go('/subject/recommendations')}><Lightbulb/><span><b>AI Recommendations</b><small>Focus on weak and get personalized<br/> study suggestions.</small></span></button>
 </section></Frame>;
}
const tabs=[['Overview','/subject/overview'],['Weakness','/subject/weakness'],['Recommendations','/subject/recommendations']] as const;
function SubjectTop({active}:{active:string}) {
 const [,go]=useLocation();
 return <><Header title="DBMS" back="/subjects" right={<span className="icon-btn" data-testid="icon-subject-menu" aria-label="Subject menu"><MoreVertical/></span>}/><div className="subject-summary card"><DatabaseArt/><div><b>Database Management<br/> System</b><small>9/15 topics completed</small></div><div className="mini-ring summary-ring"><b>72%</b></div></div>
 <nav className="subject-tabs">{tabs.map(([label,path])=><button key={path} data-testid={`button-subject-tab-${label.toLowerCase()}`} className={active===label?'active':''} onClick={()=>go(path)}>{label}</button>)}</nav></>;
}
function SubjectOverview() {
 const [,go]=useLocation();
 const topics=[['Introduction to DBMS',100],['Relational model',100],['Normalization',75],['Indexes',50],['Transactions',25]];
 return <Frame nav><section data-testid="screen-subject-overview" className="subject-detail"><SubjectTop active="Overview"/><div className="overview-panel"><h2>Subject Overview</h2><div className="metric-cards"><div><Clock3/><b>12.3 h</b><span>Study Time</span></div><div><Target/><b>78%</b><span>Accuracy</span></div><div><FileText/><b>12/16</b><span>Topics done</span></div></div><h3>Topic Progress</h3>
  {topics.map(([name,p],i)=><div className="topic-row" key={name} data-testid={`row-topic-${i}`}><span className={Number(p)===100?'topic-check':'topic-empty'}><CircleCheck/></span><div><small>{name}</small><div className="progress-bar"><span style={{width:`${p}%`}}/></div></div><b>{p}%</b><ChevronRight size={20}/></div>)}
 </div><button className="recommend-banner detail-recommend" data-testid="button-open-recommendations" onClick={()=>go('/subject/recommendations')}><Sparkles/><span><b>AI Recommendations</b><small>Focus on Normalization & indexes</small></span></button></section></Frame>;
}
function Weakness() {
 const concerns=[['Normalization','Low accuracy in quizzes','High'],['Indexes','Concepts need revision','Medium'],['Transactions','Struggled in last 2 quizzes','Medium']];
 return <Frame nav><section data-testid="screen-subject-weakness" className="subject-detail"><SubjectTop active="Weakness"/><div className="weakness-panel"><h2>Weak Areas</h2><p>Focus more on these topics to improve your score<br/> and overall understanding</p><div className="attention"><CircleHelp/> 3 topics need more attention</div>{concerns.map(([name,desc,level],i)=><div className="weak-row" key={name} data-testid={`row-weak-area-${i}`}><span className="rank">{i+1}</span><span className="weak-copy"><b>{name}</b><small>{desc}</small></span><em className={level.toLowerCase()}>{level}</em><ChevronRight/></div>)}</div>
  <div className="suggestions card"><h2><Bot/> AI Recommendations</h2><p>Personalized suggestions for better results</p>{['Revise normalization concepts with short notes and practice MCQs','Watch a 10-min video on indexes and solve related questions','Take a subject-wise quiz for DBMS (5 questions)'].map((s,i)=><div className="suggestion-row" key={s}><span>{i+1}</span>{s}</div>)}</div>
 </section></Frame>;
}
function Recommendations() {
 const [,go]=useLocation(); const recs:[string,string,LucideIcon][]=[['Personalized study plan','Focus on weak topics and improve accuracy',Target],['Recommended Topics','Normalization,indexes,transactions',BookOpen],['Practice quizzes','5 Topics - wise quizzes suggested',CircleHelp],['Next study step','Revise notes and take a full mock test',CalendarClock]];
  return <Frame nav><section data-testid="screen-subject-recommendations" className="subject-detail recommendations"><SubjectTop active="Recommendations"/><div className="recommend-panel"><h2>AI Recommendations</h2><p>Personalized study plan based on your performance<br/> and goals</p>{recs.map(([name,desc,Icon],i)=><div className="reco-row" key={String(name)} data-testid={`text-recommendation-${i}`}><Icon size={24}/><span><b>{name}</b><small>{desc}</small></span><ChevronRight/></div>)}</div><Action testId="button-start-study-plan" onClick={()=>go('/study-plan/generating')}>Start Study plan</Action></section></Frame>;
}
function ProfilePage() {
 const [profile]=useSaved<Profile>('study-profile',initialProfile); const [,go]=useLocation();
 return <Frame nav><section data-testid="screen-profile" className="profile-page"><h1 className="section-head">Profile</h1><p className="subtitle">Your study journey, your way</p><div className="profile-overview">
   <div className="profile-avatar">{profile.avatar?<img src={profile.avatar} alt="Profile"/>:<img src={profileIllustration} alt="Profile"/>}</div><h2 data-testid="text-profile-name">{profile.name}</h2><p>{profile.email}</p></div>
    <div className="profile-links"><div className="profile-link card" data-testid="card-profile-course"><GraduationCap/><span><b>{profile.course.includes('CSE')?'B.Tech computer science':profile.course}</b><small>{profile.college}</small></span><ChevronRight/></div>
   <button className="profile-link card" data-testid="button-edit-profile" onClick={()=>go('/profile/edit')}><UserRound/><span><b>Edit Profile</b><small>Update your personal information</small></span><ChevronRight/></button>
    <button type="button" className="profile-link card" data-testid="card-settings" onClick={()=>go('/settings')}><Settings/><span><b>Settings</b><small>Manage your app preference</small></span><ChevronRight/></button></div>
 </section></Frame>;
}
function EditProfile() {
 const [profile,save]=useSaved<Profile>('study-profile',initialProfile);
 const fields:[string,keyof Profile,typeof User][]=[['Full name','name',User],['Email Address','email',Mail],['College/University','college',Building2],['Course/ Branch','course',GraduationCap],['Daily study hours','hours',Clock3],['Target Score','score',Goal]];
 return <Frame nav><section data-testid="screen-edit-profile" className="edit-profile">
  <div className="edit-heading"><h1 className="section-head">Edit Profile</h1><button data-testid="button-save-profile" onClick={()=>{localStorage.setItem('study-profile',JSON.stringify(profile));window.dispatchEvent(new Event('storage'));}} className="save-pill">Save</button></div>
  <div className="edit-avatar">{profile.avatar?<img src={profile.avatar} alt="Profile"/>:<img src={profileIllustration} alt="Profile"/>}</div>
  <form onSubmit={e=>{e.preventDefault();localStorage.setItem('study-profile',JSON.stringify(profile));}}>
  {fields.map(([label,key,Icon])=><label className="edit-field" key={key}><Icon size={23}/><span>{label}{key==='email'||key==='name'||key==='college'||key==='course'?<input data-testid={`input-profile-${key}`} value={profile[key]} onChange={e=>save({...profile,[key]:e.target.value})}/>:<select className="input" data-testid={`select-profile-${key}`} value={profile[key]} onChange={e=>save({...profile,[key]:e.target.value})}>{(key==='hours'?['1 - 2 hours','2 - 3 hours','4 - 5 hours','6+ hours']:['60%','70%','80%','90%']).map(x=><option key={x}>{x}</option>)}</select>}</span></label>)}
  </form>
 </section></Frame>;
}
function NotFound(){return <Frame><div className="not-found"><CircleHelp size={40}/><h1>Page not found</h1><Link href="/dashboard" data-testid="link-return-home">Return to StudyFlow</Link></div></Frame>}
function SubjectListRoute(){return <SubjectsPage/>}
function EmptySubjectsRoute(){return <SubjectsPage empty/>}
function EmptySubjectsSearchRoute(){return <EmptySubjectSearch/>}
function AppRoutes() {
 return <Switch>
  <Route path="/" component={Welcome}/><Route path="/welcome" component={Welcome}/><Route path="/intro" component={Intro}/>
  <Route path="/profile-details" component={ProfileDetails}/><Route path="/avatar" component={AvatarPage}/><Route path="/goal" component={GoalPage}/>
  <Route path="/add-subjects" component={AddSubjectsIntro}/><Route path="/dashboard" component={Dashboard}/>
  <Route path="/subjects/no-results" component={EmptySubjectsSearchRoute}/><Route path="/subjects/empty" component={EmptySubjectsRoute}/><Route path="/subjects" component={SubjectListRoute}/>
  <Route path="/subject/add/validation-error" component={AddSubjectValidation}/><Route path="/subject/add" component={AddSubjectForm}/>
  <Route path="/materials/upload-failed" component={UploadFailure}/><Route path="/materials" component={EmptyMaterials}/>
  <Route path="/quiz/empty" component={EmptyQuizAttempts}/><Route path="/quiz" component={QuizHome}/><Route path="/quiz/setup" component={QuizSetup}/>
  <Route path="/quiz/question" component={QuizQuestion}/><Route path="/quiz/results" component={QuizResults}/>
  <Route path="/progress/empty" component={EmptyProgress}/><Route path="/progress" component={Progress}/>
  <Route path="/settings" component={SettingsPage}/>
  <Route path="/notifications/empty" component={EmptyNotifications}/><Route path="/notifications" component={NotificationsList}/>
  <Route path="/assistant/error" component={AssistantUnavailable}/><Route path="/assistant/chat" component={AssistantChat}/><Route path="/assistant/material-summary" component={MaterialSummary}/><Route path="/assistant" component={AssistantHome}/>
  <Route path="/offline" component={OfflineScreen}/>
  <Route path="/study-plan/generating" component={PlanGenerating}/><Route path="/study-plan/generation-error" component={PlanGenerationFailure}/>
  <Route path="/study-plan/resources/empty" component={EmptyStudyPlanResources}/><Route path="/study-plan/resources" component={StudyPlanResources}/>
  <Route path="/study-plan/days" component={StudyPlanDays}/><Route path="/study-plan" component={StudyPlanOverview}/>
  <Route path="/subject/overview" component={SubjectOverview}/><Route path="/subject/weakness" component={Weakness}/>
  <Route path="/subject/recommendations" component={Recommendations}/><Route path="/profile" component={ProfilePage}/><Route path="/profile/edit" component={EditProfile}/>
  <Route component={NotFound}/>
 </Switch>;
}
function App() { return <Router><AppRoutes/></Router>; }
export default App;
