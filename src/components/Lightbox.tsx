import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);
  const image = images[index];
  const many = images.length > 1;

  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );

  // Фокус уходит в диалог на открытии и возвращается на плитку при закрытии.
  useEffect(() => {
    restoreFocusTo.current = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      (restoreFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && many) prev();
      if (e.key === 'ArrowRight' && many) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next, many]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10"
      >
        <X size={24} aria-hidden="true" />
      </button>

      {many && (
        <>
          <button
            type="button"
            aria-label="Предыдущее фото"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10 md:left-6"
          >
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10 md:right-6"
          >
            <ChevronRight size={28} aria-hidden="true" />
          </button>
        </>
      )}

      <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="mx-auto max-h-[80dvh] w-auto rounded-lg object-contain"
        />
        {image.caption && (
          <figcaption className="mt-4 text-center text-sm text-gray-400">
            {image.caption}
            {many && (
              <span className="ml-2 text-gray-500">
                {index + 1} / {images.length}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
