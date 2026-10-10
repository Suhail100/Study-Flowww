import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import {
  BookOpen, CircleHelp, UserRound, Bell, ArrowRight,
  ChevronLeft, ChevronRight, Search, Plus, MoreVertical, Clock3, Target, Flame,
  CircleCheck, CircleX, Trophy, Lightbulb, Upload, NotebookPen, CalendarClock,
  GraduationCap, Settings, Mail, Building2, Goal, User, X, Brain, FileText,
  CircleUserRound, Medal, Star, Sparkles, ChartLine,
  Bot, CloudUpload, Pencil, AlarmClock, AlertTriangle, Database, Monitor, Network,
  Calculator, Code2, Atom, FlaskConical, Leaf, Languages
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Action, Frame, Header } from './components/app-shell';
import {
  StudyFlowProvider,
  makeId,
  useStudyFlow,
  type Profile,
  type QuizAnswer,
  type QuizAttempt,
  type QuizSession,
  type StudyTask,
  type Subject,
  type SubjectDraft,
} from './lib/study-flow-store';
import profileIllustration from './assets/profile-illustration.png';
import emptyBooks from './assets/empty-books.png';
import trophyIllustration from './assets/trophy.png';
import subjectBookReference from './assets/reference/subject-book.png';
import { EmptyProgress, EmptyQuizAttempts, EmptyMaterials, UploadFailure, EmptySubjectSearch, OfflineScreen } from './pages/reference-states';
import { SettingsPage, SettingsInfoPage, EmptyNotifications, NotificationsList } from './pages/reference-preferences';
import {
  PlanGenerating,
  PlanGenerationFailure,
  StudyPlanOverview,
  StudyPlanDays,
  StudyPlanResources,
  EmptyStudyPlanResources,
} from './pages/reference-study-plan';
import { getSampleQuestions } from './lib/sample-quiz-data';
import materialsEmptyArt from './assets/reference/materials-empty.png';
import './index.css';
import './reference-screens.css';

function localDateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}

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
  <p className="subtitle center">Your study companion for planning,<br/>practice quizzes, and progress tracking</p>
  <div className="intro-features">
    <div><span><FileText/></span>Build a study plan</div><div><span><Brain/></span>Practice sample quizzes</div><div><span><ChartLine/></span>Track completed work</div>
  </div>
   <Action testId="button-next-profile" className="intro-next-action" onClick={()=>go('/profile-details')}>Next <ArrowRight size={19}/></Action>
  <p className="login-prompt">Already have an account? <span data-testid="text-login-label">Log in</span></p>
 </div></Frame>;
}
function ProfileDetails() {
  const {data,updateProfile}=useStudyFlow(); const profile=data.profile; const [,go]=useLocation();
 const fields:[string,keyof Profile][]=[['Full Name','name'],['College/University','college'],['Degree/Course','course'],['Year/Semester','year']];
 return <Frame><section data-testid="screen-profile-details" className="profile-details">
   <h1 className="title">Tell Us About Yourself</h1><p className="subtitle">Let’s set up your profile to<br/> get started</p>
   <div className="profile-symbol"><CircleUserRound size={94} strokeWidth={1.1}/><Plus className="profile-add" size={24}/></div>
    <form onSubmit={(e:FormEvent)=>{e.preventDefault();go('/avatar')}}>{fields.map(([label,key])=><label className="field-label" key={key}>{label}<input data-testid={`input-${key}`} className="input" value={profile[key]} onChange={e=>updateProfile({[key]:e.target.value})}/></label>)}
   <button className="button-primary profile-next" data-testid="button-next-avatar" type="submit">Next <ArrowRight size={19}/></button></form>
  </section></Frame>;
}
function AvatarPage() {
  const {data,updateProfile}=useStudyFlow(); const profile=data.profile; const [,go]=useLocation();
  const [preview,setPreview]=useState('');
  const [cameraOpen,setCameraOpen]=useState(false);
  const [cameraMessage,setCameraMessage]=useState('');
  const videoRef=useRef<HTMLVideoElement>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const stopCamera=()=>{streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;};
  useEffect(()=>{
    if(!cameraOpen)return;
    if(!navigator.mediaDevices?.getUserMedia){setCameraMessage('Camera is unavailable in this browser. Choose a photo from your gallery.');setCameraOpen(false);return;}
    let cancelled=false;
    navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}}).then(stream=>{
      if(cancelled){stream.getTracks().forEach(track=>track.stop());return;}
      streamRef.current=stream;
      if(videoRef.current){videoRef.current.srcObject=stream;void videoRef.current.play();}
      setCameraMessage('');
    }).catch(()=>{setCameraMessage('Camera permission was denied or the camera is unavailable. Choose a photo from your gallery.');setCameraOpen(false);});
    return()=>{cancelled=true;stopCamera();};
  },[cameraOpen]);
  const handleFile=(e:ChangeEvent<HTMLInputElement>)=>{const input=e.target;const file=input.files?.[0];input.value='';if(!file)return;if(!file.type.startsWith('image/')&&!/\.(png|jpe?g|gif|webp)$/i.test(file.name)){setCameraMessage('Choose an image file.');return;}if(file.size>5*1024*1024){setCameraMessage('Choose an image under 5 MB.');return;}const r=new FileReader();r.onload=()=>{setPreview(String(r.result));setCameraOpen(false);};r.onerror=()=>setCameraMessage('This image could not be previewed. Choose another photo.');r.readAsDataURL(file);};
  const capturePhoto=()=>{const video=videoRef.current;if(!video||!video.videoWidth){setCameraMessage('Camera is still starting. Try again or choose a gallery photo.');return;}const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d')?.drawImage(video,0,0);setPreview(canvas.toDataURL('image/jpeg',.86));setCameraOpen(false);};
  const confirmPhoto=()=>{if(preview){updateProfile({avatar:preview});setPreview('');setCameraMessage('Photo preview saved for this session. Secure photo storage is not connected.');}};
 return <Frame><section className="avatar-page" data-testid="screen-avatar">
  <h1 className="title">Add Profile Picture</h1><p className="subtitle">Choose a photo or upload<br/> one from your gallery.</p>
  {cameraOpen?<div className="camera-preview"><video ref={videoRef} autoPlay playsInline muted/><button type="button" className="button-primary" data-testid="button-capture-photo" onClick={capturePhoto}>Take photo</button></div>:<div className="avatar-ring">{preview||profile.avatar?<img src={preview||profile.avatar} alt="Profile photo preview"/>:<UserRound size={95} strokeWidth={.8}/>}</div>}
  {preview?<div className="avatar-confirm-actions"><button type="button" className="button-primary" data-testid="button-confirm-photo" onClick={confirmPhoto}>Use this photo</button><button type="button" className="button-outline" data-testid="button-retake-photo" onClick={()=>{setPreview('');setCameraMessage('');setCameraOpen(true);}}>Retake</button></div>:<><button type="button" className="button-primary upload-button" data-testid="button-open-camera" onClick={()=>{setCameraMessage('');setCameraOpen(true);}}><Upload size={18}/> Upload photo</button><button className="gallery-button" data-testid="button-choose-gallery" onClick={()=>document.querySelector<HTMLInputElement>('[data-testid="input-avatar-upload"]')?.click()}>Choose From Gallery</button><input className="visually-hidden-file" type="file" accept="image/*" onChange={handleFile} data-testid="input-avatar-upload"/></>}
   {cameraMessage&&<small className="local-photo-note" role="status">{cameraMessage}</small>}
   {!cameraMessage&&<small className="local-photo-note">Photo is previewed locally; cloud storage is not connected.</small>}
   <button className="skip-link" data-testid="button-skip-avatar" onClick={()=>go('/goal')}>Skip</button>
 </section></Frame>;
}
function GoalPage() {
  const [,go]=useLocation(); const {data,updatePreferences}=useStudyFlow(); const goal=data.preferences.targetScore; const hours=data.preferences.dailyHours; const [selectedGoal,setSelectedGoal]=useState('');
 const choices:[string,string,LucideIcon][]=[['Score 90%','High performance',Trophy],['Score 80%','Top performer',Medal],['Score 70%','Good grades,decent marks',Medal],['Score 60%','Pass with good marks',Star]];
 return <Frame><section data-testid="screen-goal"><h1 className="title">Set Your Goal</h1><p className="subtitle">What is Your Main Goal For<br/> This Semester?</p>
   <div className="goal-options">{choices.map(([name,desc,Icon])=><button key={String(name)} className={`goal-option ${selectedGoal===String(name).slice(6)?'chosen':''}`} data-testid={`button-goal-${String(name).slice(6,8)}`} onClick={()=>{const value=String(name).slice(6);setSelectedGoal(value);updatePreferences({targetScore:value});}}><Icon size={39} strokeWidth={1.35}/><span><b>{name}</b><small>{desc}</small></span></button>)}</div>
   <label className="select-label">Target score<input className="input" data-testid="input-target-score" value={goal} placeholder="e.g. 80%" onChange={e=>updatePreferences({targetScore:e.target.value})}/></label>
   <label className="select-label">Daily study Time<select className="input" value={hours} data-testid="select-study-hours" onChange={e=>updatePreferences({dailyHours:e.target.value})}><option value="">Choose daily study time</option>{['1hr','2hrs','3hrs','4 - 5 hours','6+ hours'].map(x=><option key={x}>{x}</option>)}</select></label>
  <div style={{margin:'28px 5px 0'}}><Action testId="button-next-subjects" onClick={()=>go('/add-subjects')}>Next</Action></div>
 </section></Frame>;
}
function AddSubjectsIntro() {
  const [,go]=useLocation(); const {data,addSubject}=useStudyFlow();
  const [files,setFiles]=useState<File[]>([]); const [selected,setSelected]=useState<string[]>([]); const [fileErrors,setFileErrors]=useState<string[]>([]);
  const starters=['Data Structures','AIML','Python','English','Language'];
  const maxBytes=15*1024*1024;
  const chooseFiles=(event:ChangeEvent<HTMLInputElement>)=>{
    const next=Array.from(event.target.files??[]);const accepted:File[]=[];const errors:string[]=[];
    for(const file of next){
      if(!/\.(pdf|doc|docx|ppt|pptx|jpg|jpeg|png)$/i.test(file.name)){errors.push(`${file.name}: unsupported file type.`);continue;}
      if(file.size>maxBytes){errors.push(`${file.name}: larger than 15 MB.`);continue;}
      accepted.push(file);
    }
    setFiles(current=>[...current,...accepted.filter(file=>!current.some(existing=>existing.name===file.name&&existing.size===file.size))]);
    setFileErrors(errors);event.target.value='';
  };
  const addSelected=()=>{
    const already=selected.filter(name=>data.subjects.some(subject=>subject.name.toLowerCase()===name.toLowerCase()));
    const toAdd=selected.filter(name=>!data.subjects.some(subject=>subject.name.toLowerCase()===name.toLowerCase()));
    toAdd.forEach(name=>addSubject({name,examDate:'',goal:'',priority:'Medium'}));
    setFileErrors(already.length?[`${already.join(', ')} ${already.length===1?'is':'are'} already in your subjects.`]:[]);
    setSelected([]);
  };
  const sizeLabel=(size:number)=>size<1024*1024?`${Math.max(1,Math.round(size/1024))} KB`:`${(size/(1024*1024)).toFixed(1)} MB`;
 return <Frame><section data-testid="screen-add-subjects"><h1 className="title">Add Your Subject</h1><p className="subtitle">Upload your subjects files or add them<br/> manually,you can rename them later.</p>
    <label className="file-drop"><CloudUpload size={56} strokeWidth={1.1}/><b>Choose subject files</b><small>PDF, DOC/DOCX, PPT/PPTX, JPG/JPEG/PNG · max 15 MB each</small><input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" data-testid="input-subject-files" onChange={chooseFiles}/></label>
    {files.length>0&&<div className="selected-local-files"><b>Selected on this device · not uploaded</b>{files.map((file,index)=><div key={`${file.name}-${index}`}><FileText size={17}/><span>{file.name}<small>{sizeLabel(file.size)} · local selection only</small></span><button type="button" aria-label={`Remove ${file.name}`} onClick={()=>setFiles(current=>current.filter((_,i)=>i!==index))}><X size={17}/></button></div>)}</div>}
    {fileErrors.map(error=><p role="alert" className="form-error" key={error}>{error}</p>)}
   <h2 className="muted-heading">Or add manually</h2>
   <div className="starter-subjects">{starters.map((s,i)=>{const exists=data.subjects.some(subject=>subject.name.toLowerCase()===s.toLowerCase());const chosen=selected.includes(s);return <button key={s} className={`starter-row ${chosen?'selected':''}`} aria-pressed={chosen} data-testid={`button-add-${s.replaceAll(' ','-')}`} onClick={()=>{if(exists){setFileErrors([`${s} is already in your subjects.`]);return;}setSelected(current=>chosen?current.filter(item=>item!==s):[...current,s]);}}><span className={`note-icon note-${i}`}><NotebookPen size={26}/></span>{s}{exists?<small>Added</small>:chosen?<CircleCheck size={20}/>:<Plus size={19}/>}</button>;})}</div>
   {selected.length>0&&<button type="button" className="button-primary confirm-manual-subjects" data-testid="button-confirm-add-subjects" onClick={addSelected}>Add {selected.length} selected subject{selected.length===1?'':'s'}</button>}
   <div className="onboard-next"><Action testId="button-finish-onboarding" onClick={()=>go('/dashboard')}>Next</Action></div>
 </section></Frame>;
}
function Dashboard() {
  const {data,setSelectedSubject}=useStudyFlow(); const {profile,subjects,studyPlan,quizAttempts}=data; const [showTip,setShowTip]=useState(true); const [location,go]=useLocation();
  const [recommendationIndex,setRecommendationIndex]=useState(0);
  const today = localDateKey();
  const todayTasks = studyPlan?.tasks.filter(task=>task.scheduledFor===today&&!task.completedAt) ?? [];
  const completedTasks = studyPlan?.tasks.filter(task=>Boolean(task.completedAt)).length ?? 0;
  const activeSubject = subjects.find(subject=>subject.id===data.selectedSubjectId) ?? subjects[0];
  const recommendationSubject=subjects[recommendationIndex%Math.max(1,subjects.length)];
  const subjectAttempts=quizAttempts.filter(attempt=>attempt.subjectId===recommendationSubject?.id);
  const missedTopics=subjectAttempts.flatMap(attempt=>attempt.answers.filter(answer=>answer.selectedOption!==answer.correctOption).map(answer=>answer.topic));
  const pendingTask=studyPlan?.tasks.find(task=>task.subjectId===recommendationSubject?.id&&!task.completedAt);
  const recommendation=subjects.length===0
    ? {title:'Add a subject to begin',detail:'Your dashboard recommendations will use only the subjects you add.',target:'/subjects',action:'Add subject'}
    : pendingTask
      ? {title:pendingTask.title,detail:`${recommendationSubject.name} · ${pendingTask.minutes} minutes`,target:'/study-plan/days',action:'Open task'}
      : missedTopics.length
        ? {title:`Review ${missedTopics[0]}`,detail:`Your saved ${recommendationSubject.name} quiz answers show a missed question in this topic.`,target:'/subject/weakness',action:'Review topic'}
        : getSampleQuestions(recommendationSubject.name).length
          ? {title:`Try a sample quiz in ${recommendationSubject.name}`,detail:'Offline questions are available; results will be saved to this subject.',target:'/quiz/setup',action:'Start quiz'}
          : {title:`Set up ${recommendationSubject.name}`,detail:'Add its exam date and target score to make a study plan.',target:'/subject/overview',action:'View subject'};
  const openAssistant = () => {
    if (!activeSubject) { go('/subjects'); return; }
    setSelectedSubject(activeSubject.id);
    go('/subject/chat');
  };
  const openRecommendation=()=>{
    if(recommendationSubject)setSelectedSubject(recommendationSubject.id);
    go(recommendation.target);
  };
 return <Frame nav><section className="dashboard" data-testid="screen-dashboard">
    <div className="dash-heading"><div><h1 className="title">Good Morning, {profile.name.trim().split(' ')[0]||'Student'}</h1><p className="subtitle">{subjects.length?'Your learning activity at a glance':'Add a subject to get started'}</p></div><button className="icon-btn" data-testid="icon-notifications" aria-label="Notifications" onClick={()=>go(`/notifications?from=${encodeURIComponent(location)}`)}><Bell/></button></div>
   {subjects.length===0
    ? <div className="dashboard-empty card"><BookOpen size={38}/><h2>No subjects yet</h2><p>Add a subject to create quizzes, track progress, and build a study plan.</p><button className="button-primary" onClick={()=>go('/subject/add')} data-testid="button-dashboard-add-subject">Add your first subject</button></div>
    : <div className="goal-card card"><div><h3>Your Goal</h3><p>Target <b>{profile.score||data.preferences.targetScore||'Not set'}</b></p></div><div className="ring-chart"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43"/><circle className="ring-progress" cx="50" cy="50" r="43" style={{strokeDasharray:`${studyPlan&&studyPlan.tasks.length?Math.round(completedTasks/studyPlan.tasks.length*270):0} 270`}}/></svg><strong>{studyPlan&&studyPlan.tasks.length?Math.round(completedTasks/studyPlan.tasks.length*100):0}%</strong><small>Tasks complete</small></div>
    <div className="stat-strip"><div><b>{subjects.length}</b><span>Subjects</span></div><div><b>{quizAttempts.length}</b><span>Quizzes</span></div><div><b>{studyPlan?.tasks.filter(task=>!task.completedAt).length??0}</b><span>Tasks left</span></div></div></div>}
    <div className="focus-head"><h2>Today’s Focus</h2><Link href={studyPlan?'/study-plan':'/study-plan/days'} data-testid="link-view-plans">View Plan <ArrowRight size={19}/></Link></div>
   {todayTasks.length ? <div className="focus-cards">{todayTasks.map(task=>{const subject=subjects.find(item=>item.id===task.subjectId);return <button key={task.id} data-testid={`card-focus-${task.id}`} onClick={()=>{if(subject){setSelectedSubject(subject.id);go('/subject/overview');}}} className="focus-card"><b>{task.title}</b><span>{task.minutes} min · {subject?.name}</span></button>;})}</div> : <p className="dashboard-no-tasks">{studyPlan?'No unfinished study tasks scheduled for today.':'No study plan yet. Your plan will use your saved subjects and study preferences.'}</p>}
    {showTip&&<div className="assistant-banner recommendation-banner" data-testid="dashboard-recommendation"><Lightbulb size={34}/><div className="recommendation-copy"><b>Study suggestion</b><p>{recommendation.title}<small>{recommendation.detail}</small></p><button type="button" className="recommendation-action" onClick={openRecommendation}>{recommendation.action} <ArrowRight size={16}/></button></div>
      {subjects.length>1&&<button type="button" className="recommendation-next" aria-label="Next subject suggestion" data-testid="button-next-recommendation" onClick={()=>setRecommendationIndex((recommendationIndex+1)%subjects.length)}><ChevronRight/></button>}
      <button data-testid="button-dismiss-tip" aria-label="Dismiss suggestion" onClick={()=>setShowTip(false)}><X size={21}/></button></div>}
 </section></Frame>;
}
function SubjectsPage({empty=false}:{empty?:boolean}) {
  const {data,updateSubject,deleteSubject,setSelectedSubject}=useStudyFlow(); const {subjects,studyPlan,quizAttempts}=data;
  const [query,setQuery]=useState(''); const [tab,setTab]=useState<'mine'|'all'>('mine'); const [openMenu,setOpenMenu]=useState<string|null>(null); const [,go]=useLocation();
  const filtered=useMemo(()=>subjects.filter(s=>s.name.toLowerCase().includes(query.toLowerCase())),[subjects,query]);
  const openSubject=(subject:Subject)=>{setSelectedSubject(subject.id);go('/subject/overview');};
  const renameSubject=(subject:Subject)=>{
    const name=window.prompt('Rename subject',subject.name)?.trim();
    if(!name||name.toLowerCase()===subject.name.toLowerCase())return;
    if(subjects.some(item=>item.id!==subject.id&&item.name.toLowerCase()===name.toLowerCase())){window.alert('A subject with that name already exists.');return;}
    updateSubject(subject.id,{name});
  };
 return <Frame nav><section data-testid={empty?'screen-empty-subjects':'screen-subjects'} className="subjects-page">
  <div className="subjects-heading"><h1 className="title">Subjects</h1>{!empty&&<><button className="search-icon" data-testid="button-focus-search" onClick={()=>document.querySelector<HTMLInputElement>('[data-testid="input-search-subjects"]')?.focus()}><Search/></button><Link className="add-pill" href="/subject/add" data-testid="link-add-subject"><Plus size={15}/> Add</Link></>}</div>
   <div className="search-box"><Search size={18}/><input data-testid="input-search-subjects" placeholder="Search Subjects.." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&query.trim()&&!filtered.length)go('/subjects/no-results');}}/></div>
  <div className="tabs"><button className={tab==='mine'?'active':''} data-testid="button-tab-my-subjects" onClick={()=>setTab('mine')}>My Subjects</button><button className={tab==='all'?'active':''} data-testid="button-tab-all-subjects" onClick={()=>setTab('all')}>All</button></div>
   {(empty||(!filtered.length&&subjects.length===0))?<div className="empty-state"><div className="book-stack"><img src={emptyBooks} alt="" /></div><h2>No Subjects added yet</h2><p>Add your subjects to start building<br/> your personalized study plan</p><Link href="/subject/add" className="button-primary empty-add" data-testid="link-empty-add"><Plus size={20}/> Add Subjects</Link></div>
   :!filtered.length?<div className="empty-search"><Search size={40}/><p>No subjects match “{query}”</p></div>:
     <div className="subject-list">{filtered.map((s,i)=>{
       const tasks=studyPlan?.tasks.filter(task=>task.subjectId===s.id)??[];
       const completed=tasks.filter(task=>task.completedAt).length;
       const attempts=quizAttempts.filter(attempt=>attempt.subjectId===s.id);
       return <article className="subject-row list-card" key={s.id} data-testid={`card-subject-${s.id}`} onClick={()=>openSubject(s)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSubject(s);}}}>
       <div className={`subject-art art-${i%4}`}><SubjectIcon name={s.name}/></div><div className="subject-info"><b>{s.name}</b><small>{s.examDate?`Exam · ${new Date(`${s.examDate}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}`:'Exam date not set'}</small>{tasks.length>0?<div className="progress-bar"><span style={{width:`${Math.round(completed/tasks.length*100)}%`}}/></div>:<small>{attempts.length?`${attempts.length} quiz${attempts.length===1?'':'zes'} completed`:'No activity yet'}</small>}</div>
       {tasks.length>0&&<div className="mini-ring" style={{'--pct':`${Math.round(completed/tasks.length*100)}%`} as React.CSSProperties}><b>{Math.round(completed/tasks.length*100)}%</b></div>}
       <div className="subject-actions"><button className="more-btn" type="button" data-testid={`button-menu-subject-${i}`} onClick={e=>{e.stopPropagation();setOpenMenu(openMenu===s.id?null:s.id);}} aria-label={`Subject options for ${s.name}`}><MoreVertical size={21}/></button>{openMenu===s.id&&<div className="subject-action-menu" onClick={e=>e.stopPropagation()}><button type="button" onClick={()=>{setOpenMenu(null);renameSubject(s);}}>Rename</button><button type="button" onClick={()=>{setOpenMenu(null);if(window.confirm(`Delete ${s.name}? This also deletes its local materials, chat history, study tasks, and quiz attempts.`))deleteSubject(s.id);}}>Delete</button></div>}</div>
     </article>})}</div>}
 </section></Frame>;
}
const subjectIconRules:[RegExp,LucideIcon][]=[
  [/\b(dbms|database)\b/i,Database],
  [/\b(os|operating systems?)\b/i,Monitor],
  [/\b(cn|networks?|networking)\b/i,Network],
  [/\b(math|maths|mathematics)\b/i,Calculator],
  [/\b(programming|coding|code)\b/i,Code2],
  [/\bphysics\b/i,Atom],
  [/\bchemistry\b/i,FlaskConical],
  [/\bbiology\b/i,Leaf],
  [/\b(english|language|languages)\b/i,Languages],
];
function SubjectIcon({name}:{name:string}){const Icon=subjectIconRules.find(([pattern])=>pattern.test(name))?.[1]??BookOpen;return <div className="db-art subject-icon" aria-hidden="true"><Icon size={32} strokeWidth={1.65}/></div>}
function AddSubjectForm(){return <SubjectForm/>}
function AddSubjectValidation(){return <SubjectForm validation/>}
function SubjectForm({validation=false}:{validation?:boolean}) {
  const {data,addSubject,setSubjectDraft,setSelectedSubject}=useStudyFlow(); const [,go]=useLocation();
  const [draft,setDraft]=useState<SubjectDraft>(()=>data.subjectDraft??{name:'',examDate:'',goal:'',priority:'Medium'});
  const [error,setError]=useState(validation?'Please fill in all required fields':'');
  const update=(patch:Partial<SubjectDraft>)=>{setDraft(current=>({...current,...patch}));setError('');};
  const submit=(e:FormEvent)=>{e.preventDefault();const name=draft.name.trim();if(!name||!draft.examDate||!draft.goal.trim()){setError('Please fill in all required fields');setSubjectDraft(draft);if(!validation)go('/subject/add/validation-error');return;}const created=addSubject({...draft,name});if(!created){setError('A subject with that name already exists.');return;}setSelectedSubject(created.id);go('/subjects');};
  return <Frame><section className={validation?'subject-add-validation':''} data-testid={validation?'screen-add-subject-validation':'screen-add-subject'}><Header title="Add subject" back={validation?'/subject/add':'/subjects'}/><div className="form-book">{validation?<img src={subjectBookReference} alt=""/>:<BookOpen size={46}/>}</div><h2 className="center form-title">Enter Subject details</h2><p className="subtitle center form-subtitle">Add subject name, goal,exam date and<br/> set its priority.</p>
  <form onSubmit={submit} className="subject-form">
    <label className="form-box"><b>Subject Name<span>*</span></b><div><BookOpen size={22}/><input placeholder="e.g. Database management" data-testid="input-subject-name" value={draft.name} onChange={e=>update({name:e.target.value})}/></div></label>
    <label className="form-box"><b>Exam Date<span>*</span></b><div><CalendarClock size={22}/><input type="date" data-testid="input-exam-date" value={draft.examDate} onChange={e=>update({examDate:e.target.value})}/></div></label>
    <label className="form-box"><b>Goal ( Target score)<span>*</span></b><div><Target size={22}/><input placeholder="e.g. 80%" data-testid="input-subject-goal" value={draft.goal} onChange={e=>update({goal:e.target.value})}/></div></label>
    <fieldset className="form-box priority-field"><legend>Priority</legend><div className="priority-options">{(['High','Medium','Low'] as const).map(x=><button type="button" key={x} data-testid={`button-priority-${x.toLowerCase()}`} className={draft.priority===x?'selected':''} onClick={()=>update({priority:x})}>{x}</button>)}</div></fieldset>
    {error&&<p role="alert" className={validation?'subject-validation-error':'error-text'} data-testid="status-subject-error">{validation&&<AlertTriangle size={20}/>} {error}</p>}
    {!validation&&<button className="button-primary create-subject" data-testid="button-create-subject" type="submit">Create subject <ArrowRight size={18}/></button>}<button type="button" className={`button-outline cancel-subject ${validation?'validation-cancel':''}`} data-testid="button-cancel-subject" onClick={()=>{if(validation)setSubjectDraft(draft);else setSubjectDraft(null);go(validation?'/subject/add':'/subjects');}}>Cancel</button>
  </form>
 </section></Frame>;
}
function QuizHome() {
  const [,go]=useLocation(); const {data,setSelectedSubject}=useStudyFlow(); const {subjects,quizAttempts}=data;
 return <Frame nav><section data-testid="screen-quiz-home" className="quiz-home">
  <h1 className="quiz-page-title">Quiz</h1><p className="subtitle">Test Your Knowledge, improve Your<br/> Understanding and track Your progress</p>
   <div className="quiz-promo"><div><b>Practice with<br/> sample questions</b><p>Offline sample bank · not AI-generated</p></div><div className="promo-mascot"><Bot size={62}/><BookOpen size={24}/></div></div>
  <div className="section-row"><h2>Your Subjects</h2><button data-testid="button-quiz-view-all" onClick={()=>go('/subjects')}>View All <ArrowRight size={18}/></button></div>
   {subjects.length===0?<div className="quiz-empty-inline"><img src={emptyBooks} alt=""/><h2>Add a subject before starting a quiz</h2><button className="button-primary" onClick={()=>go('/subjects')}>Explore subjects</button></div>
    :<div className="quiz-subjects">{subjects.map((s,i)=>{const count=getSampleQuestions(s.name).length;return <button className="quiz-subject card" key={s.id} data-testid={`button-quiz-subject-${i}`} onClick={()=>{setSelectedSubject(s.id);go('/quiz/setup');}}><SubjectIcon name={s.name}/><span><b>{s.name}</b><small>{count?`${count} offline sample questions`:'No offline sample set'}</small></span><ChevronRight size={22}/></button>;})}</div>}
   <div className="section-row recent-row"><h2>Recent Quiz Attempts</h2>{quizAttempts.length>0&&<button data-testid="button-recent-view-all" onClick={()=>go('/quiz/results')}>Latest <ArrowRight size={18}/></button>}</div>
   {quizAttempts.length===0?<p className="quiz-no-attempts">No quiz attempts yet. Complete a quiz to see your results here.</p>:quizAttempts.slice(0,3).map(attempt=><button className="recent-quiz list-card" key={attempt.id} data-testid="button-recent-quiz" onClick={()=>go('/quiz/results')}><span className="success-ring">{Math.round(attempt.correct/attempt.total*100)}%</span><span><b>{attempt.subjectName}</b><small>{attempt.correct}/{attempt.total} correct · {new Date(attempt.completedAt).toLocaleDateString()}</small></span><ChevronRight/></button>)}
 </section></Frame>;
}
function QuizSetup() {
  const [,go]=useLocation(); const {data,setSelectedSubject,setQuizSession}=useStudyFlow(); const [difficulty,setDifficulty]=useState('Easy'); const [count,setCount]=useState(5);
  const subject=data.subjects.find(item=>item.id===data.selectedSubjectId)??data.subjects[0];
  const bank=subject?getSampleQuestions(subject.name):[];
  const topics=Array.from(new Set(bank.map(question=>question.topic)));
  const [unit,setUnit]=useState('All topics');
  const questions=unit==='All topics'?bank:bank.filter(question=>question.topic===unit);
  const startQuiz=()=>{if(!subject||!questions.length)return;const selected=questions.slice(0,Math.min(count,questions.length));setSelectedSubject(subject.id);setQuizSession({subjectId:subject.id,difficulty,unit,questionIds:selected.map(q=>q.id),answers:selected.map(()=>null),currentIndex:0,startedAt:Date.now()});go('/quiz/question');};
  return <Frame nav><section data-testid="screen-quiz-setup"><Header title="Quiz Setup" back="/quiz"/>
   {data.subjects.length===0?<div className="quiz-empty-inline"><h2>Add a subject to start a quiz</h2><button className="button-primary" onClick={()=>go('/subjects')}>Add subject</button></div>:<>
   <div className="setup-subject"><SubjectIcon name={subject?.name??''}/><div><b>{subject?.name}</b><small>{unit}</small></div><button data-testid="button-change-subject" onClick={()=>go('/quiz')}>Change</button></div>
   <label className="setup-label">Subject<select className="input" value={subject?.id??''} data-testid="select-quiz-subject" onChange={e=>{setSelectedSubject(e.target.value);setUnit('All topics');}}>{data.subjects.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
   <label className="setup-label">Select Topic/Unit<select className="input" value={unit} data-testid="select-quiz-unit" onChange={e=>setUnit(e.target.value)}><option>All topics</option>{topics.map(topic=><option key={topic}>{topic}</option>)}</select></label>
  <fieldset className="choice-field"><legend>Difficulty Level</legend><div className="choice-row">{['Easy','Medium','Hard'].map(x=><button key={x} data-testid={`button-difficulty-${x.toLowerCase()}`} className={`difficulty ${difficulty===x?'selected '+x.toLowerCase():''}`} onClick={()=>setDifficulty(x)}>{x}</button>)}</div></fieldset>
   <fieldset className="choice-field"><legend>Number of Questions</legend><div className="choice-row question-count">{[5,10,15,20].map(x=><button type="button" key={x} data-testid={`button-question-count-${x}`} disabled={x>questions.length} className={count===x?'selected':''} onClick={()=>setCount(x)}>{x}</button>)}</div></fieldset>
   <div className="ai-quiz-note"><Sparkles size={23}/><div><b>Offline sample quiz</b><p>{bank.length?`${questions.length} sample questions available for this subject. No AI questions are generated.`:'No offline sample bank for this subject. Gemini quiz generation is not connected.'}</p></div></div>
   <button className="button-primary" type="button" data-testid="button-generate-quiz" onClick={startQuiz} disabled={!questions.length}>Start sample quiz</button>
   </>}
 </section></Frame>;
}
function QuizQuestion() {
  const [,go]=useLocation(); const {data,setQuizSession,saveQuizAttempt}=useStudyFlow(); const session=data.quizSession;
  const [elapsedSeconds,setElapsedSeconds]=useState(0);
  useEffect(()=>{
    if(!session)return;
    const update=()=>setElapsedSeconds(Math.max(0,Math.floor((Date.now()-session.startedAt)/1000)));
    update();const timer=window.setInterval(update,1000);return()=>window.clearInterval(timer);
  },[session?.startedAt]);
  const subject=session?data.subjects.find(item=>item.id===session.subjectId):undefined;
  const bank=subject?getSampleQuestions(subject.name):[];
  const questions=session?session.questionIds.map(id=>bank.find(question=>question.id===id)).filter((question):question is NonNullable<typeof question>=>Boolean(question)):[];
  const current=session?questions[session.currentIndex]:undefined;
  const finish=()=>{if(!session||!subject||questions.length===0)return;const answers:QuizAnswer[]=questions.map((question,index)=>({questionId:question.id,selectedOption:session.answers[index]??-1,correctOption:question.correctOption,topic:question.topic}));const correct=answers.filter(answer=>answer.selectedOption===answer.correctOption).length;saveQuizAttempt({subjectId:subject.id,subjectName:subject.name,durationSeconds:Math.max(0,Math.round((Date.now()-session.startedAt)/1000)),total:questions.length,correct,answers});go('/quiz/results');};
  if(!session||!current||!subject)return <Frame nav><section className="quiz-empty-inline"><h2>No quiz is in progress</h2><button className="button-primary" onClick={()=>go('/quiz')}>Return to quizzes</button></section></Frame>;
  const selectAnswer=(answer:number)=>setQuizSession({...session,answers:session.answers.map((item,index)=>index===session.currentIndex?answer:item)});
  const selected=session.answers[session.currentIndex];
 return <Frame><section data-testid="screen-quiz-question" className="question-page">
   <div className="question-header"><Header title={`${subject.name} sample quiz`} back="/quiz/setup"/><span>{session.currentIndex+1}/{questions.length} · {String(Math.floor(elapsedSeconds/60)).padStart(2,'0')}:{String(elapsedSeconds%60).padStart(2,'0')}</span></div>
   <p className="sample-quiz-disclaimer">Offline sample questions · not AI-generated</p>
   <div className="progress-bar quiz-progress"><span style={{width:`${(session.currentIndex+1)/questions.length*100}%`}}/></div>
   <article className="question-card card"><span className="question-type">{current.topic} · {session.difficulty}</span><h2>{current.question}</h2>
    <div className="answers">{current.options.map((text,index)=><button key={text} className={`answer ${selected===index?'picked':''}`} data-testid={`button-answer-${String.fromCharCode(97+index)}`} onClick={()=>selectAnswer(index)}><i>{selected===index&&<span/>}</i><b>{String.fromCharCode(65+index)}.</b>{text}</button>)}</div>
  </article>
   <div className="question-controls"><button data-testid="button-previous-question" disabled={session.currentIndex===0} onClick={()=>setQuizSession({...session,currentIndex:session.currentIndex-1})}><ChevronLeft/> Previous</button><button data-testid="button-next-question" disabled={selected===null} onClick={()=>{if(session.currentIndex<questions.length-1)setQuizSession({...session,currentIndex:session.currentIndex+1});else finish();}}>{session.currentIndex===questions.length-1?'Submit quiz':'Next'} <ArrowRight size={19}/></button></div>
 </section></Frame>;
}
function QuizResults() {
  const [,go]=useLocation(); const {data}=useStudyFlow(); const attempt=data.quizAttempts.find(item=>item.id===data.lastQuizAttemptId);
  if(!attempt)return <EmptyQuizAttempts/>;
  const incorrect=attempt.total-attempt.correct;
  const percent=Math.round(attempt.correct/attempt.total*100);
  const resultSubject=data.subjects.find(subject=>subject.id===attempt.subjectId);
  const answerQuestions=getSampleQuestions(resultSubject?.name??attempt.subjectName);
 return <Frame nav><section data-testid="screen-quiz-results" className="results-page"><Header title="Quiz results" back="/quiz"/>
   <div className="trophy-art"><img src={trophyIllustration} alt="" /></div><h1 className="center result-title">Quiz completed</h1><p className="subtitle center">{attempt.subjectName} · saved on {new Date(attempt.completedAt).toLocaleDateString()}</p>
   <div className="result-card card"><div className="result-ring"><strong>{percent}%</strong></div><div className="result-stats"><p><CircleCheck/> <b>{attempt.correct}</b> Correct</p><p><CircleX/> <b>{incorrect}</b> Incorrect</p><p><AlarmClock/> <b>{Math.floor(attempt.durationSeconds/60)}m {attempt.durationSeconds%60}s</b><small>Time Taken</small></p></div></div>
   <div className="answer-review"><h2>Answer review</h2>{attempt.answers.map((answer,index)=>{const question=answerQuestions.find(item=>item.id===answer.questionId);const chosen=question?.options[answer.selectedOption];const correctAnswer=question?.options[answer.correctOption];return <article className={answer.selectedOption===answer.correctOption?'answer-review-item correct':'answer-review-item incorrect'} key={answer.questionId}><b>{index+1}. {question?.question??answer.topic}</b><p>Your answer: {chosen??'No answer selected'}</p>{answer.selectedOption!==answer.correctOption&&<p>Correct answer: {correctAnswer??'Not available'}</p>}</article>;})}</div>
   <div className="insight-card card"><div><Lightbulb size={28}/><h2>Review answers</h2></div><p>This result is calculated from your<br/> selected answers. AI analysis is<br/> not connected.</p></div>
   <Action testId="button-try-again" onClick={()=>go('/quiz/setup')}>Try Again</Action><button className="back-quiz" data-testid="button-back-to-quiz" onClick={()=>go('/quiz')}>Back to quiz</button>
 </section></Frame>;
}
function Progress() {
  const [,go]=useLocation();const {data,setSelectedSubject}=useStudyFlow();
  const tasks=data.studyPlan?.tasks??[];
  const completed=tasks.filter(task=>task.completedAt).length;
  const totalCorrect=data.quizAttempts.reduce((sum,attempt)=>sum+attempt.correct,0);
  const totalQuestions=data.quizAttempts.reduce((sum,attempt)=>sum+attempt.total,0);
  const hasActivity=tasks.length>0||data.quizAttempts.length>0;
  const progressValue=tasks.length?Math.round(completed/tasks.length*100):totalQuestions?Math.round(totalCorrect/totalQuestions*100):0;
  const metricLabel=tasks.length?'Plan tasks complete':totalQuestions?'Quiz accuracy':'Overall progress';
  const subjectActivity=data.subjects.map(subject=>{
    const attempts=data.quizAttempts.filter(attempt=>attempt.subjectId===subject.id);
    const subjectTasks=tasks.filter(task=>task.subjectId===subject.id);
    const correct=attempts.reduce((sum,attempt)=>sum+attempt.correct,0);
    const questions=attempts.reduce((sum,attempt)=>sum+attempt.total,0);
    return {subject,attempts:attempts.length,accuracy:questions?Math.round(correct/questions*100):null,done:subjectTasks.filter(task=>task.completedAt).length,total:subjectTasks.length};
  });
  return <Frame nav><section data-testid="screen-progress" className="progress-page"><h1 className="section-head">Progress</h1><p className="subtitle">Your saved study and quiz activity.</p>
   <div className="overall-card card"><div><h2>Activity overview</h2><p>Calculated from completed work only</p></div><div className="overall-main"><div className="result-ring small-ring"><strong>{progressValue}%</strong></div><div className="progress-summary"><b>{metricLabel}</b><span>{tasks.length?`${completed} of ${tasks.length} tasks complete`:totalQuestions?`${totalCorrect} of ${totalQuestions} answers correct`:'No study activity yet'}</span><small>{data.quizAttempts.length} quiz attempt{data.quizAttempts.length===1?'':'s'} · {completed} completed task{completed===1?'':'s'}</small></div></div>
   <div className="progress-stats"><div><CircleHelp/><span>Quiz attempts<b>{data.quizAttempts.length}</b></span></div><div><CircleCheck/><span>Tasks done<b>{completed}</b></span></div><div><BookOpen/><span>Subjects<b>{data.subjects.length}</b></span></div></div></div>
   {data.subjects.length>0&&<><div className="section-row subject-wise"><h2>Subject-Wise Activity</h2><Link href="/subjects" data-testid="link-progress-view-all">View All</Link></div>
   <div className="progress-grid">{subjectActivity.map(({subject,attempts,accuracy,done,total},i)=><button className="progress-subject card" key={subject.id} data-testid={`card-progress-${i}`} onClick={()=>{setSelectedSubject(subject.id);go('/subject/overview');}}><SubjectIcon name={subject.name}/><div><b>{subject.name}</b><small>{attempts?`${attempts} quiz${attempts===1?'':'zes'}`:'No quiz attempts'}{total?` · ${done}/${total} tasks`:''}</small><strong>{accuracy===null?(total?`${Math.round(done/total*100)}%`:'0%'):`${accuracy}%`}</strong>{total>0&&<div className="progress-bar"><span style={{width:`${Math.round(done/total*100)}%`}}/></div>}</div></button>)}</div></>}
   {!hasActivity&&<p className="progress-empty-note">Complete a study task or sample quiz to see detailed activity here. Adding a subject alone does not increase progress.</p>}
   {hasActivity&&data.subjects.length>0&&<button className="recommend-banner" data-testid="button-progress-recommendations" onClick={()=>{const subject=data.subjects[0];setSelectedSubject(subject.id);go('/subject/weakness');}}><Lightbulb/><span><b>Review quiz topics</b><small>See actual topics where recent answers<br/>were incorrect.</small></span></button>}
  </section></Frame>;
}
const tabs=[['Overview','/subject/overview'],['Weakness','/subject/weakness'],['Recommendations','/subject/recommendations']] as const;
function NoSubjectSelected(){const [,go]=useLocation();return <Frame nav><section className="empty-state"><h2>Select a subject first</h2><p>Choose a subject from your list to see its details.</p><button className="button-primary" onClick={()=>go('/subjects')}>Go to subjects</button></section></Frame>}
function MaterialLibrary({subjectOnly=false}:{subjectOnly?:boolean}) {
  const {data,addMaterial,updateMaterial,deleteMaterial}=useStudyFlow();
  const [,go]=useLocation();
  const selectedSubject=data.subjects.find(item=>item.id===data.selectedSubjectId);
  const [localFiles,setLocalFiles]=useState<{id:string;name:string;size:number;subjectId:string}[]>([]);
  const [selectedUploadSubject,setSelectedUploadSubject]=useState(selectedSubject?.id??data.subjects[0]?.id??'');
  const [uploadErrors,setUploadErrors]=useState<string[]>([]);
  const groups=subjectOnly
    ? selectedSubject?[{subject:selectedSubject,materials:data.materials.filter(item=>item.subjectId===selectedSubject.id)}]:[]
    : data.subjects.map(subject=>({subject,materials:data.materials.filter(item=>item.subjectId===subject.id)}));
  if(subjectOnly&&!selectedSubject)return <NoSubjectSelected/>;
  const selectLocalFiles=(event:ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(event.target.files??[]);const accepted:{id:string;name:string;size:number;subjectId:string}[]=[];const errors:string[]=[];
    const targetSubjectId=subjectOnly?selectedSubject?.id??'':selectedUploadSubject;
    if(!targetSubjectId&&files.length)errors.push('Choose a subject before selecting a resource.');
    files.forEach((file,index)=>{
      if(!/\.(pdf|doc|docx|ppt|pptx|jpg|jpeg|png)$/i.test(file.name)){errors.push(`${file.name}: unsupported file type.`);return;}
      if(file.size>15*1024*1024){errors.push(`${file.name}: larger than 15 MB.`);return;}
      if(targetSubjectId)accepted.push({id:`${Date.now()}-${index}-${file.name}`,name:file.name,size:file.size,subjectId:targetSubjectId});
    });
    setLocalFiles(current=>[...current,...accepted]);setUploadErrors(errors);event.target.value='';
  };
  const addLink=(subject:Subject)=>{
    const name=window.prompt(`Name this resource for ${subject.name}`)?.trim();
    if(!name)return;
    const rawUrl=window.prompt('Paste an http or https link');
    if(!rawUrl)return;
    try{
      const url=new URL(rawUrl.trim());
      if(url.protocol!=='https:'&&url.protocol!=='http:')throw new Error('Use an http or https link.');
      addMaterial({subjectId:subject.id,name,type:'link',size:0,sourceUrl:url.href});
    }catch{window.alert('Enter a valid http or https URL.');}
  };
  const renameLink=(materialId:string,currentName:string)=>{
    const name=window.prompt('Rename resource',currentName)?.trim();
    if(name)updateMaterial(materialId,{name});
  };
  const replaceLink=(materialId:string,currentName:string,currentUrl:string)=>{
    const raw=window.prompt('Replace resource link',currentUrl);
    if(!raw)return;
    try{const url=new URL(raw.trim());if(url.protocol!=='https:'&&url.protocol!=='http:')throw new Error();updateMaterial(materialId,{name:currentName,sourceUrl:url.href});}
    catch{window.alert('Enter a valid http or https URL.');}
  };
  return <Frame nav><section className="materials-page" data-testid={subjectOnly?'screen-subject-materials':'screen-materials'}>
    <Header title={subjectOnly?'Subject materials':'Materials'} back={subjectOnly?'/subject/overview':'/study-plan/resources'}/>
    <p className="subtitle">{subjectOnly?`Resources saved for ${selectedSubject?.name}.`:'Manage resource links for your subjects.'}</p>
    {data.subjects.length===0?<div className="materials-empty-content"><img src={materialsEmptyArt} alt=""/><h2>Add a subject first</h2><p>Create a subject before saving resource links.</p><button className="button-primary" onClick={()=>go('/subjects')}>Explore subjects</button></div>:
    <div className="materials-groups">{groups.map(group=><section className="material-subject-card card" key={group.subject.id}>
      <header><h2>{group.subject.name}</h2><button className="button-outline" type="button" onClick={()=>addLink(group.subject)}><Plus size={17}/> Add link</button></header>
      {group.materials.length===0?<p className="subject-no-data">No resources saved for this subject.</p>:group.materials.map(material=><article className="material-list-row" key={material.id}>
        <FileText size={22}/><div><b>{material.name}</b><small>{material.sourceUrl?'External link · metadata saved locally':'File bytes are not stored'}</small></div>
        {material.sourceUrl&&<button type="button" aria-label={`Open ${material.name}`} onClick={()=>window.open(material.sourceUrl,'_blank','noopener,noreferrer')}>Open</button>}
        {material.sourceUrl&&<button type="button" aria-label={`Rename ${material.name}`} onClick={()=>renameLink(material.id,material.name)}>Rename</button>}
        {material.sourceUrl&&<button type="button" aria-label={`Replace ${material.name}`} onClick={()=>replaceLink(material.id,material.name,material.sourceUrl!)}>Replace</button>}
        <button type="button" aria-label={`Remove ${material.name}`} onClick={()=>{if(window.confirm(`Remove ${material.name}?`))deleteMaterial(material.id);}}><X size={18}/></button>
      </article>)}
    </section>)}</div>}
     {data.subjects.length>0&&<div className="material-local-upload">
       {!subjectOnly&&<label className="material-upload-subject">Save selection under<select value={selectedUploadSubject} onChange={event=>setSelectedUploadSubject(event.target.value)}>{data.subjects.map(subject=><option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>}
       <label className="material-upload-control"><CloudUpload size={18}/> Select a file<input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" onChange={selectLocalFiles}/></label>
       <p className="materials-storage-note">Selected files stay on this device and are not uploaded or added to saved resources. Secure file storage is not connected.</p>
       {uploadErrors.map(error=><p role="alert" className="form-error" key={error}>{error}</p>)}
       {localFiles.map(file=><div className="local-material-selection" key={file.id}><FileText size={18}/><span>{file.name}<small>{(file.size/(1024*1024)).toFixed(1)} MB · {data.subjects.find(subject=>subject.id===file.subjectId)?.name??'Subject'} · not uploaded</small></span><button type="button" aria-label={`Remove ${file.name}`} onClick={()=>setLocalFiles(current=>current.filter(item=>item.id!==file.id))}><X size={17}/></button></div>)}
     </div>}
     <p className="materials-storage-note">Resource links are stored in this browser. Document summaries are unavailable.</p>
  </section></Frame>;
}
function MaterialsLibraryRoute(){return <MaterialLibrary/>}
function SubjectChat() {
  const {data,addChatMessage}=useStudyFlow();
  const [,go]=useLocation();
  const subject=data.subjects.find(item=>item.id===data.selectedSubjectId);
  const [draft,setDraft]=useState('');
  const [attachment,setAttachment]=useState<File|null>(null);
  const [attachmentPreview,setAttachmentPreview]=useState('');
  const [attachmentError,setAttachmentError]=useState('');
  if(!subject)return <NoSubjectSelected/>;
  const messages=data.chats[subject.id]??[];
  const selectAttachment=(event:ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    const supported=/\.(pdf|txt|doc|docx|png|jpe?g)$/i.test(file.name);
    if(!supported){setAttachmentError('Choose a PDF, TXT, DOC, DOCX, PNG, or JPG file.');return;}
    if(file.size>10*1024*1024){setAttachmentError('The local selection limit is 10 MB.');return;}
    setAttachmentError('');setAttachment(file);setAttachmentPreview('');
    if(file.type.startsWith('image/')){const reader=new FileReader();reader.onload=()=>setAttachmentPreview(String(reader.result));reader.readAsDataURL(file);}
  };
  const send=(event:FormEvent)=>{
    event.preventDefault();
    const text=draft.trim();if(!text&&!attachment)return;
    const fileInfo=attachment?` Selected locally: ${attachment.name} (${Math.ceil(attachment.size/1024)} KB).`:'';
    addChatMessage(subject.id,{role:'user',text:text||`Attachment selected: ${attachment?.name}`});
    addChatMessage(subject.id,{role:'system',text:`Not sent: Gemini is not connected. The message and attachment were not sent or uploaded; only this status is saved in this browser.${fileInfo}`});
    setDraft('');
    setAttachment(null);setAttachmentPreview('');
  };
  return <Frame nav><section className="subject-chat-page" data-testid="screen-subject-chat">
    <Header title={`${subject.name} assistant`} back="/subject/overview"/>
    <p className="chat-connection-note">Gemini is not connected. Messages are saved locally and are not sent to an AI service.</p>
    <div className="subject-chat-history" aria-live="polite">
      {!messages.length&&<div className="chat-empty"><Bot size={38}/><h2>Ask about {subject.name}</h2><p>Your subject-specific chat history will appear here.</p></div>}
      {messages.map(message=><article key={message.id} className={`subject-chat-message ${message.role}`}><small>{message.role==='user'?'You':'Delivery status'}</small><p>{message.text}</p></article>)}
    </div>
    <form className="subject-chat-composer" onSubmit={send}>
      {attachment&&<div className="chat-attachment-preview"><div>{attachmentPreview?<img src={attachmentPreview} alt="Selected image preview"/>:<FileText size={24}/>}<span>{attachment.name}<small>{Math.ceil(attachment.size/1024)} KB · selected locally, not uploaded</small></span></div><button type="button" aria-label="Remove attachment" onClick={()=>{setAttachment(null);setAttachmentPreview('');}}>Remove</button></div>}
      {attachmentError&&<p role="alert" className="form-error">{attachmentError}</p>}
      <textarea aria-label="Message" placeholder={`Ask about ${subject.name}`} value={draft} onChange={event=>setDraft(event.target.value)} maxLength={2000}/>
      <div className="chat-composer-actions"><label className="button-outline">Attach file<input className="visually-hidden-file" type="file" accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg" onChange={selectAttachment}/></label><button className="button-primary" type="submit" disabled={!draft.trim()&&!attachment}>Save locally</button></div>
    </form>
  </section></Frame>;
}
function AssistantEntry(){const {data}=useStudyFlow();return data.subjects.length?<SubjectChat/>:<NoSubjectSelected/>}
function AIUnavailablePage(){const [,go]=useLocation();return <Frame nav><section className="ai-unavailable-page"><Header title="AI assistant" back="/subjects"/><div className="ai-unavailable-content"><Bot size={46}/><h2>AI service not connected</h2><p>Gemini is not configured. No AI answers, summaries, or recommendations are being generated.</p><button className="button-outline" onClick={()=>go('/settings/ai')}>View AI settings</button></div></section></Frame>}
function MaterialSummaryUnavailable(){const [,go]=useLocation();return <Frame nav><section className="ai-unavailable-page"><Header title="Material summary" back="/study-plan/resources"/><div className="ai-unavailable-content"><FileText size={46}/><h2>Document summaries are unavailable</h2><p>File storage and document processing are not connected. No file content was uploaded or analyzed.</p><button className="button-outline" onClick={()=>go('/materials')}>Open materials</button></div></section></Frame>}
function SubjectTop({active,subject}:{active:string;subject:Subject}) {
  const {data,updateSubject,deleteSubject}=useStudyFlow(); const [,go]=useLocation();
  const attempts=data.quizAttempts.filter(attempt=>attempt.subjectId===subject.id).length;
  const materials=data.materials.filter(material=>material.subjectId===subject.id).length;
  const tasks=data.studyPlan?.tasks.filter(task=>task.subjectId===subject.id)??[];
  const completed=tasks.filter(task=>task.completedAt).length;
  return <><Header title={subject.name} back="/subjects" right={<button className="icon-btn" type="button" data-testid="icon-subject-menu" aria-label="Subject options" onClick={()=>{const choice=window.prompt(`Subject options for ${subject.name}: type rename or delete`);if(choice?.toLowerCase()==='rename'){const name=window.prompt('Rename subject',subject.name)?.trim();if(name&&data.subjects.some(item=>item.id!==subject.id&&item.name.toLowerCase()===name.toLowerCase()))window.alert('A subject with that name already exists.');else if(name)updateSubject(subject.id,{name});}else if(choice?.toLowerCase()==='delete'&&window.confirm(`Delete ${subject.name} and its local materials, chat, tasks, and quiz attempts?`)){deleteSubject(subject.id);go('/subjects');}}}><MoreVertical/></button>}/><div className="subject-summary card"><SubjectIcon name={subject.name}/><div><b>{subject.name}</b><small>{attempts} quiz attempts · {materials} materials</small></div>{tasks.length>0&&<div className="mini-ring summary-ring" style={{'--pct':`${Math.round(completed/tasks.length*100)}%`} as React.CSSProperties}><b>{Math.round(completed/tasks.length*100)}%</b></div>}</div>
  <nav className="subject-tabs">{tabs.map(([label,path])=><button key={path} data-testid={`button-subject-tab-${label.toLowerCase()}`} className={active===label?'active':''} onClick={()=>go(path)}>{label}</button>)}</nav></>;
}
function SubjectOverview() {
  const [,go]=useLocation();const {data}=useStudyFlow();const subject=data.subjects.find(item=>item.id===data.selectedSubjectId);if(!subject)return <NoSubjectSelected/>;
  const attempts=data.quizAttempts.filter(attempt=>attempt.subjectId===subject.id);
  const tasks=data.studyPlan?.tasks.filter(task=>task.subjectId===subject.id)??[];
  const materials=data.materials.filter(material=>material.subjectId===subject.id);
  const correct=attempts.reduce((sum,attempt)=>sum+attempt.correct,0);const total=attempts.reduce((sum,attempt)=>sum+attempt.total,0);
  const topicResults=new Map<string,{correct:number;total:number}>();
  attempts.forEach(attempt=>attempt.answers.forEach(answer=>{const existing=topicResults.get(answer.topic)??{correct:0,total:0};existing.total++;if(answer.selectedOption===answer.correctOption)existing.correct++;topicResults.set(answer.topic,existing);}));
  return <Frame nav><section data-testid="screen-subject-overview" className="subject-detail"><SubjectTop subject={subject} active="Overview"/><div className="overview-panel"><h2>Subject Overview</h2><div className="metric-cards"><div><CircleHelp/><b>{attempts.length}</b><span>Quiz attempts</span></div><div><Target/><b>{total?`${Math.round(correct/total*100)}%`:'—'}</b><span>Quiz accuracy</span></div><div><FileText/><b>{tasks.length?`${tasks.filter(task=>task.completedAt).length}/${tasks.length}`:'—'}</b><span>Tasks done</span></div></div><h3>Study materials</h3>
   {materials.length?materials.map((material,i)=><button className="topic-row" type="button" key={material.id} data-testid={`row-topic-${i}`} onClick={()=>go('/subject/materials')}><span className="topic-check"><FileText/></span><div><small>{material.name}</small><small>{material.type.toUpperCase()}</small></div><ChevronRight size={20}/></button>):<p className="subject-no-data">No materials have been added for {subject.name}.</p>}
   <div className="subject-actions-row"><button className="button-outline" onClick={()=>go('/subject/materials')} data-testid="button-subject-materials">Materials</button><button className="button-primary" onClick={()=>go('/subject/chat')} data-testid="button-subject-chat">Ask about {subject.name}</button></div>
   {topicResults.size>0&&<div className="subject-topic-results"><h3>Quiz topics</h3>{Array.from(topicResults,([topic,result])=><div className="topic-row" key={topic}><span className={result.correct===result.total?'topic-check':'topic-empty'}><CircleCheck/></span><div><small>{topic}</small><small>{result.correct}/{result.total} correct</small></div><ChevronRight size={20}/></div>)}</div>}
  </div><button className="recommend-banner detail-recommend" data-testid="button-open-recommendations" onClick={()=>go('/subject/weakness')}><Sparkles/><span><b>Review quiz topics</b><small>Open your topic accuracy and missed answers.</small></span></button></section></Frame>;
}
function Weakness() {
  const {data}=useStudyFlow();const subject=data.subjects.find(item=>item.id===data.selectedSubjectId);if(!subject)return <NoSubjectSelected/>;
  const attempts=data.quizAttempts.filter(attempt=>attempt.subjectId===subject.id);const results=new Map<string,{incorrect:number;total:number}>();
  attempts.forEach(attempt=>attempt.answers.forEach(answer=>{const item=results.get(answer.topic)??{incorrect:0,total:0};item.total++;if(answer.selectedOption!==answer.correctOption)item.incorrect++;results.set(answer.topic,item);}));
  const concerns=Array.from(results,([topic,value])=>({topic,...value})).filter(item=>item.incorrect>0).sort((a,b)=>b.incorrect-a.incorrect);
  return <Frame nav><section data-testid="screen-subject-weakness" className="subject-detail"><SubjectTop subject={subject} active="Weakness"/><div className="weakness-panel"><h2>Topics to review</h2><p>Based on your saved sample quiz answers for {subject.name}.</p>{concerns.length===0?<p className="subject-no-data">{attempts.length?'No incorrect answers recorded yet.':'Complete a quiz to see topic-level results.'}</p>:<><div className="attention"><CircleHelp/> {concerns.length} topic{concerns.length===1?'':'s'} with missed answers</div>{concerns.map((item,i)=><div className="weak-row" key={item.topic} data-testid={`row-weak-area-${i}`}><span className="rank">{i+1}</span><span className="weak-copy"><b>{item.topic}</b><small>{item.incorrect} of {item.total} answers incorrect</small></span><em className={item.incorrect===item.total?'high':'medium'}>{Math.round((item.total-item.incorrect)/item.total*100)}% correct</em><ChevronRight/></div>)}</>}</div>
   <div className="suggestions card"><h2><Bot/> AI insights unavailable</h2><p>Gemini is not connected. The topic list above uses only your recorded quiz answers.</p></div>
  </section></Frame>;
}
function Recommendations() {
  const [,go]=useLocation();const {data}=useStudyFlow();const subject=data.subjects.find(item=>item.id===data.selectedSubjectId);if(!subject)return <NoSubjectSelected/>;
  const incorrect=data.quizAttempts.filter(attempt=>attempt.subjectId===subject.id).flatMap(attempt=>attempt.answers.filter(answer=>answer.selectedOption!==answer.correctOption));
  return <Frame nav><section data-testid="screen-subject-recommendations" className="subject-detail recommendations"><SubjectTop subject={subject} active="Recommendations"/><div className="recommend-panel"><h2>Study suggestions</h2><p>Suggestions below are based on your actual activity.</p>{incorrect.length?Array.from(new Set(incorrect.map(answer=>answer.topic))).map((topic,i)=><div className="reco-row" key={topic} data-testid={`text-recommendation-${i}`}><Target size={24}/><span><b>Review {topic}</b><small>Missed questions were recorded for this topic.</small></span><ChevronRight/></div>):<p className="subject-no-data">Complete a sample quiz to get topic suggestions. No AI recommendations are being generated.</p>}</div><Action testId="button-start-study-plan" onClick={()=>go('/study-plan/days')}>Open Study Plan</Action></section></Frame>;
}
function ProfilePage() {
  const {data}=useStudyFlow();const profile=data.profile; const [,go]=useLocation();
 return <Frame nav><section data-testid="screen-profile" className="profile-page"><h1 className="section-head">Profile</h1><p className="subtitle">Your study journey, your way</p><div className="profile-overview">
    <div className="profile-avatar">{profile.avatar?<img src={profile.avatar} alt="Profile"/>:<img src={profileIllustration} alt="Profile"/>}</div><h2 data-testid="text-profile-name">{profile.name||'Complete your profile'}</h2><p>{profile.email||'Add your contact details'}</p></div>
     <div className="profile-links"><div className="profile-link card" data-testid="card-profile-course"><GraduationCap/><span><b>{profile.course.includes('CSE')?'B.Tech computer science':profile.course||'Course not set'}</b><small>{profile.college||'College not set'}</small></span><ChevronRight/></div>
   <button className="profile-link card" data-testid="button-edit-profile" onClick={()=>go('/profile/edit')}><UserRound/><span><b>Edit Profile</b><small>Update your personal information</small></span><ChevronRight/></button>
    <button type="button" className="profile-link card" data-testid="card-settings" onClick={()=>go('/settings')}><Settings/><span><b>Settings</b><small>Manage your app preference</small></span><ChevronRight/></button></div>
 </section></Frame>;
}
function EditProfile() {
  const {data,updateProfile}=useStudyFlow();const profile=data.profile; const [,go]=useLocation();
 const fields:[string,keyof Profile,typeof User][]=[['Full name','name',User],['Email Address','email',Mail],['College/University','college',Building2],['Course/ Branch','course',GraduationCap],['Daily study hours','hours',Clock3],['Target Score','score',Goal]];
 return <Frame nav><section data-testid="screen-edit-profile" className="edit-profile">
   <div className="edit-heading"><h1 className="section-head">Edit Profile</h1><button data-testid="button-save-profile" onClick={()=>go('/profile')} className="save-pill">Save</button></div>
  <div className="edit-avatar">{profile.avatar?<img src={profile.avatar} alt="Profile"/>:<img src={profileIllustration} alt="Profile"/>}</div>
   <form onSubmit={e=>{e.preventDefault();go('/profile');}}>
   {fields.map(([label,key,Icon])=><label className="edit-field" key={key}><Icon size={23}/><span>{label}{key==='email'||key==='name'||key==='college'||key==='course'?<input data-testid={`input-profile-${key}`} value={profile[key]} onChange={e=>updateProfile({[key]:e.target.value})}/>:<select className="input" data-testid={`select-profile-${key}`} value={profile[key]} onChange={e=>updateProfile(key==='hours'?{hours:e.target.value}:{score:e.target.value})}><option value="">Not set</option>{(key==='hours'?['1hr','2hrs','3hrs','4 - 5 hours','6+ hours']:['60%','70%','80%','90%']).map(x=><option key={x}>{x}</option>)}</select>}</span></label>)}
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
  <Route path="/materials/upload-failed" component={UploadFailure}/><Route path="/materials/empty" component={MaterialsLibraryRoute}/><Route path="/materials" component={MaterialsLibraryRoute}/>
  <Route path="/quiz/empty" component={EmptyQuizAttempts}/><Route path="/quiz" component={QuizHome}/><Route path="/quiz/setup" component={QuizSetup}/>
  <Route path="/quiz/question" component={QuizQuestion}/><Route path="/quiz/results" component={QuizResults}/>
  <Route path="/progress/empty" component={EmptyProgress}/><Route path="/progress" component={Progress}/>
  <Route path="/settings/study-reminders" component={SettingsInfoPage}/><Route path="/settings/appearance" component={SettingsInfoPage}/><Route path="/settings/ai" component={SettingsInfoPage}/><Route path="/settings/help" component={SettingsInfoPage}/><Route path="/settings/about" component={SettingsInfoPage}/><Route path="/settings/privacy" component={SettingsInfoPage}/><Route path="/settings" component={SettingsPage}/>
  <Route path="/notifications/empty" component={EmptyNotifications}/><Route path="/notifications" component={NotificationsList}/>
  <Route path="/assistant/error" component={AIUnavailablePage}/><Route path="/assistant/chat" component={SubjectChat}/><Route path="/assistant/material-summary" component={MaterialSummaryUnavailable}/><Route path="/assistant" component={AssistantEntry}/>
  <Route path="/subject/chat" component={SubjectChat}/><Route path="/subject/materials" component={()=> <MaterialLibrary subjectOnly/>}/>
  <Route path="/offline" component={OfflineScreen}/>
  <Route path="/study-plan/generating" component={PlanGenerating}/><Route path="/study-plan/generation-error" component={PlanGenerationFailure}/>
  <Route path="/study-plan/resources/empty" component={EmptyStudyPlanResources}/><Route path="/study-plan/resources" component={StudyPlanResources}/>
  <Route path="/study-plan/days" component={StudyPlanDays}/><Route path="/study-plan" component={StudyPlanOverview}/>
  <Route path="/subject/overview" component={SubjectOverview}/><Route path="/subject/weakness" component={Weakness}/>
  <Route path="/subject/recommendations" component={Recommendations}/><Route path="/profile" component={ProfilePage}/><Route path="/profile/edit" component={EditProfile}/>
  <Route component={NotFound}/>
 </Switch>;
}
function AppContent() {
  const {persistenceAvailable}=useStudyFlow();
  return <>{!persistenceAvailable&&<div className="persistence-warning" role="alert">Browser storage is unavailable. Changes may not remain after this session.</div>}<AppRoutes/></>;
}
function App() { return <Router><StudyFlowProvider><AppContent/></StudyFlowProvider></Router>; }
export default App;
