import { ContextMessageUpdate } from 'telegraf';
import { getMovieControlMenu, getMoviesMenu, deleteMovieFromObservables } from './helpers';
import logger from '../../util/logger';

export const movieAction = async (ctx: ContextMessageUpdate) =>
  await ctx.editMessageText(
    ctx.i18n.t('scenes.movies.chosen_movie', {
      title: ctx.movie.title
    }),
    getMovieControlMenu(ctx)
  );

export const backAction = async (ctx: ContextMessageUpdate) =>
  await ctx.editMessageText(
    ctx.i18n.t('scenes.movies.list_of_movies'),
    getMoviesMenu(ctx.session.movies)
  );

export const deleteAction = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Removing movie %s from collection', ctx.movie._id);

  const updatedMovieList = await deleteMovieFromObservables(ctx);
  await ctx.editMessageText(
    ctx.i18n.t('scenes.movies.list_of_movies'),
    getMoviesMenu(updatedMovieList)
  );
};
