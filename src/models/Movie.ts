import mongoose, { Document } from 'mongoose';

export interface IMovie extends Document {
  _id: string;
  title: string;
  year: number;
  unreleasedLanguages: string[];
}

export const MovieSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    year: Number,
    released: Boolean,
    unreleasedLanguages: [String] // TODO: change to a string value instead of array. Because changed from popcorntime to filmopotok, each movie will be checked separately for different languages
  },
  { _id: false }
);

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
export default Movie;
