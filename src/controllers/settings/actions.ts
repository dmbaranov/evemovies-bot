import { ContextMessageUpdate } from 'telegraf';
import {
  getMainKeyboard,
  getLanguageKeyboard,
  getAccountSummaryKeyboard,
  sendMessageToBeDeletedLater
} from './helpers';
import logger from '../../util/logger';
import User from '../../models/User';
import { updateLanguage } from '../../util/language';
import { getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';

export const languageSettingsAction = async (ctx: ContextMessageUpdate) =>
  await ctx.editMessageText(ctx.i18n.t('scenes.settings.pick_language'), getLanguageKeyboard());

export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateLanguage(ctx, langData.p);
  const { backKeyboard } = getBackKeyboard(ctx);

  for (const msg of ctx.session.settingsScene.messagesToDelete) {
    await ctx.telegram.deleteMessage(msg.chatId, msg.messageId);
  }
  deleteFromSession(ctx, 'settingsScene');
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.language_changed', getMainKeyboard(ctx));
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.what_to_change', backKeyboard);
};

export const accountSummaryAction = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Checking account summary');
  const user = await User.findById(ctx.from.id);

  await ctx.editMessageText(
    ctx.i18n.t('scenes.settings.account_summary', {
      username: user.username,
      id: user._id,
      totalMovies: user.totalMovies,
      version: process.env.npm_package_version
    }),
    getAccountSummaryKeyboard(ctx)
  );
  await ctx.answerCbQuery();
};

export const closeAccountSummaryAction = async (ctx: ContextMessageUpdate) => {
  await ctx.editMessageText(ctx.i18n.t('scenes.settings.what_to_change'), getMainKeyboard(ctx));
  await ctx.answerCbQuery();
};
