import * as imdb from 'imdb-api';
import { SearchRequest } from 'imdb-api';
import logger from './logger';

const SEARCH_PARAMS = {
  apiKey: process.env.IMDB_API_KEY,
  timeout: 30000
};

/**
 * Returns list of movies from the imdb API
 * @param opts - search parameters
 */
export function search(opts: SearchRequest) {
  let result;

  try {
    result = imdb.search(opts, SEARCH_PARAMS);
    return result;
  } catch (e) {
    logger.error(null, 'Error occured during searching for movie %O. %O', opts, e);
  }
}
