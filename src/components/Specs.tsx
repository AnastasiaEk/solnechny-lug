import Reveal from './Reveal';
import Section from './Section';
import { specs } from '../content';

export default function Specs() {
  return (
    <Section id="specs" eyebrow="Коротко" title="Характеристики объекта">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {specs.map((item, i) => (
          <Reveal
            key={item.label}
            delay={Math.min(i, 5) * 40}
            className="panel h-full rounded-xl px-5 py-5"
          >
            <dt className="text-sm text-gray-400">{item.label}</dt>
            <dd className="mt-1 text-lg text-white">{item.value}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
