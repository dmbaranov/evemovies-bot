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
  try {
    const imdbIdChecker = /[t]{2}[0-9]+/;

    if (imdbIdChecker.exec(params.title)) {
      const imdbIdResult = await imdbAPI.get({ id: params.title }, IMDB_SEARCH_PARAMS);

      return [
        {
          id: imdbIdResult.imdbid,
          title: imdbIdResult.title,
          year: imdbIdResult.year,
          posterUrl: imdbIdResult.poster,
          skipFiltering: true
        }
      ];
    } else {
      const results = await imdbAPI.search({ name: params.title, year: params.year }, IMDB_SEARCH_PARAMS);

      return results.results.map((item) => ({
        id: item.imdbid,
        title: item.title,
        year: item.year,
        posterUrl: item.poster
      }));
    }
  } catch (e) {
    if (e.message && (e.message.includes('Movie not found') || e.message.includes('Incorrect IMDb ID'))) {
      // Don't log this 404 message
    } else {
      logger.error(undefined, 'Error occurred during imdb searching for movie %O. %O', params, e);
    }

    return [];
  }
}
