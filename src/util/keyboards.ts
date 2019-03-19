import { Markup, ContextMessageUpdate } from 'telegraf';

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getBackKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back');
  let backKeyboard: any = Markup.keyboard([backKeyboardBack]);

  backKeyboard = backKeyboard.resize().extra();

  return {
    backKeyboard,
    backKeyboardBack
  };
};

/**
 * Returns main keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getMainKeyboard = (ctx: ContextMessageUpdate) => {
  const mainKeyboardSearchMovies = ctx.i18n.t('keyboards.main_keyboard.search');
  const mainKeyboardMyCollection = ctx.i18n.t('keyboards.main_keyboard.movies');
  const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings');
  const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
  const mainKeyboardSupport = ctx.i18n.t('keyboards.main_keyboard.support');
  const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact');
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardSearchMovies, mainKeyboardMyCollection] as any,
    [mainKeyboardSettings, mainKeyboardAbout],
    [mainKeyboardSupport, mainKeyboardContact]
  ]);
  mainKeyboard = mainKeyboard.resize().extra();

  return {
    mainKeyboard,
    mainKeyboardSearchMovies,
    mainKeyboardMyCollection,
    mainKeyboardSettings,
    mainKeyboardAbout,
    mainKeyboardSupport,
    mainKeyboardContact
  };
};
