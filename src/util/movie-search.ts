import { ContextMessageUpdate } from 'telegraf';
import logger from './logger';
import { filmopotok, imdb } from './search-providers';

export interface ISearchParameters {
  title: string;
  year: number;
  language: 'ru' | 'en';
}

export interface ISearchResult {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
}

type Provider = (params: ISearchParameters) => Promise<ISearchResult[]>;

// Filter search result so that only fresh movie will be visible. Used as currentYear - number
const MOVIE_TTL = 3;

const movieSearchWrapper = (provider: Provider) => async (ctx: ContextMessageUpdate) => {
  const currentYear = new Date().getFullYear();
  const { language } = ctx.session;
  let title = ctx.message.text;
  let year;
  const yearSearchResult = ctx.message.text.match(/\[[1,2][0-9]{3}]$/g); // e.g. [2019]

  if (yearSearchResult) {
    year = Number(yearSearchResult[0].slice(1, -1));
    title = title.slice(0, -7);
  }

  const rawResult = await provider({
    title,
    year,
    language
  });

  const filteredResult = rawResult.filter(movie => movie.year >= currentYear - MOVIE_TTL);

  logger.debug(
    ctx,
    'Movie search: params %O, results length %d',
    { title, year, language },
    filteredResult.length
  );

  return filteredResult;
};

export const movieSearch = {
  en: movieSearchWrapper(imdb),
  ru: movieSearchWrapper(filmopotok)
};
