import Reveal from './Reveal';
import Section from './Section';
import { infrastructure } from '../content';

export default function Infrastructure() {
  return (
    <Section eyebrow="Город" title={infrastructure.title}>
      <Reveal>
        <p className="mb-10 max-w-3xl text-lg text-gray-300">{infrastructure.lead}</p>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {infrastructure.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 60} className="h-full">
            <div className="panel h-full rounded-xl p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-moss">
                {item.title}
              </div>
              <p className="mt-3 text-base leading-relaxed text-gray-200">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
