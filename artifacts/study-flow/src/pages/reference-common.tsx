import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export function CenteredHeader({
  title,
  back,
  right,
  className = '',
}: {
  title: string;
  back: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`centered-reference-header ${className}`}>
      <Link href={back} aria-label="Go back" data-testid="link-reference-back">
        <ChevronLeft size={25} />
      </Link>
      <h1>{title}</h1>
      <span className="centered-header-right">{right}</span>
    </header>
  );
}
