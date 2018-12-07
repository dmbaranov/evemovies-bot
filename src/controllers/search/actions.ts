import { ContextMessageUpdate } from 'telegraf';
import {
  getMovieControlMenu,
  canAddMovie,
  addMovieForUser,
  getMovieList,
  getMoviesMenu
} from './helpers';
import { deleteFromSession } from '../../util/session';
import logger from '../../util/logger';

export const movieAction = async (ctx: any) =>
  await ctx.editMessageText(
    `You've chosen movie: ${ctx.movie.title}`,
    getMovieControlMenu(ctx.movie)
  );

export const addMovieAction = async (ctx: any) => {
  const canAddResult = await canAddMovie(ctx);

  if (typeof canAddResult === 'string') {
    await ctx.editMessageText(`${canAddResult} Continue search or /cancel to leave`);
  } else {
    logger.debug(ctx, 'User is addings movie %O to this collection', ctx.movie);

    await addMovieForUser(ctx);
    await ctx.editMessageText(
      `Added ${ctx.movie.name} to your lib! Continue search or /cancel to leave`
    );
  }

  deleteFromSession(ctx, 'movies');
};

export const backAction = async (ctx: ContextMessageUpdate) => {
  const movies = await getMovieList(ctx);

  await ctx.editMessageText(
    "Here's a list of movies that I found for you! Please, choose one or specify your request",
    getMoviesMenu(movies)
  );
};
