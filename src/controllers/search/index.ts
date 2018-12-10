import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { deleteFromSession } from '../../util/session';
import { getMoviesMenu, getMovieList } from './helpers';
import { backKeyboard, backKeyboardBack, mainKeyboard } from '../../util/keyboards';
import { movieAction, addMovieAction } from './actions';
import { exposeMovie } from './middlewares';
import { backAction } from '../movies/actions';

const { leave } = Stage;
const searcher = new Scene('search');

searcher.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply(ctx.i18n.t('scenes.search.welcome_to_search'), backKeyboard);
});
searcher.leave(async (ctx: ContextMessageUpdate) => {
  deleteFromSession(ctx, 'movies');
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

searcher.command('cancel', leave());
searcher.hears(backKeyboardBack, leave());

searcher.on('text', async (ctx: ContextMessageUpdate, next: Function) => {
  logger.debug(ctx, 'Performing search for: %s', ctx.message.text);

  deleteFromSession(ctx, 'movies');
  const movies = await getMovieList(ctx);

  if (!movies) {
    await ctx.reply(ctx.i18n.t('scenes.search.no_movies_found'));
    return next();
  }

  await ctx.reply(ctx.i18n.t('scenes.search.list_of_found_movies'), getMoviesMenu(movies));
});

searcher.action(/movie/, exposeMovie, movieAction);
searcher.action(/add/, exposeMovie, addMovieAction);
searcher.action(/back/, backAction);

export default searcher;
