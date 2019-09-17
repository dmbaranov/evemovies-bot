import { releaseChecker } from './release-checker';
import logger from './logger';
import { sleep } from './common';
import Movie, { IMovie } from '../models/Movie';
import User from '../models/User';
import telegram from '../telegram';

/**
 * Takes all unreleased movies, checks each it it has been released and notifies users who observe this movie.
 */
export async function checkUnreleasedMovies() {
  logger.debug(undefined, 'Starting to check unreleased movies');

  const unreleasedMovies = await Movie.find({ released: false });

  for (const movie of unreleasedMovies) {
    await sleep(0.5);
    const checkResult = await releaseChecker[movie.language as 'en' | 'ru']({
      id: movie._id,
      title: movie.title,
      year: movie.year
    });

    if (checkResult) {
      logger.debug(undefined, 'Movie has been released, %O', movie);
      await notifyAndUpdateUsers(movie);
      await Movie.findOneAndUpdate(
        {
          _id: movie._id
        },
        {
          released: false
        },
        {
          new: true
        }
      );
    }
  }
}

/**
 * Find all users who observes a movie, notify them and remove movie from observables array
 * @param movie - single movie
 */
async function notifyAndUpdateUsers(movie: IMovie) {
  const usersToNotify = await User.find({
    observableMovies: movie._id
  });

  for (const user of usersToNotify) {
    logger.debug(undefined, 'Notifying user %s about movie %s', user.username, movie.title);
    // TODO: move text to translations
    const message =
      user.language === 'en'
        ? `🎉 Movie ${movie.title} has been released!`
        : `🎉 Фильм ${movie.title} вышел и доступен на торрентах!`;

    await sleep(0.5);

    try {
      await telegram.sendMessage(user._id, message);
    } catch (e) {
      logger.error(undefined, "Can't notify user about released movie, reason: %O", e);
    } finally {
      // TODO: check if user blocked the bot and delete him from the DB
      await User.findOneAndUpdate(
        {
          _id: user._id
        },
        {
          $pull: { observableMovies: movie._id },
          $inc: { totalMovies: 1 }
        },
        {
          new: true
        }
      );
    }
  }
}
