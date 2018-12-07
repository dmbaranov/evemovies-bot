import { ContextMessageUpdate } from 'telegraf';
import { getMainKeyboard, getLanguageKeyboard, getAccountSummaryKeyboard } from './helpers';
import logger from '../../util/logger';
import User from '../../models/User';
import { updateLanguage } from '../../util/language';

export const languageSettingsAction = async (ctx: ContextMessageUpdate) => {
  const keyboard = getLanguageKeyboard();
  await ctx.editMessageText(
    'Pick language ❗️Movies will be tracked for the same language❗️',
    keyboard
  );
};

export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Language was changed');
  const keyboard = getMainKeyboard();
  const langData = JSON.parse(ctx.callbackQuery.data);

  await updateLanguage(ctx, langData.p);
  await ctx.editMessageText('What do you want to change?', keyboard);
};

export const accountSummaryAction = async (ctx: ContextMessageUpdate) => {
  const user = await User.findById(ctx.from.id);
  const keyboard = getAccountSummaryKeyboard();

  await ctx.editMessageText(
    `Your account summary: \n\nUsername: ${user.username}\nID: ${user._id}`,
    keyboard
  );
};

export const closeAccountSummaryAction = async (ctx: ContextMessageUpdate) => {
  const keyboard = getMainKeyboard();
  await ctx.editMessageText('What do you want to change?', keyboard);
};
