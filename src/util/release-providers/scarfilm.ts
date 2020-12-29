import * as rp from 'request-promise';
import cheerio from 'cheerio';
import logger from '../logger';
import { ICheckerConfig } from '../release-checker';
import { isNumberInRage, checkStringSimilarity } from '../common';

/**
 * Returns true if movie has been released, false otherwise
 * @param config - config to check the movie
 */
export async function scarfilmReleaseChecker(config: ICheckerConfig): Promise<boolean> {
  logger.debug(undefined, 'Checking russian release for movie %s', config.title);

  const url = encodeURI(`https://scarfilm.org/?s=${config.title}`);
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

  $('.widget-content-magone-archive-blog-rolls .shad.item').each((index, elem) => {
    if (!$(elem).html().length) return;

    if (!$(elem).find('.item-main').text().includes('Уже в сети')) return;

    let releaseNotReady = false;
    const noReleaseKeywords = ['Субтитры', 'Авторский'];
    const movieSnippet = $(elem).find('.item-snippet').text();

    noReleaseKeywords.forEach((keyword) => {
      if (movieSnippet.includes(keyword)) releaseNotReady = true;
    });

    if (releaseNotReady) return;

    const configTitle = config.title.replace(/ё/, 'е');

    const movieData = $(elem)
      .find('.item-title')
      .text()
      .replace(/ё/, 'е')
      .trim()
      .toLowerCase()
      .split(/\((\d{4})\)/);

    const movieTitle = movieData[0];
    const movieYear = movieData[1];

    if (
      checkStringSimilarity(movieTitle, configTitle) &&
      isNumberInRage(+config.year, +movieYear)
    ) {
      released = true;
    }

    return false;
  });

  return released;
}
