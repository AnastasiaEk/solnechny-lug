import { useState } from 'react';
import Lightbox from './Lightbox';
import Reveal from './Reveal';
import Section from './Section';
import { gallery } from '../content';

/**
 * Первая плитка занимает 2×2, поэтому на трёх колонках сетка сходится ровно
 * не при любом числе фото. Если после последней плитки остаётся пустая ячейка —
 * растягиваем её на две колонки, чтобы в ряду не зияла дыра.
 */
const lastTileIsWide = (gallery.length + 2) % 3 === 1;

export default function Gallery() {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <Section id="gallery" eyebrow="Фото" title="Жилой комплекс и дом">
      {/* Высота ряда задана явно: иначе плитки тянутся под самый высокий сосед,
          а картинка фиксированной высоты оставляет под собой чёрную полосу. */}
      <div className="grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[16rem] lg:grid-cols-3">
        {gallery.map((photo, i) => (
          <Reveal
            key={photo.src}
            delay={Math.min(i, 5) * 60}
            className={`h-full ${
              i === 0
                ? 'sm:col-span-2 sm:row-span-2'
                : lastTileIsWide && i === gallery.length - 1
                  ? 'lg:col-span-2'
                  : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={`Открыть фото: ${photo.caption}`}
              className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10"
            >
              <span className="block min-h-0 flex-1 overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </span>
              <span className="block bg-white/5 px-4 py-3 text-left text-sm text-gray-400">
                {photo.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {openAt !== null && (
        <Lightbox
          images={gallery}
          index={openAt}
          onClose={() => setOpenAt(null)}
          onNavigate={setOpenAt}
        />
      )}
    </Section>
  );
}
