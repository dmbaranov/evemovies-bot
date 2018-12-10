import { ContextMessageUpdate } from 'telegraf';
import logger from '../../util/logger';

const about = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Opens about section');
  await ctx.reply(ctx.i18n.t('scenes.about.main'));
};

export default about;
