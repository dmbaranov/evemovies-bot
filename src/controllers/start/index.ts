import { ContextMessageUpdate } from 'telegraf';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';

const start = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findById(uid);
  const { mainKeyboard } = getMainKeyboard(ctx);

  if (user) {
    await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
  } else {
    logger.debug(ctx, 'New user has been created');
    const newUser = new User({
      _id: uid,
      username: ctx.from.username,
      name: ctx.from.first_name + ' ' + ctx.from.last_name
    });

    await newUser.save();
    await ctx.reply(ctx.i18n.t('scenes.start.new_account'), mainKeyboard);
  }
};

export default start;
