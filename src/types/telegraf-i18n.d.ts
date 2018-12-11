import { I18n } from 'telegraf-i18n';

declare module 'telegraf-i18n' {
  interface I18n {
    locale(languageCode: string): void;
  }

  export function match(resourceKey: string, templateData?: any): string;
}
