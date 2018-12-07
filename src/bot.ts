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
import {
  backKeyboardBack,
  mainKeyboardSearchMovies,
  mainKeyboardMyCollection,
  mainKeyboardSettings,
  mainKeyboardAbout,
  mainKeyboard
} from './util/keyboards';

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
  bot.hears(
    mainKeyboardSearchMovies,
    asyncWrapper(async (ctx: any) => await ctx.scene.enter('search'))
  );
  bot.hears(
    mainKeyboardMyCollection,
    asyncWrapper(async (ctx: any) => await ctx.scene.enter('movies'))
  );
  bot.hears(
    mainKeyboardSettings,
    asyncWrapper(async (ctx: any) => {
      await ctx.reply('To be implemented...');
    })
  );
  bot.hears(
    mainKeyboardAbout,
    asyncWrapper(async (ctx: any) => {
      logger.debug(ctx, 'Opens about section');
      await ctx.reply(
        `Hey! First of all, thanks for using this bot! 
        \nHave you ever had a moments when you see a trailer of cool movie and give yourself a promise to watch it? Then it appears to be 2 or 3 months until the release of this movie and you simply forget about it.. I was in such situation quite a lot of time. That's why this bot exists. 
        \nIt works quite simply - you can search for a movie you would like to watch later and add it to your collection. After that bot will send you a message once you can watch this movie online. Easy? Of course! Easy and powerful!`
      );
    })
  );
  bot.hears(
    backKeyboardBack,
    asyncWrapper(async (ctx: any) => {
      // If this method was triggered, it means that bot was updated when user was not in the main menu..
      logger.debug(ctx, 'Return to the main menu with the back button');
      await ctx.reply('Hey, what are you up to?', mainKeyboard);
    })
  );

  setInterval(checkUnreleasedMovies, 86400000);

  process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot);
});

function startDevMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in development mode');

  rp(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteWebhook`).then(() =>
    bot.startPolling()
  );
}

async function startProdMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in production mode');
  const tlsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/dmbaranov.io/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dmbaranov.io/fullchain.pem')
  };

  await bot.telegram.setWebhook(`https://dmbaranov.io:8443/${process.env.TELEGRAM_TOKEN}`, {
    source: 'cert.pem'
  });

  bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, 8443);
}
