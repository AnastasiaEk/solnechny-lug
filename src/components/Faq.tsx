import { Plus } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { faq } from '../content';

export default function Faq() {
  return (
    <Section id="faq" eyebrow="Вопросы" title="Частые вопросы">
      <div className="max-w-3xl">
        {faq.map((item, i) => (
          <Reveal key={item.q} delay={Math.min(i, 4) * 50}>
            {/* <details> даёт рабочий аккордеон с клавиатуры без своего JS. */}
            <details className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-gray-400">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
