import { Extra, Markup } from 'telegraf';
import { IMovie } from '../../models/Movie';
import User from '../../models/User';
import logger from '../../util/logger';
import { saveToSession } from '../../util/session';

/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
export function getMoviesMenu(movies: IMovie[]) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      movies.map(item => [
        m.callbackButton(
          `(${item.year}) ${item.title}`,
          JSON.stringify({ a: 'movie', p: item._id }),
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
export function getMovieControlMenu(movie: IMovie) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(`Back`, JSON.stringify({ a: 'back', p: undefined }), false),
        m.callbackButton(`Delete`, JSON.stringify({ a: 'delete', p: movie._id }), false)
      ],
      {}
    )
  );
}

/**
 * Deletes movie from observable array and refreshes movies in session
 * @param ctx - telegram context
 * @param imdbid - movie id
 */
export async function deleteMovieFromObservables(ctx: any, imdbid: string): Promise<IMovie[]> {
  logger.debug(ctx, 'Removing movie %s from collection', imdbid);

  const user = await User.findOneAndUpdate(
    { _id: ctx.from.id },
    {
      $pull: { observableMovies: imdbid }
    },
    {
      new: true
    }
  );

  saveToSession(ctx, 'movies', user.observableMovies);
  return user.observableMovies;
}
