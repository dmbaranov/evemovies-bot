import { getMovieControlMenu, getMoviesMenu, deleteMovieFromObservables } from './helpers';
import logger from '../../util/logger';

export const movieAction = async (ctx: any) =>
  await ctx.editMessageText(
    `You've chosen movie: ${ctx.movie.title}`,
    getMovieControlMenu(ctx.movie)
  );

export const backAction = async (ctx: any) =>
  await ctx.editMessageText('This is list of your movies', getMoviesMenu(ctx.session.movies));

export const deleteAction = async (ctx: any) => {
  logger.debug(ctx, 'Removing movie %s from collection', ctx.movie._id);

  const updatedMovieList = await deleteMovieFromObservables(ctx);
  await ctx.editMessageText('This is list of your movies', getMoviesMenu(updatedMovieList));
};
