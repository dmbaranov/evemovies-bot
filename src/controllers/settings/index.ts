import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getMainKeyboard as getSettingsMainKeyboard, sendMessageToBeDeletedLater } from './helpers';
import {
  languageSettingsAction,
  languageChangeAction,
  accountSummaryAction,
  closeAccountSummaryAction
} from './actions';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';

const { leave } = Stage;
const settings = new Scene('settings');

settings.enter(async (ctx: ContextMessageUpdate) => {
  const keyboard = getSettingsMainKeyboard(ctx);
  const { backKeyboard } = getBackKeyboard(ctx);

  deleteFromSession(ctx, 'settingsScene');
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.what_to_change', keyboard);
  await sendMessageToBeDeletedLater(ctx, 'scenes.settings.settings', backKeyboard);
});

settings.leave(async (ctx: ContextMessageUpdate) => {
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  deleteFromSession(ctx, 'settingsScene');
});

settings.command('cancel', leave());
settings.hears(match('keyboards.back_keyboard.back'), leave());

settings.action(/languageSettings/, languageSettingsAction);
settings.action(/languageChange/, languageChangeAction);
settings.action(/accountSummary/, accountSummaryAction);
settings.action(/closeAccountSummary/, closeAccountSummaryAction);

export default settings;
