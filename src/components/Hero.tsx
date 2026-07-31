import { useEffect, useRef } from 'react';
import AnimatedHeading from './AnimatedHeading';
import FadeIn from './FadeIn';
import { hero } from '../content';

const VIDEO_SRC = '/background.mp4';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Некоторые браузеры игнорируют проп `muted` на первом рендере и блокируют автовоспроизведение.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <section id="top" className="relative h-dvh min-h-[600px] w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 flex-col justify-end px-6 pb-12 pt-28 md:px-12 lg:grid lg:grid-cols-2 lg:items-end lg:px-16 lg:pb-16">
          {/* Левая колонка — главное сообщение */}
          <div>
            <AnimatedHeading
              text={hero.heading}
              initialDelay={200}
              charDelay={30}
              duration={500}
              className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: '-0.04em' }}
            />

            <FadeIn delay={800} duration={1000}>
              <p className="mb-5 max-w-2xl text-base text-gray-300 md:text-lg">
                {hero.subheading}
              </p>
            </FadeIn>

            <FadeIn delay={1000} duration={1000}>
              <ul className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-200">
                {hero.facts.map((fact, i) => (
                  <li key={fact} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden="true" className="text-white/30">·</span>}
                    {fact}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="cursor-pointer rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors duration-200 hover:bg-gray-100"
                >
                  {hero.cta}
                </a>
                <a
                  href="#gallery"
                  className="liquid-glass cursor-pointer rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-black"
                >
                  Посмотреть дом
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Правая колонка — цена */}
          <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-4">
                <div className="text-xs uppercase tracking-widest text-gray-400">
                  Стоимость
                </div>
                <div className="mt-1 text-2xl font-light md:text-3xl lg:text-4xl">
                  {hero.price}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
