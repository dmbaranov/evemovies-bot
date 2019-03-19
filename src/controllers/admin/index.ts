import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { match } from 'telegraf-i18n';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';
import telegram from '../../telegram';

const { leave } = Stage;
const admin = new Scene('admin');

admin.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters admin scene');
  const { backKeyboard } = getBackKeyboard(ctx);

  ctx.reply('Welcome to Admin stage', backKeyboard);
});

admin.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves admin scene');
  const { mainKeyboard } = getMainKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

admin.command('saveme', leave());
admin.hears(match('keyboards.back_keyboard.back'), leave());

admin.on('text', async (ctx: ContextMessageUpdate, next: Function) => {
  const [id, message] = ctx.message.text.split(' | ');

  if (!Number.isNaN(+id) && id.length >= 8) {
    try {
      await telegram.sendMessage(Number(id), message);
      await ctx.reply(`Successfully sent message to: ${id}, content: ${message}`);
    } catch (e) {}
  }
});

export default admin;
