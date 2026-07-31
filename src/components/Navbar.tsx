import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { nav, site } from '../content';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Меню — оверлей на весь экран, поэтому фон под ним скроллиться не должен.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 px-6 pt-6 md:px-12 lg:px-16">
      <nav
        aria-label="Основная навигация"
        className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2"
      >
        <a
          href="#top"
          className="text-2xl font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="cursor-pointer text-sm transition-colors duration-200 hover:text-gray-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="cursor-pointer rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-gray-100 sm:px-6"
          >
            Записаться
          </a>

          <button
            type="button"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10 md:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="liquid-glass mt-2 rounded-xl p-2 md:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block cursor-pointer rounded-lg px-4 py-3 text-base transition-colors duration-200 hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
