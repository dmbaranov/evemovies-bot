import { Markup, Extra, ContextMessageUpdate } from 'telegraf';
import Movie from '../../models/Movie';
import User from '../../models/User';
import { movieSearch, ISearchResult } from '../../util/movie-search';
import logger from '../../util/logger';
import { saveToSession, deleteFromSession } from '../../util/session';
import { releaseChecker } from '../../util/release-checker';

/**
 * Returning list of movies. Taken either from API or from the session
 * @param ctx - telegram context
 */
export async function getMovieList(ctx: ContextMessageUpdate): Promise<ISearchResult[]> {
  if (ctx.session.movies) return ctx.session.movies as ISearchResult[];

  let movies: ISearchResult[];

  try {
    logger.debug(ctx, 'Searching for movie %s', ctx.message.text);
    movies = await movieSearch[ctx.session.language](ctx);

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
export function getMoviesMenu(movies: ISearchResult[]) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      movies.map(item => [
        m.callbackButton(
          `(${item.year}) ${item.title}`,
          JSON.stringify({ a: 'movie', p: item.id }),
          false
        )
      ]),
      {}
    )
  );
}

/**
 * Menu to control current movie
 * @param ctx - telegram context
 */
export function getMovieControlMenu(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.search.back_button'),
          JSON.stringify({ a: 'back', p: undefined }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.search.add_button'),
          JSON.stringify({ a: 'add', p: ctx.movie.id }),
          false
        )
      ],
      {}
    )
  );
}

/**
 * Pushing id to the user's observable array and clearing movies in session
 * @param ctx - telegram context
 */
export async function addMovieForUser(ctx: ContextMessageUpdate) {
  const movie: ISearchResult = ctx.movie;
  const movieDoc = await Movie.findOneAndUpdate(
    {
      _id: movie.id
    },
    {
      _id: movie.id,
      title: movie.title.replace(/ё/, 'e'),
      year: movie.year,
      posterUrl: movie.posterUrl,
      language: ctx.session.language,
      released: false
    },
    {
      new: true,
      upsert: true
    }
  );

  await User.findOneAndUpdate(
    {
      _id: ctx.from.id
    },
    {
      $addToSet: { observableMovies: movieDoc._id }
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
 */
export async function canAddMovie(ctx: ContextMessageUpdate) {
  logger.debug(ctx, 'Checks if can add a movie');
  const movieRelease = await releaseChecker[ctx.session.language]({
    id: ctx.movie.id,
    title: ctx.movie.title,
    year: ctx.movie.year
  });

  const user = await User.findById(ctx.from.id);

  if (movieRelease) {
    return ctx.i18n.t('scenes.search.reason_movie_released');
  } else if (user.observableMovies.some(m => m._id === ctx.movie.id)) {
    return ctx.i18n.t('scenes.search.reason_already_observing');
  }

  return true;
}
