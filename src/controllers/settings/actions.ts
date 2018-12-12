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

export const languageSettingsAction = async (ctx: ContextMessageUpdate) => {
  const keyboard = getLanguageKeyboard();
  await ctx.editMessageText(ctx.i18n.t('scenes.settings.pick_language'), keyboard);
};

export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Language was changed');
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateLanguage(ctx, langData.p);
  const keyboard = getMainKeyboard(ctx);
  const { backKeyboard } = getBackKeyboard(ctx);

  for (const msg of ctx.session.settingsScene.messagesToDelete) {
    await ctx.telegram.deleteMessage(msg.chatId, msg.messageId);
  }
  deleteFromSession(ctx, 'settingsScene');
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.language_changed', keyboard);
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.what_to_change', backKeyboard);
};

export const accountSummaryAction = async (ctx: ContextMessageUpdate) => {
  const user = await User.findById(ctx.from.id);
  const keyboard = getAccountSummaryKeyboard(ctx);

  await ctx.editMessageText(
    ctx.i18n.t('scenes.settings.account_summary', {
      username: user.username,
      id: user._id
    }),
    keyboard
  );
};

export const closeAccountSummaryAction = async (ctx: ContextMessageUpdate) => {
  const keyboard = getMainKeyboard(ctx);
  await ctx.editMessageText(ctx.i18n.t('scenes.settings.what_to_change'), keyboard);
};
