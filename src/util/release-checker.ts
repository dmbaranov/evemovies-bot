import * as rp from 'request-promise';
import logger from '../util/logger';

export interface ISquawkrResponse {
  rlname: string;
  added_timestamp: string;
  tmdb_id: string;
  parsed_title: string;
  parsed_year: string;
  parsed_quality: string;
  parsed_language: string;
  parsed_format: string;
}

export interface IYtsResponse {
  title: string;
  year: string;
}

/**
 * Returns a movie if it has been released, undefined otherwise
 * @param title - movie title
 * @param year -movie year
 */

export async function checkMovieRelease(title: string, year: string): Promise<IYtsResponse> {
  logger.debug(null, 'Checking release for movie %s', title);
  const url = encodeURI(`https://yts.am/ajax/search?query=${title}`);

  const response = await rp.get(url);
  const movies: IYtsResponse[] = JSON.parse(response).data;

  if (!movies) return undefined;

  return movies.find(
    movie => movie.title.toLocaleLowerCase() === title.toLocaleLowerCase() && movie.year === year
  );
}
