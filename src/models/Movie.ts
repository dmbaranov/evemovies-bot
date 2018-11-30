import mongoose, { Document, Schema, mongo } from 'mongoose';

export interface IMovie extends Document {
  _id: string;
  title: string;
  year: number;
  released: boolean;
}

export const MovieSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    year: Number,
    released: Boolean
  },
  { _id: false }
);

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
export default Movie;
