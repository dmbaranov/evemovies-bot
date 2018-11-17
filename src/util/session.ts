import logger from './logger';

type SessionDataField = 'movies';

/**
 * Saving data to the session
 * @param ctx - telegram context
 * @param field - field to store in
 * @param data - data to store
 */
export function saveToSession(ctx: any, field: SessionDataField, data: any) {
  logger.debug(ctx, 'Saving %s to session', field);
  ctx.session[field] = data;
}

/**
 * Removing data from the session
 * @param ctx - telegram context
 */
export function deleteFromSession(ctx: any, field: SessionDataField) {
  logger.debug(ctx, 'Deleting %s from session', field);
  delete ctx.session[field];
}
