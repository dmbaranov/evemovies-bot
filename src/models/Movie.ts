import mongoose, { Document, Schema, mongo } from 'mongoose';

export interface IMovie extends Document {
  _id: string;
  title: string;
  year: number;
}

export const MovieSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    year: Number
  },
  { _id: false }
);

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
export default Movie;
