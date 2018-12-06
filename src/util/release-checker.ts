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
 * Returns true of movie has been released, false otherwise
 * @param imdbid - movie id from imdb
 */
export async function checkMovieRelease(imdbid: string): Promise<Boolean> {
  logger.debug(undefined, 'Checking release for movie %s', imdbid);

  const url = `http://api.apiumando.info/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${imdbid}`;
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return false;
  }

  const torrents = JSON.parse(response);

  return torrents.items && torrents.items.length > 0;
}
