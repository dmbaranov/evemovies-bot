import rp from 'request-promise';
import logger from '../logger';
import { ISearchParameters, ISearchResult } from '../movie-search';

const languagesMap = {
  ru: 'ru-RU',
  en: 'en-US'
};

/**
 * Returns list of movies from the TheMovieDatabase API
 * @param params - search parameters
 */
export async function tmdb(params: ISearchParameters): Promise<ISearchResult[]> {
  // TODO: it has limits 40 requests per 10 seconds. Make a race between
  //  en response and setTimeout 2500

  const year = params.year ? `&year=${params.year}` : '';
  const url = encodeURI(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=${
      languagesMap[params.language]
    }&query=${params.title}&page=1&include_adult=false${year}`
  );

  let response;

  try {
    response = await rp({
      uri: url,
      resolveWithFullResponse: true,
      json: true
    });

    return response.body.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: Number(movie.release_date.slice(0, 4))
    }));
  } catch (e) {
    logger.error(undefined, 'Error occurred during tmdb search for movie %O. %O', params, e);

    return [];
  }
}
