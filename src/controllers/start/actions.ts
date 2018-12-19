import { ContextMessageUpdate } from 'telegraf';
import { getAccountConfirmKeyboard } from './helpers';
import { sleep } from '../../util/common';
import { updateLanguage } from '../../util/language';

export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
  await updateLanguage(ctx, langData.p);
  const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('scenes.start.new_account'));
  await sleep(3);
  await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);
};
