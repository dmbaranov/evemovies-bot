import { Markup } from 'telegraf';

export const backKeyboardBack = '◀️ Back';
export let backKeyboard: any = Markup.keyboard([backKeyboardBack]);
backKeyboard = backKeyboard
  .oneTime()
  .resize()
  .extra();

export const mainKeyboardSearchMovies = '👀 Search';
export const mainKeyboardMyCollection = '🎥 My collection';
export let mainKeyboard: any = Markup.keyboard([
  mainKeyboardSearchMovies,
  mainKeyboardMyCollection
]);
mainKeyboard = mainKeyboard
  .oneTime()
  .resize()
  .extra();
