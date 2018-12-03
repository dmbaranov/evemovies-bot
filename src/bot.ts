require('dotenv').config();
require('./models');
import Telegraf from 'telegraf';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import mongoose from 'mongoose';

import logger from './util/logger';
import start from './controllers/start';
import searchScene from './controllers/search';
import moviesScene from './controllers/movies';
import { checkUnreleasedMovies } from './util/notifier';
import asyncWrapper from './util/error-handler';

mongoose.connect(
  `mongodb://localhost:27017/torrent-bot`,
  { useNewUrlParser: true, useFindAndModify: false }
);
mongoose.connection.on('error', err => {
  logger.error(
    undefined,
    `Error occured during an attempt to establish connection with the database: %O`,
    err
  );
  process.exit(1);
});

mongoose.connection.on('open', () => {
  logger.debug(undefined, 'Starting a bot');

  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  const stage = new Stage([searchScene, moviesScene]);

  bot.use(session());
  bot.use(stage.middleware());

  bot.start(start);
  bot.command('search', asyncWrapper((ctx: any) => ctx.scene.enter('search')));
  bot.command('movies', asyncWrapper((ctx: any) => ctx.scene.enter('movies')));
  bot.startPolling();

  setInterval(checkUnreleasedMovies, 86400000);
});
