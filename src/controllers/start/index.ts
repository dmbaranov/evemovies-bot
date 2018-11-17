import { Extra, ContextMessageUpdate, Markup } from 'telegraf';
import User, { IUser } from '../../models/User';

const start = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);

  const user = await User.findById(uid);

  if (user) {
    ctx.reply(
      'Glad to see you back! Now you can continue watching after the releases of your favorite movies! What do you want to do now?'
    );
  } else {
    const newUser = new User({
      _id: uid,
      username: ctx.from.username,
      name: ctx.from.first_name + ' ' + ctx.from.last_name
    });

    await newUser.save();
    ctx.reply('Account has been created successfully!');
  }
};

export default start;
