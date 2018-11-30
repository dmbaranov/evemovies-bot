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

const GOOD_FORMATS = ['BluRay', 'HDTV', 'WEB-DL', 'DVD'];
const GOOD_QUALITIES = ['720p', '1080p', '4K'];

/**
 * Returns true if movie has been released, false otherwise
 * @param title - movie title
 */
export async function checkMovieRelease(title: string): Promise<ISquawkrResponse> {
  logger.debug(null, 'Checking release for movie %s', title);
  const { SQUAWKR_API_KEY } = process.env;
  const url = encodeURI(
    `https://api.squawkr.io/search.php?apikey=${SQUAWKR_API_KEY}&name=${title.replace(/:/g, '')}`
  );
  const response: string = await rp.get(url);
  const movies: ISquawkrResponse[] = JSON.parse(response);

  if (!movies) {
    return undefined;
  }

  return movies.find(
    item =>
      GOOD_FORMATS.includes(item.parsed_format) && GOOD_QUALITIES.includes(item.parsed_quality)
  );
}
