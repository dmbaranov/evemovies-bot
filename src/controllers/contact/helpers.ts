import { ContextMessageUpdate } from 'telegraf';
import telegram from '../../telegram';

/**
 * Sends a message to the admin
 * @param ctx - telegram context
 */
export async function sendMessage(ctx: ContextMessageUpdate) {
  const msg = `From: ${JSON.stringify(ctx.from)}.\n\nMessage: ${ctx.message.text}`;

  await telegram.sendMessage(process.env.ADMIN_ID, msg);
}
