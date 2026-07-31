import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionProps {
  id?: string;
  /** Надзаголовок — короткая метка над основным заголовком. */
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: SectionProps) {
  return (
    <section id={id} className={`px-6 py-20 md:px-12 md:py-24 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (
          <Reveal className="mb-10 md:mb-14">
            {eyebrow && (
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-moss">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2
                className="max-w-3xl text-3xl font-normal md:text-4xl lg:text-5xl"
                style={{ letterSpacing: '-0.03em' }}
              >
                {title}
              </h2>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
