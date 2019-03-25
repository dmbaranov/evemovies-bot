import { ytsReleaseChecker, scarabeyReleaseChecker } from './release-providers';

export interface ICheckerConfig {
  imdbid: string;
  title: string;
  year: number;
}

const russianReleaseCheckers = [scarabeyReleaseChecker];
const englishReleaseCheckers = [ytsReleaseChecker];

const checkRelease = (checkers: any[]) => async (config: ICheckerConfig) => {
  const result = await Promise.all(checkers.map(checker => checker(config)));

  return result.some(result => result); // At least 1 checker should return true
};

export const releaseChecker = {
  en: checkRelease(englishReleaseCheckers),
  ru: checkRelease(russianReleaseCheckers)
} as any;
