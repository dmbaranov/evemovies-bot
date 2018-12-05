require('dotenv').config();
require('./models');
import fs from 'fs';
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import mongoose from 'mongoose';
import rp from 'request-promise';

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
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  const stage = new Stage([searchScene, moviesScene]);

  bot.use(session());
  bot.use(stage.middleware());

  bot.start(start);
  bot.command('search', asyncWrapper((ctx: any) => ctx.scene.enter('search')));
  bot.command('movies', asyncWrapper((ctx: any) => ctx.scene.enter('movies')));

  setInterval(checkUnreleasedMovies, 86400000);

  process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot);
});

function startDevMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in development mode');

  rp(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteWebhook`).then(() =>
    bot.startPolling()
  );
}

function startProdMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in production mode');
  const tlsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/dmbaranov.io/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dmbaranov.io/fullchain.pem')
  };

  bot.telegram.setWebhook(`https://dmbaranov.io:8443/${process.env.TELEGRAM_TOKEN}`, {
    source: 'cert.pem'
  });

  bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, 8443);
}
