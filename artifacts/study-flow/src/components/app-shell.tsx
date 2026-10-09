import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, ChartNoAxesColumnIncreasing, ChevronLeft, CircleHelp, Home, UserRound } from 'lucide-react';

export function Action({
  children,
  onClick,
  testId,
  outline = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  testId: string;
  outline?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={outline ? 'button-outline' : 'button-primary'}
    >
      {children}
    </button>
  );
}

function BottomNav() {
  const [location] = useLocation();
  const nav = [
    ['/dashboard', <Home size={31} />, 'Home'],
    ['/subjects', <BookOpen size={31} />, 'Subjects'],
    ['/quiz', <CircleHelp size={31} />, 'Quiz'],
    ['/progress', <ChartNoAxesColumnIncreasing size={31} />, 'Progress'],
    ['/profile', <UserRound size={31} />, 'Profile'],
  ] as const;

  const activePath =
    location === '/dashboard' ? '/dashboard'
      : location.startsWith('/subjects') || location.startsWith('/subject') ? '/subjects'
        : location.startsWith('/quiz') ? '/quiz'
          : location.startsWith('/progress') ? '/progress'
            : location.startsWith('/profile') || location.startsWith('/settings') ? '/profile'
              : null;

  return (
    <nav className="bottom-nav" data-testid="navigation-bottom">
      {nav.map(([href, icon, name]) => (
        <Link
          key={href}
          href={href}
          aria-label={name}
          aria-current={activePath === href ? 'page' : undefined}
          className={activePath === href ? 'active' : ''}
          data-testid={`link-nav-${name.toLowerCase()}`}
        >
          {icon}
        </Link>
      ))}
    </nav>
  );
}

export function Frame({ children, nav = false }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="app-shell">
      <main className="phone">
        <div className="screen appear">{children}</div>
        {nav && <BottomNav />}
      </main>
    </div>
  );
}

export function Header({
  title,
  back = '/dashboard',
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
      <Link href={back} data-testid="link-back" aria-label="Go back" style={{ color: '#111', display: 'flex' }}>
        <ChevronLeft size={26} />
      </Link>
      <h1 style={{ font: '700 25px Outfit', margin: 0, flex: 1 }} data-testid="text-page-title">
        {title}
      </h1>
      {right}
    </header>
  );
}
