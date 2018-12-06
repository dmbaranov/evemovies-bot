import { checkMovieRelease } from './release-checker';
import logger from './logger';
import { sleep } from './common';
import Movie, { IMovie } from '../models/Movie';
import User from '../models/User';
import telegram from '../telegram';

/**
 * Takes all unreleased movies, checks each it it has been released and notifies users who observe this movie.
 */
export async function checkUnreleasedMovies() {
  const unreleasedMovies = await Movie.find({ released: false });

  for (const movie of unreleasedMovies) {
    await sleep(0.5);
    const checkResult = await checkMovieRelease(movie._id);

    if (checkResult) {
      logger.debug(undefined, 'Movie has been released, %O', checkResult);

      await notifyAndUpdateUsers(movie);
      await Movie.findOneAndUpdate(
        {
          _id: movie._id
        },
        {
          released: true
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
    logger.debug(undefined, 'Notifiying user %s about movie %s', user.username, movie.title);

    await sleep(0.5);
    await telegram.sendMessage(user._id, `Movie ${movie.title} has been released!`);
    await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        $pull: { observableMovies: movie._id }
      },
      {
        new: true
      }
    );
  }
}
