import { ContextMessageUpdate } from 'telegraf';

/**
 * Checks whether user is admin and can access restricted areas
 * @param ctx - telegram context
 * @param next - next function
 */
export const isAdmin = async (ctx: ContextMessageUpdate, next: Function) => {
  if (ctx.from.id === +process.env.ADMIN_ID) {
    return next();
  }

  return ctx.reply('Sorry, you are not an admin :(');
};
