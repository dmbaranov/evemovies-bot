import { Markup } from 'telegraf';

export const backKeyboardBack = '◀️ Back';
export let backKeyboard: any = Markup.keyboard([backKeyboardBack]);
backKeyboard = backKeyboard.resize().extra();

export const mainKeyboardSearchMovies = '👀 Search';
export const mainKeyboardMyCollection = '🎥 My collection';
export const mainKeyboardSettings = '⚙️ Settings';
export const mainKeyboardAbout = '❓ About';
export let mainKeyboard: any = Markup.keyboard([
  [mainKeyboardSearchMovies, mainKeyboardMyCollection] as any,
  [mainKeyboardSettings, mainKeyboardAbout]
]);
mainKeyboard = mainKeyboard.resize().extra();
