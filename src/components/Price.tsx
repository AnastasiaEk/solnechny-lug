import { Check } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { price } from '../content';

export default function Price() {
  return (
    <Section id="price" eyebrow="Условия" title={price.title}>
      <Reveal>
        <div className="panel rounded-2xl p-8 md:p-12">
          <div
            className="text-4xl font-light tracking-tight md:text-6xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            {price.value}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-sand/30 bg-sand/10 px-4 py-2 text-sm font-medium text-sand">
              {price.discount}
            </span>
            <span className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300">
              {price.mortgage}
            </span>
          </div>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-moss">
            В стоимость входит
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {price.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gray-200">
                <Check
                  size={18}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-moss"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="mt-10 inline-block cursor-pointer rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors duration-200 hover:bg-gray-100"
          >
            {price.cta}
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
