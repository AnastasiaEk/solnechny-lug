/**
 * Ссылка на файл из public/ с учётом базового адреса сборки.
 *
 * На своём домене сайт лежит в корне и base = '/', на GitHub Pages —
 * в подпапке вида /solnechny-lug/. Абсолютный путь '/photos/dom.webp' во втором
 * случае даст 404, поэтому все ссылки на статику идут через эту функцию.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
