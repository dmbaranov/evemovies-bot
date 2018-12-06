import { Markup, Extra, ContextMessageUpdate } from 'telegraf';
import { SearchResult, SearchResults } from 'imdb-api';
import Movie from '../../models/Movie';
import User from '../../models/User';
import { search } from '../../util/imdb';
import logger from '../../util/logger';
import { saveToSession, deleteFromSession } from '../../util/session';
import { checkMovieRelease } from '../../util/release-checker';

/**
 * Returning list of movies. Taken either from imdb API or from the session
 * @param ctx - telegram context
 */
export async function getMovieList(ctx: any): Promise<SearchResults> {
  if (ctx.session.movies) return ctx.session.movies;

  let movies: SearchResults;

  try {
    logger.debug(ctx, 'Searching for movie %s', ctx.message.text);
    movies = await search({ name: ctx.message.text });
    saveToSession(ctx, 'movies', movies);

    return movies;
  } catch (e) {
    logger.error(ctx, 'Search failed with the error: %O', e);
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
 * Pushing imdbid to the user's observalbe array and clearing movies in session
 * @param ctx - telegram context
 * @param movie - single movie
 */
export async function addMovieForUser(ctx: ContextMessageUpdate, movie: SearchResult) {
  logger.debug(ctx, 'Adding movie %s to observables', movie.name);

  let movieImdb;
  const existingMovie = await Movie.findById(movie.imdbid);

  if (existingMovie) {
    movieImdb = existingMovie._id;
  } else {
    const newMovie = new Movie({
      _id: movie.imdbid,
      title: movie.title,
      year: movie.year,
      released: false
    });

    await newMovie.save();
    movieImdb = movie.imdbid;
  }

  await User.findOneAndUpdate(
    {
      _id: ctx.from.id
    },
    {
      $addToSet: { observableMovies: movieImdb }
    },
    {
      new: true
    }
  );

  deleteFromSession(ctx, 'movies');
}

/**
 * Perform several checks, returns either a reason why movie can't be added or true
 * @param ctx - telegram context
 * @param movie - single movie
 */
export async function canAddMovie(ctx: ContextMessageUpdate, movie: SearchResult) {
  const movieRelease = await checkMovieRelease(movie.imdbid);
  const user = await User.findById(ctx.from.id);

  if (movieRelease) {
    return `This movie has been already released.`;
  } else if (user.observableMovies.some(m => m._id === movie.imdbid)) {
    return "You're already observing this movie.";
  }

  return true;
}
