import { Backpack, Droplets, Milk, Snowflake, Store, TreePine, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { kids, nearby } from '../content';

/** SVG-иконки вместо эмодзи: одинаковая толщина обводки и управляемый цвет. */
const iconMap: Record<(typeof nearby)[number]['icon'], LucideIcon> = {
  forest: TreePine,
  river: Waves,
  ski: Snowflake,
  water: Droplets,
  town: Store,
  dairy: Milk,
};

export default function Nearby() {
  return (
    <Section id="nearby" eyebrow="Окружение" title="Что рядом">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nearby.map((item, i) => {
          const Icon = iconMap[item.icon];

          return (
            <li key={item.title} className="h-full">
              <Reveal delay={Math.min(i, 5) * 60} className="h-full">
                <div className="panel flex h-full flex-col rounded-xl p-6">
                  <Icon size={26} strokeWidth={1.5} className="text-moss" aria-hidden="true" />
                  <div className="mt-5 text-2xl font-light tracking-tight">{item.distance}</div>
                  <div className="mt-1 font-medium">{item.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.text}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <Reveal delay={120}>
        <div className="panel mt-4 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Backpack size={26} strokeWidth={1.5} className="mt-1 shrink-0 text-moss" aria-hidden="true" />
            <div>
              <h3 className="text-2xl font-light tracking-tight">{kids.title}</h3>
              <p className="mt-2 text-gray-300">{kids.lead}</p>
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {kids.activities.map((activity) => (
              <li
                key={activity}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200"
              >
                {activity}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-gray-500">{kids.note}</p>
        </div>
      </Reveal>
    </Section>
  );
}
