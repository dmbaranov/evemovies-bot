import { Extra, Markup, ContextMessageUpdate } from 'telegraf';
import User from '../../models/User';
import telegram from '../../telegram';

export function getMainKeyboard(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.settings.language_button'),
          JSON.stringify({ a: 'languageSettings' }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.settings.account_summary_button'),
          JSON.stringify({ a: 'accountSummary' }),
          false
        )
      ],
      {}
    )
  );
}

export async function write(ctx: ContextMessageUpdate, user: string, message: string) {
  if (!Number.isNaN(+user) && user.length >= 8) {
    // Write to a single user
    await telegram.sendMessage(Number(user), message);
    await ctx.reply(`Successfully sent message to: ${user}, content: ${message}`);
  } else if (user === 'all') {
    // Write to everyone
    const users = await User.find();

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

export async function getHelp(ctx: ContextMessageUpdate) {
  await ctx.reply(
    'write | [user_id | all] | message - write message to user\n' +
      'stats - get stats about users\n' +
      'help - get help menu'
  );
}
