import { ContextMessageUpdate } from 'telegraf';
import logger from './logger';

const asyncWrapper = (fn: any) => {
  return function(ctx: ContextMessageUpdate, next: any) {
    fn(ctx).catch((error: any) => {
      logger.error(ctx, 'General error, %O', error);
      ctx.reply('An error has occured... Please, try again');
      return next();
    });
  };
};

export default asyncWrapper;
