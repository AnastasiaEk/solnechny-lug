import { contacts, site } from '../content';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">{site.name}</div>
          <p className="mt-2 text-sm text-gray-400">
            {site.tagline}, {site.city}
          </p>
          <p className="mt-1 text-sm text-gray-400">{contacts.address}</p>
        </div>

        <div className="text-sm md:text-right">
          <a
            href={contacts.phoneHref}
            className="cursor-pointer text-lg transition-colors duration-200 hover:text-gray-300"
          >
            {contacts.phone}
          </a>
          <p className="mt-1 text-gray-400">
            <a
              href={`mailto:${contacts.email}`}
              className="cursor-pointer transition-colors duration-200 hover:text-gray-300"
            >
              {contacts.email}
            </a>
          </p>
          <p className="mt-4 text-gray-500">
            © {new Date().getFullYear()} {site.name}. Не является публичной офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
