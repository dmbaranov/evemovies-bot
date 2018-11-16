import * as imdb from 'imdb-api';
import { SearchRequest } from 'imdb-api';
import logger from '../util/logger';

const SEARCH_PARAMS = {
  apiKey: process.env.IMDB_API_KEY,
  timeout: 30000
};

/**
 * Returns list of movies
 * @param opts - search parameters
 */
export function search(opts: SearchRequest) {
  return imdb.search(opts, SEARCH_PARAMS);
}
