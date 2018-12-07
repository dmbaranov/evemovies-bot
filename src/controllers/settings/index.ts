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
  const keyboard = getMainKeyboard();

  await ctx.reply('Settings', keyboard);
  await ctx.reply('What do you want to change?', backKeyboard);
});

settings.leave(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('Hey, what are you up tp?', mainKeyboard);
});

settings.command('cancel', leave());
settings.hears(backKeyboardBack, leave());

settings.action(/languageSettings/, languageSettingsAction);
settings.action(/languageChange/, languageChangeAction);
settings.action(/accountSummary/, accountSummaryAction);
settings.action(/closeAccountSummary/, closeAccountSummaryAction);

export default settings;
