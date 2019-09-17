import { Extra, Markup, ContextMessageUpdate } from 'telegraf';
import { get } from 'lodash';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { saveToSession } from '../../util/session';

/**
 * Returns main settings keyboard
 */
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

/**
 * Returns language keyboard
 */
export function getLanguageKeyboard() {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(`English`, JSON.stringify({ a: 'languageChange', p: 'en' }), false),
        m.callbackButton(`Русский`, JSON.stringify({ a: 'languageChange', p: 'ru' }), false)
      ],
      {}
    )
  );
}

/**
 * Returns account summary keyboard
 */
export function getAccountSummaryKeyboard(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.settings.back_button'),
          JSON.stringify({ a: 'closeAccountSummary' }),
          false
        )
      ],
      {}
    )
  );
}

/**
 * Send message and saving it to the session. Later it can be deleted.
 * Used to avoid messages duplication
 * @param ctx - telegram context
 * @param translationKey - translation key
 * @param extra - extra for the message, e.g. keyboard
 */
export async function sendMessageToBeDeletedLater(
  ctx: ContextMessageUpdate,
  translationKey: string,
  extra?: ExtraReplyMessage
) {
  ctx.webhookReply = false;
  const message = await ctx.reply(ctx.i18n.t(translationKey), extra);
  const messagesToDelete = get(ctx.session, 'settingsScene.messagesToDelete', []);

  saveToSession(ctx, 'settingsScene', {
    messagesToDelete: [
      ...messagesToDelete,
      {
        chatId: message.chat.id,
        messageId: message.message_id
      }
    ]
  });
}
