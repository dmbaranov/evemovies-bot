import { ContextMessageUpdate } from 'telegraf';
import logger from '../../util/logger';
import User from '../../models/User';
import { mainKeyboard } from '../../util/keyboards';

const start = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);

  const user = await User.findById(uid);

  if (user) {
    ctx.reply(
      'Glad to see you back! Now you can continue watching after the releases of your favorite movies! What do you want to do now?',
      mainKeyboard
    );
  } else {
    logger.debug(ctx, 'New user has been created');
    const newUser = new User({
      _id: uid,
      username: ctx.from.username,
      name: ctx.from.first_name + ' ' + ctx.from.last_name
    });

    await newUser.save();
    ctx.reply(
      'Account has been created successfully! Choose what you want to do next',
      mainKeyboard
    );
  }
};

export default start;
