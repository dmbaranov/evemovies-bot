import { IMovie } from '../../models/Movie';

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export function exposeMovie(ctx: any, next: Function) {
  const action = JSON.parse(ctx.callbackQuery.data);
  const movie: IMovie = ctx.session.movies.find((item: any) => item._id === action.p);
  ctx.movie = movie;

  return next();
}
