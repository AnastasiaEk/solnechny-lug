import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedHeadingProps {
  /** Use \n to split the heading into lines. */
  text: string;
  /** Delay in ms before the first character animates in. */
  initialDelay?: number;
  /** Stagger between characters in ms. */
  charDelay?: number;
  /** Per-character transition duration in ms. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedHeading({
  text,
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
  className = '',
  style,
}: AnimatedHeadingProps) {
  const reducedMotion = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split('\n');
  const shown = reducedMotion || started;

  const renderLine = (line: string, lineIndex: number): ReactNode => {
    // Слова и пробелы идут вперемешку: буквы анимируются, пробелы — нет.
    const segments = line.split(/(\s+)/).filter(Boolean);
    let charIndex = 0;

    return segments.map((segment, segmentIndex) => {
      if (/^\s+$/.test(segment)) {
        // Обычный пробел вне inline-block: единственное место, где строка
        // имеет право перенестись. Индекс двигаем, чтобы ритм не сбился.
        charIndex += segment.length;
        return <span key={segmentIndex}>{segment}</span>;
      }

      return (
        // whitespace-nowrap не даёт разорвать слово между буквами.
        <span key={segmentIndex} className="inline-block whitespace-nowrap">
          {segment.split('').map((char, i) => {
            const delay =
              lineIndex * line.length * charDelay + charIndex * charDelay;
            charIndex += 1;

            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'translateX(0)' : 'translateX(-18px)',
                  transition: reducedMotion
                    ? undefined
                    : `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
                  transitionDelay: reducedMotion ? undefined : `${delay}ms`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {/* Экранный диктор читает строку целиком, а не по буквам. */}
          <span className="sr-only">{line}</span>
          <span aria-hidden="true">{renderLine(line, lineIndex)}</span>
        </span>
      ))}
    </h1>
  );
}
