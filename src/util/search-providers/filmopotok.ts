import * as rp from 'request-promise';
import { ISearchParameters, ISearchResult } from '../movie-search';

/**
 * Returns list of movies from the filmopotok
 * @param params - search parameters
 */
export async function filmopotok(params: ISearchParameters): Promise<ISearchResult[]> {
  const url = encodeURI(`http://filmpotok.ru/search/autocomplete/all/${params.title}`);
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return [];
  }

  const torrents = JSON.parse(response)[1];

  return Object.values(torrents)
    .filter((item: any) => item.href.startsWith('/film'))
    .map((item: any) => ({
      id: item.slug.slice(0, 40), // Telegram can't pass more than 64 bytes as a callback data
      title: item.value,
      year: item.label.match(/> \((\d{4})/)[1],
      posterUrl: item.label.match(/http:\/\/.*"/g)[0].slice(0, -1)
    }));
}
