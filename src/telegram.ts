import { Telegram } from 'telegraf';

const telegram = new Telegram(process.env.TELEGRAM_TOKEN, {});
export default telegram;
