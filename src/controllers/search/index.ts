import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { deleteFromSession } from '../../util/session';
import {
  getMovieControlMenu,
  getMoviesMenu,
  getMovieList,
  addMovieForUser,
  canAddMovie
} from './helpers';
import { backKeyboard, backKeyboardBack, mainKeyboard } from '../../util/keyboards';

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

searcher.on('callback_query', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Chosen movie imdbid: %O', ctx.callbackQuery.data);

  const action = JSON.parse(ctx.callbackQuery.data);
  const movies = await getMovieList(ctx);
  let movie;

  switch (action.a) {
    case 'movie':
      if (!movies) {
        logger.error(ctx, 'Attempt to pick a movie from the previous message');
        return await ctx.reply('Something went wrong. Try one more time..');
      }

      movie = movies.results.find(item => item.imdbid === action.p);
      await ctx.editMessageText(`You've chosen movie: ${movie.title}`, getMovieControlMenu(movie));
      break;

    case 'add':
      movie = movies.results.find(item => item.imdbid === action.p);
      const canAddResult = await canAddMovie(ctx, movie);

      if (typeof canAddResult === 'string') {
        await ctx.editMessageText(`${canAddResult} Continue search or /cancel to leave`);
      } else {
        await addMovieForUser(ctx, movie);
        await ctx.editMessageText(
          `Added ${movie.name} to your lib! Continue search or /cancel to leave`
        );
      }

      deleteFromSession(ctx, 'movies');
      break;

    case 'back':
      await ctx.editMessageText(
        "Here's a list of movies that I found for you! Please, choose one or specify your request",
        getMoviesMenu(movies)
      );
      break;

    default:
      logger.error(ctx, `Something has caused to the default case call: action: %O`, action);
      deleteFromSession(ctx, 'movies');
      await ctx.reply('Something went wrong. Try one more time..');
  }
});

export default searcher;
