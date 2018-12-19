import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
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
 * Returns button that user has to click to start working with the bot
 */
export function getAccountConfirmKeyboard(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.start.lets_go'),
          JSON.stringify({ a: 'confirmAccount' }),
          false
        )
      ],
      {}
    )
  );
}
