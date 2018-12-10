// Add some general info, like isPremium, language, etc...
import User from '../models/User';

/**
 * Modifies context and add some information about the user
 * @param ctx - telegram context
 * @param next - next function
 */
export const getUserInfo = async (ctx: any, next: Function) => {
  if (!ctx.userInfo || !ctx.userInfo.language) {
    const user = await User.findById(ctx.from.id);

    ctx.userInfo.language = user.language;
  }

  return next();
};
