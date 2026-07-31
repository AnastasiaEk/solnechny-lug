import Reveal from './Reveal';
import Section from './Section';
import { why } from '../content';

export default function Why() {
  return (
    <Section eyebrow="Зачем этот дом" title={why.title}>
      <Reveal>
        <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
          {why.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
