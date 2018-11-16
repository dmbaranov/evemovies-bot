import { Markup, Extra } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { clearSessionMovies, getMovieControlMenu, getMoviesMenu, getMovieList } from './helpers';

const { leave } = Stage;
const searcher = new Scene('search');
searcher.enter((ctx: any) => ctx.reply('Entered movie search stage...'));
searcher.leave((ctx: any) => ctx.reply('Leaving movie search stage...'));
searcher.command('cancel', leave());

searcher.on('text', async (ctx: any, next: any) => {
  logger.debug(ctx, 'Performing search for: %s', ctx.message.text);

  const movies = await getMovieList(ctx);

  if (!movies) {
    ctx.reply('No movies were found... Try to specify your request or /cancel to stop searching');
    return next();
  }

  ctx.reply(
    "Here's a list of movies that I found for you! Please, choose one or specify your request and try",
    getMoviesMenu(movies)
  );
});

searcher.on('callback_query', async (ctx: any) => {
  logger.debug(ctx, 'Chosen movie imdbid: %o', ctx.callbackQuery.data);

  const action = JSON.parse(ctx.callbackQuery.data);
  const movies = await getMovieList(ctx);
  let movie;

  switch (action.a) {
    case 'movie':
      movie = movies.results.find(item => item.imdbid === action.p);
      ctx.editMessageText(`You've chosen movie: ${movie.name}`, getMovieControlMenu(movie));
      break;

    case 'add':
      movie = movies.results.find(item => item.imdbid === action.p);
      ctx.reply(`Adding ${movie.name} to your lib!`);
      clearSessionMovies(ctx);
      break;

    case 'back':
      ctx.editMessageText(
        "Here's a list of movies that I found for you! Please, choose one or specify your request",
        getMoviesMenu(movies)
      );
      break;

    default:
      logger.error(ctx, `Something has caused to the default case call: action: %o`, action);
      clearSessionMovies(movies);
      ctx.reply('An error has occured.. Please, try again');
  }
});

export default searcher;
