import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, X } from 'lucide-react';
import { Action, Frame, Header } from '../components/app-shell';
import progressEmptyArt from '../assets/reference/progress-empty.png';
import quizEmptyArt from '../assets/reference/quiz-empty.png';
import materialsEmptyArt from '../assets/reference/materials-empty.png';
import uploadFailedArt from '../assets/reference/upload-failed.png';
import searchEmptyArt from '../assets/reference/search-empty.png';
import offlineArt from '../assets/reference/offline.png';

type EmptyReferenceProps = {
  testId: string;
  title: string;
  back: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonTestId: string;
  nav?: boolean;
  onAction: () => void;
};

function EmptyReference({
  testId,
  title,
  back,
  image,
  imageAlt,
  imageClass,
  heading,
  description,
  buttonText,
  buttonTestId,
  nav = false,
  onAction,
}: EmptyReferenceProps) {
  return (
    <Frame nav={nav}>
      <section className={`reference-empty ${imageClass}`} data-testid={testId}>
        <Header title={title} back={back} />
        <img className="reference-empty-art" src={image} alt={imageAlt} />
        <h2>{heading}</h2>
        <p>{description}</p>
        <Action testId={buttonTestId} onClick={onAction}>{buttonText}</Action>
      </section>
    </Frame>
  );
}

export function EmptyProgress() {
  const [, go] = useLocation();
  return (
    <EmptyReference
      testId="screen-progress-empty"
      title="Progress"
      back="/dashboard"
      image={progressEmptyArt}
      imageAlt=""
      imageClass="empty-progress-reference"
      heading="No progress data yet"
      description="Complete Quizzes and study tasks to see your progress here."
      buttonText="start studying"
      buttonTestId="button-start-studying"
      nav
      onAction={() => go('/dashboard')}
    />
  );
}

export function EmptyQuizAttempts() {
  const [, go] = useLocation();
  return (
    <EmptyReference
      testId="screen-quiz-empty"
      title="Quiz"
      back="/dashboard"
      image={quizEmptyArt}
      imageAlt=""
      imageClass="empty-quiz-reference"
      heading="No quiz attempts yet"
      description="Take your first quiz to test your knowledge and see your progress"
      buttonText="Explore subjects"
      buttonTestId="button-explore-subjects"
      nav
      onAction={() => go('/subjects')}
    />
  );
}

export function EmptyMaterials() {
  const [, go] = useLocation();
  return (
    <EmptyReference
      testId="screen-materials-empty"
      title="Materials"
      back="/study-plan/resources"
      image={materialsEmptyArt}
      imageAlt=""
      imageClass="empty-materials-reference"
      heading="No materials available"
      description="Upload your study material or add them from your device to get started."
      buttonText="Upload Material"
      buttonTestId="button-upload-material"
      nav
      onAction={() => go('/materials/upload-failed')}
    />
  );
}

export function UploadFailure() {
  const [, go] = useLocation();
  return (
    <Frame nav>
      <section className="upload-failure-reference" data-testid="screen-upload-failed">
        <Header title="Upload material" back="/materials" />
        <img src={uploadFailedArt} alt="" />
        <h2>Upload failed</h2>
        <p>Secure file storage is not connected yet. Your file was not saved.</p>
        <Action testId="button-retry-upload" onClick={() => go('/materials')}>Back to materials</Action>
        <button className="button-outline upload-cancel" data-testid="button-cancel-upload" onClick={() => go('/study-plan/resources')}>
          Cancel
        </button>
      </section>
    </Frame>
  );
}

export function EmptySubjectSearch() {
  const [, go] = useLocation();
  const [query, setQuery] = useState('Mathematics');
  const [tab, setTab] = useState<'mine' | 'all'>('mine');

  return (
    <Frame>
      <section className="subject-search-empty-reference" data-testid="screen-subjects-no-results">
        <h1>Subjects</h1>
        <label className="reference-search-field">
          <Search size={20} aria-hidden="true" />
          <input
            aria-label="Search subjects"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') setQuery('');
            }}
          />
          <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
            <X size={21} />
          </button>
        </label>
        <div className="reference-subject-tabs" role="tablist" aria-label="Subject filter">
          <button type="button" role="tab" aria-selected={tab === 'mine'} className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
            My Subjects
          </button>
          <button type="button" role="tab" aria-selected={tab === 'all'} className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
            All
          </button>
        </div>
        <img className="subject-no-results-art" src={searchEmptyArt} alt="" />
        <h2>No result found</h2>
        <p>We couldn’t find anything matching<br />try a different keyword or check your spelling</p>
        <Action testId="button-try-subject-search" onClick={() => go('/subjects')}>Try Again</Action>
      </section>
    </Frame>
  );
}

export function OfflineScreen() {
  return (
    <Frame nav>
      <section className="offline-reference" data-testid="screen-offline">
        <img src={offlineArt} alt="" />
        <h1>No internet connection</h1>
        <p>Please check your network<br />and try again</p>
        <Action testId="button-retry-connection" onClick={() => undefined}>Try Again</Action>
      </section>
    </Frame>
  );
}

