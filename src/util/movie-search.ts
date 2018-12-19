import { ContextMessageUpdate } from 'telegraf';
import * as imdb from 'imdb-api';
import { SearchRequest, SearchResult, RequestType } from 'imdb-api';
import * as rp from 'request-promise';
import logger from './logger';

const IMDB_SEARCH_PARAMS = {
  apiKey: process.env.IMDB_API_KEY,
  timeout: 30000
};

/**
 * Returns list of movies from the imdb API
 * @param opts - search parameters
 */
async function imdbSearch(ctx: ContextMessageUpdate, opts: SearchRequest): Promise<SearchResult[]> {
  let result;

  try {
    result = await imdb.search(opts, IMDB_SEARCH_PARAMS);
    logger.debug(
      ctx,
      'Searching for an IMDB movie with the parameters %O, amount of results %d',
      opts,
      result.results.length
    );

    return result.results;
  } catch (e) {
    logger.error(undefined, 'Error occured during imdb searching for movie %O. %O', opts, e);
  }
}

/**
 * Returns list of movies from the filmopotok
 * @param opts - search parameters
 */
async function filmopotokSearch(
  ctx: ContextMessageUpdate,
  opts: SearchRequest
): Promise<SearchResult[]> {
  const url = encodeURI(`http://filmpotok.ru/search/autocomplete/all/${opts.name}`);
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return [];
  }

  const torrents = JSON.parse(response)[1];
  const result = Object.values(torrents)
    .filter((item: any) => item.href.startsWith('/film'))
    .map((item: any) => ({
      title: item.value,
      name: item.label.match(/<i>(.*?)<\/i>/)[1],
      year: item.label.match(/> \((\d{4})/)[1],
      imdbid: item.slug.slice(0, 40), // Telegram can't pass more than 64 bytes as a callback data
      type: undefined,
      poster: undefined
    }));

  logger.debug(
    ctx,
    'Searching for a filmopotok movie with the parameters %O, amount of results %d',
    opts,
    result.length
  );
  return result;
}

export const movieSearch = {
  en: imdbSearch,
  ru: filmopotokSearch
};
