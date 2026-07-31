import { useState } from 'react';
import Lightbox, { type LightboxImage } from './Lightbox';
import Reveal from './Reveal';
import Section from './Section';
import { plans } from '../content';

const lightboxImages: LightboxImage[] = [
  ...plans.floors.map((floor) => ({
    src: floor.src,
    alt: floor.alt,
    caption: `Планировка, ${floor.title}`,
    width: floor.width,
    height: floor.height,
  })),
  {
    src: plans.plot.src,
    alt: plans.plot.alt,
    caption: plans.plot.title,
    width: plans.plot.width,
    height: plans.plot.height,
  },
];

export default function Plans() {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <Section id="plans" eyebrow="Планировка" title={plans.title}>
      <Reveal>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-gray-300">{plans.note}</p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.floors.map((floor, i) => (
          <Reveal key={floor.title} delay={i * 80}>
            <div className="panel h-full overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                aria-label={`Открыть план: ${floor.title}`}
                className="block w-full cursor-pointer bg-white/5"
              >
                <img
                  src={floor.src}
                  alt={floor.alt}
                  width={floor.width}
                  height={floor.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
              </button>

              <div className="p-6">
                <h3 className="text-xl font-medium">{floor.title}</h3>
                <ul className="mt-4 space-y-2">
                  {floor.rooms.map((room, roomIndex) => (
                    <li
                      key={`${room.name}-${roomIndex}`}
                      className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 text-sm last:border-0"
                    >
                      <span className="text-gray-300">{room.name}</span>
                      <span className="tabular-nums text-white">{room.area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160} className="mt-4">
        <div className="panel grid overflow-hidden rounded-xl md:grid-cols-2">
          {/* Высота карточки задана здесь, а схема вписывается по object-contain:
              документ нельзя кадрировать, но и тянуть карточку на его полный рост незачем. */}
          <button
            type="button"
            onClick={() => setOpenAt(plans.floors.length)}
            aria-label={`Открыть ${plans.plot.title.toLowerCase()}`}
            className="flex h-72 w-full cursor-pointer items-center justify-center bg-white/5 p-4 md:h-80"
          >
            <img
              src={plans.plot.src}
              alt={plans.plot.alt}
              width={plans.plot.width}
              height={plans.plot.height}
              loading="lazy"
              decoding="async"
              className="h-full w-auto max-w-full object-contain"
            />
          </button>

          <div className="flex flex-col justify-center p-6 md:p-8">
            <h3 className="text-xl font-medium">{plans.plot.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{plans.plot.text}</p>

            <dl className="mt-6 space-y-2 text-sm">
              {plans.plot.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 last:border-0"
                >
                  <dt className="text-gray-400">{fact.label}</dt>
                  <dd className="tabular-nums text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm text-gray-500">
              Нажмите на схему, чтобы рассмотреть подробнее.
            </p>
          </div>
        </div>
      </Reveal>

      {openAt !== null && (
        <Lightbox
          images={lightboxImages}
          index={openAt}
          onClose={() => setOpenAt(null)}
          onNavigate={setOpenAt}
        />
      )}
    </Section>
  );
}
