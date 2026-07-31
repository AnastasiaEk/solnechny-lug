import { ExternalLink, MapPin } from 'lucide-react';
import Reveal from './Reveal';
import Section from './Section';
import { contacts, mapEmbedSrc, nearby } from '../content';

export default function MapBlock() {
  return (
    <Section id="map" eyebrow="Как добраться" title="Локация">
      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="panel flex h-full flex-col rounded-xl p-8">
            <MapPin size={26} strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-5 text-lg leading-relaxed">{contacts.address}</p>

            <dl className="mt-8 space-y-3 text-sm">
              {nearby.map((item) => (
                <div key={item.title} className="flex items-baseline justify-between gap-4">
                  <dt className="text-gray-400">{item.title}</dt>
                  <dd className="tabular-nums text-white">{item.distance}</dd>
                </div>
              ))}
            </dl>

            <a
              href={contacts.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border border-white/20 px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white hover:text-black"
            >
              Открыть в Яндекс.Картах
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-3">
          <div className="panel h-full min-h-[24rem] overflow-hidden rounded-xl">
            {/* sandbox не даёт фрейму увести пользователя с сайта: разрешено
                ровно то, что нужно карте для работы. referrerpolicy не отдаёт
                Яндексу полный адрес страницы. */}
            <iframe
              src={mapEmbedSrc}
              title="Карта: Волгореченск, Луговая улица"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              className="h-full min-h-[24rem] w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
