import { checkMovieRelease, releaseChecker } from './release-checker';
import logger from './logger';
import { sleep } from './common';
import Movie, { IMovie } from '../models/Movie';
import User from '../models/User';
import telegram from '../telegram';

// TODO: improve
type lang = 'en' | 'ru';

/**
 * Takes all unreleased movies, checks each it it has been released and notifies users who observe this movie.
 */
export async function checkUnreleasedMovies() {
  const unreleasedMovies = await Movie.find({
    'unreleasedLanguages.0': { $exists: true }
  });

  for (const movie of unreleasedMovies) {
    for (const language of movie.unreleasedLanguages) {
      await sleep(0.5);
      const checkResult = await releaseChecker[language as lang]({
        imdbid: movie._id,
        title: movie.title,
        year: movie.year
      });

      if (checkResult) {
        logger.debug(undefined, 'Movie has been released, %O, language %s', movie, language);
        await notifyAndUpdateUsers(movie, language);
        await Movie.findOneAndUpdate(
          {
            _id: movie._id
          },
          {
            $pull: { unreleasedLanguages: language }
          },
          {
            new: true
          }
        );
      }
    }
  }
}

/**
 * Find all users who observes a movie, notify them and remove movie from observables array
 * @param movie - single movie
 */
async function notifyAndUpdateUsers(movie: IMovie, language: string) {
  const usersToNotify = await User.find({
    observableMovies: movie._id,
    language
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
