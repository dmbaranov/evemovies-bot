import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { saveToSession, deleteFromSession } from '../../util/session';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import { getMoviesMenu } from './helpers';
import { exposeMovie } from './middlewares';
import { movieAction, backAction, deleteAction } from './actions';

const { leave } = Stage;
const movies = new Scene('movies');

movies.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  const user = await User.findById(ctx.from.id);
  const movies = user.observableMovies;
  saveToSession(ctx, 'movies', movies);

  await ctx.reply(ctx.i18n.t('scenes.movies.list_of_movies'), getMoviesMenu(movies));
  await ctx.reply(ctx.i18n.t('scenes.movies.delete_unwanted_movies'), backKeyboard);
});

movies.leave(async (ctx: ContextMessageUpdate) => {
  const { mainKeyboard } = getMainKeyboard(ctx);
  deleteFromSession(ctx, 'movies');

  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

movies.command('cancel', leave());
movies.hears(match('keyboards.back_keyboard.back'), leave());

movies.action(/movie/, exposeMovie, movieAction);
movies.action(/back/, backAction);
movies.action(/delete/, exposeMovie, deleteAction);

export default movies;
