import { ContextMessageUpdate } from 'telegraf';
import User from '../models/User';

export const updateUserTimestamp = async (ctx: ContextMessageUpdate, next: Function) => {
  await User.findOneAndUpdate({ _id: ctx.from.id }, { lastActivity: new Date() }, { new: true });
  return next();
};
