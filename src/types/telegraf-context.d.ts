import * as Telegraf from 'telegraf';
import { I18n } from 'telegraf-i18n';

interface IUserInfo {
  language: 'en' | 'ru';
}

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    userInfo: IUserInfo;
    scene: any;
    session: any;
    movie: any;
  }
}
