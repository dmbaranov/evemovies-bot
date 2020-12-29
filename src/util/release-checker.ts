import { ytsReleaseChecker, scarfilmReleaseChecker } from './release-providers';

export interface ICheckerConfig {
  id: string;
  title: string;
  year: number;
}

const russianReleaseCheckers = [scarfilmReleaseChecker];
const englishReleaseCheckers = [ytsReleaseChecker];

type Checker = (config: ICheckerConfig) => Promise<boolean>;

const checkRelease = (checkers: Checker[]) => async (config: ICheckerConfig) => {
  const result = await Promise.all(checkers.map((checker) => checker(config)));

  return result.some((result) => result); // At least 1 checker should return true
};

export const releaseChecker = {
  en: checkRelease(englishReleaseCheckers),
  ru: checkRelease(russianReleaseCheckers)
};
