import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { deleteFromSession } from '../../util/session';
import { getMoviesMenu, getMovieList } from './helpers';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import { movieAction, addMovieAction, backAction } from './actions';
import { exposeMovie } from './middlewares';

const { leave } = Stage;
const searcher = new Scene('search');

searcher.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enter search scene');
  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('scenes.search.welcome_to_search'), backKeyboard);
});
searcher.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves search scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  deleteFromSession(ctx, 'movies');

  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

searcher.command('saveme', leave());
searcher.hears(match('keyboards.back_keyboard.back'), leave());

searcher.on('text', async (ctx: ContextMessageUpdate) => {
  deleteFromSession(ctx, 'movies');
  const movies = await getMovieList(ctx);

  if (!movies || !movies.length) {
    await ctx.reply(ctx.i18n.t('scenes.search.no_movies_found'));
    return;
  }

  await ctx.reply(ctx.i18n.t('scenes.search.list_of_found_movies'), getMoviesMenu(movies));
});

searcher.action(/movie/, exposeMovie, movieAction);
searcher.action(/add/, exposeMovie, addMovieAction);
searcher.action(/back/, backAction);

export default searcher;
