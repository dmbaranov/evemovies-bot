import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { saveToSession, deleteFromSession } from '../../util/session';
import { backKeyboard, backKeyboardBack, mainKeyboard } from '../../util/keyboards';
import { getMoviesMenu } from './helpers';
import { exposeMovie } from './middlewares';
import { movieAction, backAction, deleteAction } from './actions';

const { leave } = Stage;
const movies = new Scene('movies');

movies.enter(async (ctx: ContextMessageUpdate) => {
  // TODO: add update-time-stamp middleware
  const user = await User.findById(ctx.from.id);
  const movies = user.observableMovies;
  saveToSession(ctx, 'movies', movies);

  await ctx.reply('This is list of your movies', getMoviesMenu(movies));
  await ctx.reply("You can delete movies you don't want to track anymore", backKeyboard);
});

movies.leave(async (ctx: ContextMessageUpdate) => {
  deleteFromSession(ctx, 'movies');

  await ctx.reply('Hey, what are you up to?', mainKeyboard);
});

movies.command('cancel', leave());
movies.hears(backKeyboardBack, leave());

movies.action(/movie/, exposeMovie, movieAction);
movies.action(/back/, backAction);
movies.action(/delete/, exposeMovie, deleteAction);

export default movies;
