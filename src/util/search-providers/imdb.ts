import * as imdbAPI from 'imdb-api';
import { ISearchParameters, ISearchResult } from '../movie-search';
import logger from '../logger';

const IMDB_SEARCH_PARAMS = {
  apiKey: process.env.IMDB_API_KEY,
  timeout: 30000
};

/**
 * Returns list of movies from the imdb API
 * @param params - search parameters
 */
export async function imdb(params: ISearchParameters): Promise<ISearchResult[]> {
  let result;

  try {
    result = await imdbAPI.search({ name: params.title, year: params.year }, IMDB_SEARCH_PARAMS);

    return result.results.map(item => ({
      id: item.imdbid,
      title: item.title,
      year: item.year,
      posterUrl: item.poster
    }));
  } catch (e) {
    if (e.message && e.message.includes('Movie not found')) {
      // Don't log this 404 message
    } else {
      logger.error(undefined, 'Error occurred during imdb searching for movie %O. %O', params, e);
    }

    return [];
  }
}
