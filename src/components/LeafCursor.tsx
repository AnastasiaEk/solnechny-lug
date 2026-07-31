import { useEffect, useRef, useState } from 'react';
import { Leaf } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  spin: number;
  scale: number;
  opacity: number;
  duration: number;
  color: string;
}

/** Расстояние курсора между листиками, px. Реже — спокойнее, чаще — навязчиво. */
const SPAWN_DISTANCE = 90;
/** Больше этого числа листиков одновременно на экране не живёт. */
const MAX_LEAVES = 18;
const LIFETIME = 2600;

const COLORS = ['#A8C49B', '#7FA277', '#D9C7A3', '#C2A86B', '#8FB48A'];

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Листики, слетающие за курсором. Только для мыши: на тач-экранах курсора нет,
 * а при системной настройке «уменьшить движение» слой не монтируется вовсе.
 */
export default function LeafCursor() {
  const reducedMotion = useReducedMotion();
  const [leaves, setLeaves] = useState<Particle[]>([]);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    // Грубый указатель (палец, стилус) — эффект не имеет смысла.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const timers = new Set<number>();

    const onMove = (e: PointerEvent) => {
      const last = lastPoint.current;
      const moved = last
        ? Math.hypot(e.clientX - last.x, e.clientY - last.y)
        : Number.POSITIVE_INFINITY;

      if (moved < SPAWN_DISTANCE) return;
      lastPoint.current = { x: e.clientX, y: e.clientY };

      const leaf: Particle = {
        id: nextId.current++,
        x: e.clientX,
        y: e.clientY,
        dx: between(-70, 70),
        dy: between(90, 190),
        rot: between(-40, 40),
        spin: between(-220, 220),
        scale: between(0.6, 1.15),
        opacity: between(0.35, 0.75),
        duration: between(2000, LIFETIME),
        color: pick(COLORS),
      };

      setLeaves((current) => [...current, leaf].slice(-MAX_LEAVES));

      const timer = window.setTimeout(() => {
        setLeaves((current) => current.filter((l) => l.id !== leaf.id));
        timers.delete(timer);
      }, leaf.duration);
      timers.add(timer);
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reducedMotion]);

  if (reducedMotion || leaves.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="leaf absolute"
          style={
            {
              left: leaf.x,
              top: leaf.y,
              color: leaf.color,
              '--leaf-dx': `${leaf.dx}px`,
              '--leaf-dy': `${leaf.dy}px`,
              '--leaf-rot': `${leaf.rot}deg`,
              '--leaf-spin': `${leaf.spin}deg`,
              '--leaf-scale': leaf.scale,
              '--leaf-opacity': leaf.opacity,
              '--leaf-duration': `${leaf.duration}ms`,
            } as React.CSSProperties
          }
        >
          <Leaf size={20} strokeWidth={1.25} fill="currentColor" />
        </span>
      ))}
    </div>
  );
}
