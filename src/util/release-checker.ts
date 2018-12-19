import * as rp from 'request-promise';
import cheerio from 'cheerio';
import logger from '../util/logger';

interface ICheckerConfig {
  imdbid: string;
  title: string;
  year: number;
}

/**
 * Returns true if movie has been released, false otherwise
 * @param config - config to check the movie
 */
async function checkMovieRelease(config: ICheckerConfig): Promise<Boolean> {
  logger.debug(undefined, 'Checking international release for movie %s', config.imdbid);

  const url = `http://api.apiumando.info/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${
    config.imdbid
  }`;
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return false;
  }

  const torrents = JSON.parse(response);

  return torrents.items && torrents.items.length > 0;
}

/**
 * Returns true if movie has been released, false otherwise
 * @param config - config to check the movie
 */
async function checkRussianMovieRelease(config: ICheckerConfig) {
  logger.debug(undefined, 'Checking russian release for movie %s', config.title);

  const url = encodeURI(`http://scarabey.org/?s=${config.title}`);
  let response;

  try {
    response = await rp.get(url);
  } catch (e) {
    return false;
  }

  let released = false;
  const $ = cheerio.load(response, {
    decodeEntities: false
  });

  $('.post-row4').each((index, elem) => {
    if (!$(elem).html().length) {
      return;
    }

    try {
      const movieTitle = $(elem)
        .find('.archive-note3 a')
        .html()
        .replace(/ё/, 'е')
        .trim()
        .toLocaleLowerCase();

      const movieYear = $(elem)
        .find('.archive-year strong')
        .text();

      if (movieTitle.includes(config.title.toLowerCase()) && +config.year === +movieYear) {
        released = true;
      }
    } catch (e) {
      // TODO: make if instead of try catch
      logger.error(undefined, 'Catch... %O', e);
    }
  });

  return released;
}

export const releaseChecker = {
  en: checkMovieRelease,
  ru: checkRussianMovieRelease
};
