import { Markup, Extra } from 'telegraf';
import { SearchResult, SearchResults } from 'imdb-api';
import { search } from '../../util/imdb';
import logger from '../../util/logger';

/**
 * Returning list of movies. Taken either from imdb API or from the session
 * @param ctx - telegram context
 */
export async function getMovieList(ctx: any): Promise<SearchResults> {
  if (ctx.session.movies) return ctx.session.movies;

  let movies: SearchResults;

  try {
    movies = await search({ name: ctx.message.text });
    saveMoviesToSession(ctx, movies);

    return movies;
  } catch (e) {
    logger.error(ctx, 'Search failed with the error: %o', e);
  }
}

/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
export function getMoviesMenu(movies: SearchResults) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      movies.results.map(item => [
        m.callbackButton(
          `(${item.year}) ${item.title}`,
          JSON.stringify({ a: 'movie', p: item.imdbid }),
          false
        )
      ]),
      {}
    )
  );
}

/**
 * Menu to control current movie
 * @param movie - single movie
 */
export function getMovieControlMenu(movie: SearchResult) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(`Back`, JSON.stringify({ a: 'back', p: undefined }), false),
        m.callbackButton(`Add`, JSON.stringify({ a: 'add', p: movie.imdbid }), false)
      ],
      {}
    )
  );
}

/**
 * Saving list of movies to the session to prevent redundant API calls to imdb
 * @param ctx - telegram context
 * @param movies - list of movies
 */
export function saveMoviesToSession(ctx: any, movies: SearchResults) {
  logger.debug(ctx, 'Saving movies to the session');
  ctx.session.movies = movies;
}

/**
 * Removing movies from the session
 * @param ctx - telegram context
 */
export function clearSessionMovies(ctx: any) {
  logger.debug(ctx, 'Clearing session movies');
  delete ctx.session.movies;
}
