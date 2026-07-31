import { Check } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { about } from '../content';

export default function About() {
  return (
    <Section id="about" eyebrow="О доме" title={about.title}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-gray-300">{about.lead}</p>
        </Reveal>

        <ul className="space-y-4">
          {about.benefits.map((item, i) => (
            <li key={item.feature}>
              <Reveal delay={i * 60}>
                <div className="panel flex items-start gap-4 rounded-xl p-5">
                  <Check
                    size={20}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-moss"
                    aria-hidden="true"
                  />
                  <p className="text-base">
                    <span className="font-medium">{item.feature}</span>
                    <span className="text-gray-400"> — {item.benefit}</span>
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
