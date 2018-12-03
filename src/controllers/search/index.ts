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

const { leave } = Stage;
const searcher = new Scene('search');
searcher.enter((ctx: ContextMessageUpdate) =>
  ctx.reply(
    'Here you can search for movies! Just type the title in and hit enter. Or /cancel to return'
  )
);
searcher.leave((ctx: ContextMessageUpdate) => {
  deleteFromSession(ctx, 'movies');
  ctx.reply(
    'Hey, what are you up to? Try /search to find new movies or /movies to check your own list!'
  );
});
searcher.command('cancel', leave());

searcher.on('text', async (ctx: ContextMessageUpdate, next: any) => {
  logger.debug(ctx, 'Performing search for: %s', ctx.message.text);

  deleteFromSession(ctx, 'movies');
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

searcher.on('callback_query', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Chosen movie imdbid: %o', ctx.callbackQuery.data);

  const action = JSON.parse(ctx.callbackQuery.data);
  const movies = await getMovieList(ctx);
  let movie;

  switch (action.a) {
    case 'movie':
      movie = movies.results.find(item => item.imdbid === action.p);
      ctx.editMessageText(`You've chosen movie: ${movie.title}`, getMovieControlMenu(movie));
      break;

    case 'add':
      movie = movies.results.find(item => item.imdbid === action.p);
      const canAddResult = await canAddMovie(ctx, movie);

      if (typeof canAddResult === 'string') {
        ctx.editMessageText(`${canAddResult} Continue search or /cancel to leave`);
      } else {
        await addMovieForUser(ctx, movie);
        ctx.editMessageText(`Added ${movie.name} to your lib! Continue search or /cancel to leave`);
      }

      deleteFromSession(ctx, 'movies');
      break;

    case 'back':
      ctx.editMessageText(
        "Here's a list of movies that I found for you! Please, choose one or specify your request",
        getMoviesMenu(movies)
      );
      break;

    default:
      logger.error(ctx, `Something has caused to the default case call: action: %o`, action);
      deleteFromSession(ctx, 'movies');
      ctx.reply('An error has occured.. Please, try again');
  }
});

export default searcher;
