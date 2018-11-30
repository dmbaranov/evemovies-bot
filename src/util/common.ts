/**
 * Pauses execution for given amount of seconds
 * @param sec - amount of seconds
 */
export function sleep(sec: number) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
