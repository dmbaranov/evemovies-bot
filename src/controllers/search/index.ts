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
  await ctx.reply(
    'Here you can search for movies! Just type the title in and hit enter. Use /cancel or inline keyboard to return',
    backKeyboard
  );
});
searcher.leave(async (ctx: ContextMessageUpdate) => {
  deleteFromSession(ctx, 'movies');
  await ctx.reply('Hey, what are you up to?', mainKeyboard);
});

searcher.command('cancel', leave());
searcher.hears(backKeyboardBack, leave());

searcher.on('text', async (ctx: ContextMessageUpdate, next: any) => {
  logger.debug(ctx, 'Performing search for: %s', ctx.message.text);

  deleteFromSession(ctx, 'movies');
  const movies = await getMovieList(ctx);

  if (!movies) {
    await ctx.reply(
      'No movies were found... Try to specify your request or /cancel to stop searching'
    );
    return next();
  }

  await ctx.reply(
    "Here's a list of movies that I found for you! Please, choose one or specify your request and try",
    getMoviesMenu(movies)
  );
});

searcher.action(/movie/, exposeMovie, movieAction);
searcher.action(/add/, exposeMovie, addMovieAction);
searcher.action(/back/, backAction);

export default searcher;
