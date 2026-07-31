/**
 * Силуэты пейзажа на фоне страницы: дальний горизонт, перелесок и ближняя кромка
 * деревьев с травой. Слой закреплён у нижнего края экрана и уходит за контент,
 * поэтому при прокрутке читается как далёкий план, а не как часть секции.
 */

/** Линейный конгруэнтный генератор: силуэт должен быть одинаковым при каждой загрузке. */
function makeRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface TreelineOptions {
  seed: number;
  width: number;
  baseY: number;
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  /** Доля остроконечных крон (ели) против округлых (берёзы, ивы). */
  coniferChance: number;
}

/** Кромка леса: чередование округлых и остроконечных крон вдоль базовой линии. */
function treelinePath({
  seed,
  width,
  baseY,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  coniferChance,
}: TreelineOptions): string {
  const rng = makeRng(seed);
  const between = (min: number, max: number) => min + rng() * (max - min);
  const floor = baseY + 400;

  let d = `M 0 ${floor} L 0 ${baseY}`;
  let x = 0;

  while (x < width) {
    const w = between(minWidth, maxWidth);
    const h = between(minHeight, maxHeight);
    const mid = x + w / 2;
    const end = x + w;

    if (rng() < coniferChance) {
      d += ` L ${mid.toFixed(1)} ${(baseY - h * 1.5).toFixed(1)} L ${end.toFixed(1)} ${baseY}`;
    } else {
      d +=
        ` Q ${(x + w * 0.25).toFixed(1)} ${(baseY - h * 1.15).toFixed(1)}` +
        ` ${mid.toFixed(1)} ${(baseY - h).toFixed(1)}` +
        ` Q ${(x + w * 0.75).toFixed(1)} ${(baseY - h * 1.15).toFixed(1)}` +
        ` ${end.toFixed(1)} ${baseY}`;
    }

    x = end;
  }

  return `${d} L ${x.toFixed(1)} ${floor} Z`;
}

/** Редкие травинки по нижнему краю — ближний план луга. */
function grassPath(seed: number, width: number, baseY: number): string {
  const rng = makeRng(seed);
  const blades: string[] = [];

  for (let x = 0; x < width; x += 6 + rng() * 14) {
    const h = 10 + rng() * 34;
    const lean = (rng() - 0.5) * 22;
    blades.push(
      `M ${x.toFixed(1)} ${baseY} Q ${(x + lean * 0.4).toFixed(1)} ${(baseY - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(baseY - h).toFixed(1)}`
    );
  }

  return blades.join(' ');
}

const WIDTH = 1440;

const far = treelinePath({
  seed: 12,
  width: WIDTH,
  baseY: 300,
  minHeight: 14,
  maxHeight: 34,
  minWidth: 26,
  maxWidth: 58,
  coniferChance: 0.35,
});

const mid = treelinePath({
  seed: 7743,
  width: WIDTH,
  baseY: 372,
  minHeight: 34,
  maxHeight: 82,
  minWidth: 46,
  maxWidth: 104,
  coniferChance: 0.3,
});

const near = treelinePath({
  seed: 90211,
  width: WIDTH,
  baseY: 452,
  minHeight: 58,
  maxHeight: 150,
  minWidth: 80,
  maxWidth: 190,
  coniferChance: 0.22,
});

const grass = grassPath(5150, WIDTH, 500);

export default function LandscapeBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[55vh] min-h-[320px] select-none"
    >
      <svg
        viewBox={`0 0 ${WIDTH} 500`}
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
      >
        <defs>
          {/* Свет у горизонта — как просвет неба за дальним лесом. */}
          <radialGradient id="horizon-glow" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#D9C7A3" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#D9C7A3" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={WIDTH / 2} cy={310} rx={860} ry={190} fill="url(#horizon-glow)" />

        <path d={far} fill="#4A7C59" fillOpacity="0.13" />
        <path d={mid} fill="#2E4A38" fillOpacity="0.34" />
        <path d={near} fill="#16281C" fillOpacity="0.62" />
        <path
          d={grass}
          fill="none"
          stroke="#16281C"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
