import { ContextMessageUpdate } from 'telegraf';
import logger from './logger';

/**
 * Wrapper to catch async errors within a stage. Helps to avoid try catch blocks in there
 * @param fn - function to enter a stage
 */
const asyncWrapper = (fn: any) => {
  return async function(ctx: ContextMessageUpdate, next: any) {
    try {
      await fn(ctx);
    } catch (error) {
      logger.error(ctx, 'General error, %O', error);
      ctx.reply('An error has occured... Please, try again');
      return next();
    }
  };
};

export default asyncWrapper;
