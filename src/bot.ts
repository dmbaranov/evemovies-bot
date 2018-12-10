require('dotenv').config();
require('./models');
import fs from 'fs';
import path from 'path';
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import mongoose from 'mongoose';
import rp from 'request-promise';
import logger from './util/logger';
import start from './controllers/start';
import about from './controllers/about';
import searchScene from './controllers/search';
import moviesScene from './controllers/movies';
import settingsScene from './controllers/settings';
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
import { updateUserTimestamp } from './middlewares/update-user-timestamp';
import { getUserInfo } from './middlewares/user-info';

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
  const stage = new Stage([searchScene, moviesScene, settingsScene]);
  const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session'
  });

  (bot.context as any).userInfo = {
    language: 'en'
  };

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(stage.middleware());
  bot.use(getUserInfo);

  bot.start(start);
  bot.hears(
    mainKeyboardSearchMovies,
    updateUserTimestamp,
    asyncWrapper(async (ctx: any) => await ctx.scene.enter('search'))
  );
  bot.hears(
    mainKeyboardMyCollection,
    updateUserTimestamp,
    asyncWrapper(async (ctx: any) => await ctx.scene.enter('movies'))
  );
  bot.hears(
    mainKeyboardSettings,
    updateUserTimestamp,
    asyncWrapper(async (ctx: any) => await ctx.scene.enter('settings'))
  );
  bot.hears(mainKeyboardAbout, updateUserTimestamp, asyncWrapper(about));
  bot.hears(
    backKeyboardBack,
    asyncWrapper(async (ctx: any) => {
      // If this method was triggered, it means that bot was updated when user was not in the main menu..
      logger.debug(ctx, 'Return to the main menu with the back button');
      await ctx.reply('Hey, what are you up to?', mainKeyboard);
    })
  );

  bot.catch((error: any) => {
    logger.debug(undefined, 'Global error has happened, %O', error);
  });

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
