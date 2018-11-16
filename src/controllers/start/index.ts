import { Extra, ContextMessageUpdate, Markup } from 'telegraf';
import db from '../../util/firebase';

const start = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const userRef = db.collection('users').doc(uid);
  const user = await userRef.get();

  if (user.exists) {
    ctx.reply(
      'Glad to see you back! Now you can continue watching after the releases of your favorite movies! What do you want to do now?'
    );
  } else {
    await userRef.set({
      name: ctx.from.first_name + ctx.from.last_name,
      id: ctx.from.id
    });
  }
};

export default start;
