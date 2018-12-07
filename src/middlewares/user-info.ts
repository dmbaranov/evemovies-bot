// Add some general info, like isPremium, language, etc...
import User from '../models/User';
import { saveToSession } from '../util/session';

/**
 * Modifies context and add some information about the user
 * @param ctx - telegram context
 * @param next - next function
 */
export const getUserInfo = async (ctx: any, next: Function) => {
  if (!ctx.session.userInfo || !ctx.session.userInfo.language) {
    const user = await User.findById(ctx.from.id);

    const newUserInfo = {
      ...ctx.session.userInfo,
      language: user.language
    };
    saveToSession(ctx, 'userInfo', newUserInfo);
  }

  return next();
};
