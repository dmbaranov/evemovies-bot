import * as Telegraf from 'telegraf';
import { I18n } from 'telegraf-i18n';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    session: any;
    movie: any;
  }
}
