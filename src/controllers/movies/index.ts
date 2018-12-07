import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { IMovie } from '../../models/Movie';
import User from '../../models/User';
import logger from '../../util/logger';
import { saveToSession, deleteFromSession } from '../../util/session';
import { backKeyboard, backKeyboardBack, mainKeyboard } from '../../util/keyboards';
import { getMoviesMenu, getMovieControlMenu, deleteMovieFromObservables } from './helpers';

const { leave } = Stage;
const movies = new Scene('movies');

movies.enter(async (ctx: ContextMessageUpdate) => {
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

movies.on('callback_query', async (ctx: any) => {
  const action = JSON.parse(ctx.callbackQuery.data);
  const movies: IMovie[] = ctx.session.movies;
  let movie: IMovie;

  switch (action.a) {
    case 'movie':
      movie = movies.find(item => item._id === action.p);
      await ctx.editMessageText(`You've chosen movie: ${movie.title}`, getMovieControlMenu(movie));
      break;
    case 'back':
      await ctx.editMessageText('This is list of your movies', getMoviesMenu(movies));
      break;
    case 'delete':
      movie = movies.find(item => item._id === action.p);
      const updatedMovieList = await deleteMovieFromObservables(ctx, movie._id);
      await ctx.editMessageText('This is list of your movies', getMoviesMenu(updatedMovieList));
      break;
    default:
      logger.error(ctx, `Something has caused to the default case call: action: %O`, action);
      deleteFromSession(ctx, 'movies');
      await ctx.reply('An error has occured.. Please, try again');
  }
});

export default movies;
