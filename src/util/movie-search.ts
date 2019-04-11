// import { ContextMessageUpdate } from 'telegraf';
import * as imdb from 'imdb-api';
import { SearchRequest, SearchResult, RequestType } from 'imdb-api';
import * as rp from 'request-promise';
// import { tmdb } from './search-providers';
import logger from './logger';

// const IMDB_SEARCH_PARAMS = {
//   apiKey: process.env.IMDB_API_KEY,
//   timeout: 30000
// };
//
// /**
//  * Returns list of movies from the imdb API
//  * @param opts - search parameters
//  */
// async function imdbSearch(ctx: ContextMessageUpdate, opts: SearchRequest): Promise<SearchResult[]> {
//   let result;
//   const parsedYear = opts.name.match(/\[[1,2][0-9]{3}\]$/g);
//
//   if (parsedYear) {
//     opts.year = +parsedYear[0].substr(1, 4);
//     opts.name = opts.name.slice(0, -7);
//   }
//
//   try {
//     result = await imdb.search(opts, IMDB_SEARCH_PARAMS);
//     logger.debug(
//       ctx,
//       'Searching for an IMDB movie with the parameters %O, amount of results %d',
//       opts,
//       result.results.length
//     );
//
//     return result.results;
//   } catch (e) {
//     logger.error(undefined, 'Error occured during imdb searching for movie %O. %O', opts, e);
//   }
// }

import { ContextMessageUpdate } from 'telegraf';
import { filmopotok, tmdb } from './search-providers';

export interface ISearchParameters {
  title: string;
  year: number;
  language: 'ru' | 'en';
}

export interface ISearchResult {
  id: string;
  title: string;
  year: number;
}

type Provider = (params: ISearchParameters) => Promise<ISearchResult[]>;

// Filter search result so that only fresh movie will be visible. Used as currentYear - number
const MOVIE_TTL = 3;

const movieSearchWrapper = (provider: Provider) => async (ctx: ContextMessageUpdate) => {
  const currentYear = new Date().getFullYear();
  const { language } = ctx.session;
  let title = ctx.message.text;
  let year: any = ctx.message.text.match(/\[[1,2][0-9]{3}\]$/g);

  if (year) {
    year = Number(year[0].slice(1, -1));
    title = title.slice(0, -7);
  }

  // const year = ctx.message.text.match(/\[[1,2][0-9]{3}\]$/g);

  const result = await provider({
    title,
    year,
    language
  });

  console.log(result);
  return result.filter(movie => movie.year >= currentYear - MOVIE_TTL);
};

export const movieSearch = {
  en: movieSearchWrapper(filmopotok),
  ru: movieSearchWrapper(tmdb)
  // en: imdbSearch,
  // ru: filmopotokSearch
} as any;
