import { Extra, Markup } from 'telegraf';

/**
 * Returns main settings keyboard
 */
export function getMainKeyboard() {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(`🗣 Language`, JSON.stringify({ a: 'languageSettings' }), false),
        m.callbackButton(`🔑 Account summary`, JSON.stringify({ a: 'accountSummary' }), false)
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
        m.callbackButton(`🇺🇸 English`, JSON.stringify({ a: 'languageChange', p: 'en' }), false),
        m.callbackButton(`🇷🇺 Русский`, JSON.stringify({ a: 'languageChange', p: 'ru' }), false)
      ],
      {}
    )
  );
}

/**
 * Returns account summary keyboard
 */
export function getAccountSummaryKeyboard() {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [m.callbackButton(`Back`, JSON.stringify({ a: 'closeAccountSummary' }), false)],
      {}
    )
  );
}
