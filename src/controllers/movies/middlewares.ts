import { ContextMessageUpdate } from 'telegraf';
import { IMovie } from '../../models/Movie';

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export function exposeMovie(ctx: ContextMessageUpdate, next: Function) {
  const action = JSON.parse(ctx.callbackQuery.data);
  ctx.movie = (ctx.session.movies as IMovie[]).find((item: IMovie) => item._id === action.p);

  return next();
}
