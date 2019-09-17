import { Extra, Markup, ContextMessageUpdate } from 'telegraf';
import { IMovie } from '../../models/Movie';
import User from '../../models/User';
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
 * @param ctx - telegram context
 */
export function getMovieControlMenu(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.movies.back_button'),
          JSON.stringify({ a: 'back', p: undefined }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.movies.delete_button'),
          JSON.stringify({ a: 'delete', p: ctx.movie._id }),
          false
        )
      ],
      {}
    )
  );
}

/**
 * Delete movie from observable array and refreshes movies in session
 * @param ctx - telegram context
 */
export async function deleteMovieFromObservables(ctx: ContextMessageUpdate): Promise<IMovie[]> {
  const user = await User.findOneAndUpdate(
    { _id: ctx.from.id },
    {
      $pull: { observableMovies: ctx.movie._id }
    },
    {
      new: true
    }
  ).populate('observableMovies');

  saveToSession(ctx, 'movies', user.observableMovies);

  return user.observableMovies;
}
