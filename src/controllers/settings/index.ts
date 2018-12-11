import { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getMainKeyboard } from './helpers';
import {
  languageSettingsAction,
  languageChangeAction,
  accountSummaryAction,
  closeAccountSummaryAction
} from './actions';
import { mainKeyboard, backKeyboard, backKeyboardBack } from '../../util/keyboards';
const { leave } = Stage;

const settings = new Scene('settings');

settings.enter(async (ctx: ContextMessageUpdate) => {
  const keyboard = getMainKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('scenes.settings.settings'), keyboard);
  await ctx.reply(ctx.i18n.t('scenes.settings.what_to_change'), backKeyboard);
});

settings.leave(async (ctx: ContextMessageUpdate) => {
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

settings.command('cancel', leave());
settings.hears(backKeyboardBack, leave());

settings.action(/languageSettings/, languageSettingsAction);
settings.action(/languageChange/, languageChangeAction);
settings.action(/accountSummary/, accountSummaryAction);
settings.action(/closeAccountSummary/, closeAccountSummaryAction);

export default settings;
