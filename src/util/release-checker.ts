import * as rp from 'request-promise';
import cheerio from 'cheerio';
import logger from '../util/logger';

interface ICheckerConfig {
  imdbid: string;
  title: string;
  year: number;
}

/**
 * Returns true of movie has been released, false otherwise
 * @param imdbid - movie id from imdb
 */
async function checkMovieRelease(config: ICheckerConfig): Promise<Boolean> {
  logger.debug(undefined, 'Checking release for movie %s', config.imdbid);

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
      // This is english title
      // const movieTitle = $(elem)
      //   .find('.archive-note3 a')
      //   .html()
      //   .match(/\/ ([a-zA-Z0-9_ ]*) /)[1]
      //   .toLocaleLowerCase();

      const movieTitle = $(elem)
        .find('.archive-note3 a')
        .html()
        .split('/')[0]
        .replace(/\"/g, '')
        .trim()
        .toLocaleLowerCase();

      const movieYear = $(elem)
        .find('.archive-year strong')
        .text();

      if (config.title.toLowerCase() === movieTitle && config.year === +movieYear) released = true;
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
