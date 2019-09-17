import { ContextMessageUpdate } from 'telegraf';
import User from '../../models/User';
import telegram from '../../telegram';

/**
 * Write message to a specific user or to all existing users
 * @param ctx - telegram context
 * @param recipient - id or 'all.language'
 * @param message - text to write
 */
export async function write(ctx: ContextMessageUpdate, recipient: string, message: string) {
  if (!Number.isNaN(+recipient) && recipient.length >= 6) {
    // Write to a single user
    await telegram.sendMessage(Number(recipient), message);
    await ctx.reply(`Successfully sent message to: ${recipient}, content: ${message}`);
  } else if (recipient.includes('all')) {
    // Write to everyone
    const SUPPORTED_LANGUAGES = ['en', 'ru'];
    const language = recipient.split('.')[1];

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      await ctx.reply(`Unsupported language ${language}`);
      return;
    }

    const users = await User.find({ language }); // Filter by language

    users.forEach((user, index) => {
      setTimeout(() => {
        telegram.sendMessage(Number(user._id), message);
      }, 200 * (index + 1));
    });

    await ctx.reply(`Sending message to everyone is in process, content: ${message}`);
  } else {
    // Recipient wasn't specified correctly
    await ctx.reply(
      'No messages were sent. Please make sure that the command parameters are correct'
    );
  }
}

/**
 * Get users statistics
 * @param ctx - telegram context
 */
export async function getStats(ctx: ContextMessageUpdate) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const epochTime = new Date(year, month, day).getTime();

  const allUsers = await User.count({});
  const createdToday = await User.find({ created: { $gte: epochTime } }).count();
  const activeToday = await User.find({ lastActivity: { $gte: epochTime } }).count();
  await ctx.reply(
    `Amount of users: ${allUsers}\n` +
      `New users: ${createdToday}\n` +
      `Active users: ${activeToday}`
  );
}

/**
 * Display help menu
 * @param ctx - telegram context
 */
export async function getHelp(ctx: ContextMessageUpdate) {
  await ctx.reply(
    'write | [user_id | all] | message - write message to user\n' +
      'stats - get stats about users\n' +
      'help - get help menu'
  );
}
