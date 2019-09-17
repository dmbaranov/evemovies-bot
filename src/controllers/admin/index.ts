import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { match } from 'telegraf-i18n';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';
import { write, getStats, getHelp } from './helpers';

const { leave } = Stage;
const admin = new Scene('admin');

admin.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters admin scene');
  const { backKeyboard } = getBackKeyboard(ctx);

  await ctx.reply('Welcome to Admin stage', backKeyboard);
});

admin.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves admin scene');
  const { mainKeyboard } = getMainKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

admin.command('saveme', leave());
admin.hears(match('keyboards.back_keyboard.back'), leave());

admin.on('text', async (ctx: ContextMessageUpdate) => {
  const [type, ...params] = ctx.message.text.split(' | ');

  switch (type) {
    case 'write':
      await write(ctx, params[0], params[1]);
      break;
    case 'stats':
      await getStats(ctx);
      break;
    case 'help':
      await getHelp(ctx);
      break;
    default:
      ctx.reply('Command was not specified');
  }
});

export default admin;
