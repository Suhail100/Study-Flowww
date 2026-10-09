import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Bot, BookOpen, ChevronLeft, ChevronRight, FileText, KeyRound, MoreVertical, Paperclip, Send, Sparkles, Shapes, X } from 'lucide-react';
import { Frame } from '../components/app-shell';
import assistantHomeArt from '../assets/reference/assistant-home.png';
import assistantFailureArt from '../assets/reference/assistant-failed.png';

const normalizationReply = `The normalization concept for relational databases, developed by E.F. Codd, the inventor of the relational database model, is from the 1970s. Before Codd, the most common method of storing data was in large, cryptic, and unstructured files, generating plenty of redundancy and lack of consistency. When databases began to emerge, people noticed that stuffing data into them caused many duplications and anomalies to emerge, like insert, delete, and update anomalies. These anomalies could produce incorrect data reporting, which is harmful to any business. Normalization is a methodological method used in the design of databases to create a neat, structured, and structured table in which each table relates to just one subject or one-to-one correspondence.

The objective is to extensively reduce data redundancy and dependency. In essence, normalization was introduced and has continually been improved to rectify these specific aspects of data management. By organizing data in such a rigorous and stringent manner, normalization facilitates a significantly enhanced level of data integrity and enables more efficient data operations.`;

const materialSummary = `The normalization concept for relational databases, developed by E.F. Codd, the inventor of the relational database model, is from the 1970s. Before Codd, the most common method of storing data was in large, cryptic, and unstructured files, generating plenty of redundancy and lack of consistency. When databases began to emerge, people noticed that stuffing data into them caused many duplications and anomalies to emerge, like insert, delete, and update anomalies. These anomalies could produce incorrect data reporting, which is harmful to any business. Normalization is a methodological method used in the design of databases to create a neat, structured, and structured table in which each table relates to just one subject or one-to-one correspondence. The objective is to extensively reduce data redundancy and dependency. In essence, normalization was introduced and has continually been improved to rectify these specific aspects of data management.`;

function AssistantHeader({ back = '/dashboard', online = false }: { back?: string; online?: boolean }) {
  const [, go] = useLocation();
  return (
    <header className="assistant-header">
      <Link href={back} aria-label="Go back" data-testid="link-assistant-back"><ChevronLeft size={25} /></Link>
      <span className="assistant-header-mark"><Bot size={24} /></span>
      <h1>DBMS AI<br />Assistant{online && <small><i />online</small>}</h1>
      <button type="button" aria-label="Assistant options" data-testid="button-assistant-options" onClick={() => go('/assistant/error')}>
        <MoreVertical size={23} />
      </button>
    </header>
  );
}

function Composer({ onSend }: { onSend: (message: string) => void }) {
  const [draft, setDraft] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };
  return (
    <form className="assistant-composer" onSubmit={submit}>
      <button type="button" aria-label="Attach a material" data-testid="button-assistant-attach" onClick={() => undefined}>
        <Paperclip size={24} />
      </button>
      <input
        aria-label="Ask the DBMS assistant"
        placeholder="ask anything about Dbms..."
        value={draft}
        onChange={event => setDraft(event.target.value)}
        data-testid="input-assistant-message"
      />
      <button type="submit" aria-label="Send message" data-testid="button-assistant-send"><Send size={24} /></button>
    </form>
  );
}

export function AssistantUnavailable() {
  const [, go] = useLocation();
  return (
    <Frame>
      <section className="assistant-error-reference" data-testid="screen-assistant-error">
        <div className="assistant-error-title"><ChevronLeft size={25} /><h1>Subject assistant</h1></div>
        <img src={assistantFailureArt} alt="" />
        <h2>Something went wrong</h2>
        <p>The AI assistant is currently unavailable<br />please try again later</p>
        <button className="button-primary" data-testid="button-retry-assistant" onClick={() => go('/assistant')}>Retry</button>
        <button className="button-outline" data-testid="button-back-assistant" onClick={() => go('/assistant')}>Go back</button>
      </section>
    </Frame>
  );
}

