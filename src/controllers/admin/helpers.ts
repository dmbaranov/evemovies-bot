import { Extra, Markup, ContextMessageUpdate } from 'telegraf';

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
