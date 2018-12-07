import { ContextMessageUpdate } from 'telegraf';
import logger from '../../util/logger';

const about = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Opens about section');
  await ctx.reply(
    `Hey! First of all, thanks for using this bot! 
    \nHave you ever had a moments when you see a trailer of cool movie and give yourself a promise to watch it? Then it appears to be 2 or 3 months until the release of this movie and you simply forget about it.. I was in such situation quite a lot of time. That's why this bot exists. 
    \nIt works quite simply - you can search for a movie you would like to watch later and add it to your collection. After that bot will send you a message once you can watch this movie online. Easy? Of course! Easy and powerful!`
  );
};

export default about;
