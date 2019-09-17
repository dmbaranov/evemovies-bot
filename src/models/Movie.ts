import mongoose, { Document } from 'mongoose';

export interface IMovie extends Document {
  _id: string;
  title: string;
  year: number;
  posterUrl: string;
  language: string;
  released: boolean;
}

export const MovieSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    year: Number,
    posterUrl: String,
    language: String,
    released: Boolean
  },
  { _id: false }
);

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
export default Movie;
