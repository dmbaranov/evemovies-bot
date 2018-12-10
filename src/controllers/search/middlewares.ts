import { ContextMessageUpdate } from 'telegraf';
import { getMovieList } from './helpers';
import logger from '../../util/logger';

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export async function exposeMovie(ctx: ContextMessageUpdate, next: Function) {
  const movies = await getMovieList(ctx);
  if (!movies) {
    logger.error(ctx, 'Attempt to pick a movie from the previous message');
    return await ctx.reply('Something went wrong. Try one more time..');
  }

  const action = JSON.parse(ctx.callbackQuery.data);
  const movie = movies.results.find(item => item.imdbid === action.p);
  ctx.movie = movie;
  return next();
}
