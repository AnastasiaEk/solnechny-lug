import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** Задержка внутри группы, мс — для лестничного появления карточек. */
  delay?: number;
  className?: string;
}

/**
 * Появление блока при попадании в вид. Анимируются только opacity и transform,
 * поэтому переход не вызывает пересчёта раскладки.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shown = reducedMotion || visible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(16px)',
        transition: reducedMotion
          ? undefined
          : 'opacity 500ms ease-out, transform 500ms ease-out',
        transitionDelay: reducedMotion ? undefined : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
