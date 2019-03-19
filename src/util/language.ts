import { ContextMessageUpdate } from 'telegraf';
import User from '../models/User';
import logger from './logger';
import { saveToSession } from './session';

/**
 * Function that updates language for the current user in all known places
 * @param ctx - telegram context
 * @param newLang - new language
 */
export async function updateLanguage(ctx: ContextMessageUpdate, newLang: 'en' | 'ru') {
  logger.debug(ctx, 'Updating language for user to %s', newLang);
  await User.findOneAndUpdate(
    { _id: ctx.from.id },
    {
      language: newLang
    },
    { new: true }
  );

  saveToSession(ctx, 'language', newLang);

  ctx.i18n.locale(newLang);
}