export function AssistantHome() {
  const [, go] = useLocation();
  const prompts = [
    { text: 'Explain normalization', icon: FileText, route: '/assistant/chat' },
    { text: 'what is primary key?', icon: KeyRound, route: '/assistant/error' },
    { text: 'Summarize unit 2', icon: BookOpen, route: '/assistant/material-summary' },
    { text: 'Types of normalization?', icon: Shapes, route: '/assistant/error' },
  ];
  return (
    <Frame>
      <section className="assistant-app-screen assistant-home-reference" data-testid="screen-assistant-home">
        <AssistantHeader />
        <div className="assistant-home-scroll">
          <div className="assistant-greeting">
            <div className="assistant-avatar"><Bot size={45} /></div>
            <div><b>Hi suhail!</b><p>What would you like to know<br />about DBMS?</p></div>
          </div>
          <h2 className="assistant-prompt-heading">Try asking...</h2>
          <div className="assistant-prompts">
            {prompts.map(({ text, icon: Icon, route }) => (
              <button type="button" className="assistant-prompt" key={text} onClick={() => go(route)} data-testid={`button-prompt-${text.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
                <Icon size={22} /><span>{text}</span><ChevronRight size={23} />
              </button>
            ))}
          </div>
          <img className="assistant-home-art" src={assistantHomeArt} alt="" />
          <h2 className="assistant-ask-title">Ask anything about DBMS</h2>
          <p className="assistant-description">I can explain concepts, summarize your<br />materials,solve doubts, and generate questions</p>
          <button type="button" className="assistant-materials-button" onClick={() => go('/assistant/material-summary')} data-testid="button-assistant-materials">
            <BookOpen size={20} /> ask from my materials
          </button>
        </div>
        <Composer onSend={() => go('/assistant/error')} />
      </section>
    </Frame>
  );
}

export function AssistantChat() {
  const [, go] = useLocation();
  return (
    <Frame>
      <section className="assistant-app-screen assistant-chat-reference" data-testid="screen-assistant-chat">
        <AssistantHeader back="/assistant" online />
        <div className="assistant-chat-history">
          <div className="user-message">Explain normalization with<br />an example <span>✓✓</span></div>
          <div className="assistant-reply">
            <span className="assistant-reply-avatar"><Bot size={21} /></span>
            <p>{normalizationReply}</p>
          </div>
        </div>
        <Composer onSend={() => go('/assistant/error')} />
      </section>
    </Frame>
  );
}

export function MaterialSummary() {
  const [, go] = useLocation();
  const suggestions = [
    ['Explain in simpler terms', Sparkles],
    ['Generate practice question', FileText],
    ['Create notes from this chapter', FileText],
    ['Extract important definitions', FileText],
  ] as const;
  return (
    <Frame>
      <section className="assistant-app-screen assistant-summary-reference" data-testid="screen-material-summary">
        <AssistantHeader back="/assistant" online />
        <div className="assistant-summary-scroll">
          <div className="user-message summary-user-message">Summarize this chapter <span>✓✓</span></div>
          <article className="uploaded-reference-file">
            <span className="pdf-badge">PDF</span>
            <span><b>DBMS_Unit2.pdf</b><small>2.4 MB. uploaded</small></span>
            <button type="button" aria-label="Remove uploaded file" data-testid="button-remove-reference-file"><X size={21} /></button>
          </article>
          <div className="summary-intro"><span className="assistant-reply-avatar"><Bot size={21} /></span><p>Here’s a summary of Unit 2<br />from your uploaded material</p></div>
          <p className="summary-response">{materialSummary}</p>
          <h2 className="summary-suggestions-heading">You can also:</h2>
          <div className="summary-suggestions">
            {suggestions.map(([label, Icon]) => (
              <button type="button" key={label} onClick={() => go('/assistant/error')} data-testid={`button-summary-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
                <Icon size={22} /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <Composer onSend={() => go('/assistant/error')} />
      </section>
    </Frame>
  );
}
