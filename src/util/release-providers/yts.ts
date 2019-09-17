import * as rp from 'request-promise';
import logger from '../logger';
import { ICheckerConfig } from '../release-checker';
import { isNumberInRage, checkStringSimilarity } from '../common';

/**
 * Returns true if movie has been released, false otherwise
 * @param config - config to check the movie
 */
export async function ytsReleaseChecker(config: ICheckerConfig): Promise<boolean> {
  logger.debug(undefined, 'Checking international release for movie %s', config.id);
  const url = encodeURI(`https://yts.am/api/v2/list_movies.json?query_term=${config.id}`);

  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    logger.error(undefined, 'Error occurred during checking release for movie %O, %O', config, e);
    return false;
  }

  const movies: any = JSON.parse(response).data;

  if (!movies.movies) return false;

  return movies.movies.some((movie: any) => {
    const GOOD_QUALITY = ['720p', '1080p'];
    const isGoodQuality = movie.torrents.some((torrent: any) =>
      GOOD_QUALITY.includes(torrent.quality)
    );

    return (
      isGoodQuality &&
      movie.imdb_code === config.id &&
      checkStringSimilarity(movie.title_english, config.title) &&
      isNumberInRage(movie.year, config.year)
    );
  });
}
