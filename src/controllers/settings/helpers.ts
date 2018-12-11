import { Extra, Markup, ContextMessageUpdate } from 'telegraf';

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
