import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { sendMessage } from './helpers';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const contact = new Scene('contact');

contact.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters contact scene');

  const { backKeyboard } = getBackKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('scenes.contact.write_to_the_creator'), backKeyboard);
});

contact.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves contact scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

contact.command('saveme', leave());
contact.hears(match('keyboards.back_keyboard.back'), leave());

contact.on('text', async (ctx: ContextMessageUpdate) => {
  await sendMessage(ctx);
  await ctx.reply(ctx.i18n.t('scenes.contact.message_delivered'));
});

export default contact;
