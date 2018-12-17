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
async function imdbSearch(opts: SearchRequest): Promise<SearchResult[]> {
  let result;

  try {
    result = await imdb.search(opts, IMDB_SEARCH_PARAMS);
    return result.results;
  } catch (e) {
    logger.error(undefined, 'Error occured during imdb searching for movie %O. %O', opts, e);
  }
}

async function filmopotokSearch(opts: SearchRequest): Promise<SearchResult[]> {
  logger.debug(undefined, 'Checking russian release for movie %s', opts.name);

  const url = encodeURI(`http://filmpotok.ru/search/autocomplete/all/${opts.name}`);
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return [];
  }

  const torrents = JSON.parse(response)[1];
  return Object.values(torrents)
    .filter((item: any) => item.href.startsWith('/film'))
    .map((item: any) => {
      console.log(item.value);
      console.log(item.label.match(/<i>(.*?)<\/i>/)[1]);
      console.log(item.label.match(/> \((\d{4})/)[1]);
      return {
        title: item.value,
        name: item.label.match(/<i>(.*?)<\/i>/)[1],
        year: item.label.match(/> \((\d{4})/)[1],
        imdbid: item.slug.slice(0, 55), // Telegram can't pass more than 64 bytes as a callback data
        type: undefined,
        poster: undefined
      };
    });
}

export const movieSearch = {
  en: imdbSearch,
  ru: filmopotokSearch
};
