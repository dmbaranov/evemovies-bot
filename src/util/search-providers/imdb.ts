import * as imdb from 'imdb-api';
import { ISearchParameters, ISearchResult } from '../movie-search';
import logger from '../logger';

const IMDB_SEARCH_PARAMS = {
  apiKey: process.env.IMDB_API_KEY,
  timeout: 30000
};

/**
 * Returns list of movies from the imdb API
 * @param ctx - telegram context
 * @param opts - search parameters
 */
async function imdbSearch(params: ISearchParameters): Promise<ISearchResult[]> {
  let result;

  try {
    result = await imdb.search(opts, IMDB_SEARCH_PARAMS);

    return result.results;
  } catch (e) {
    logger.error(undefined, 'Error occured during imdb searching for movie %O. %O', opts, e);
  }
}
