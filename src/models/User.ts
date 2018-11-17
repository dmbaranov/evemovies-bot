import mongoose, { Document, Schema, mongo } from 'mongoose';
import { IMovie } from './Movie';

export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  observableMovies: IMovie[];
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    username: String,
    name: String,
    observableMovies: [
      {
        type: String,
        ref: 'Movie'
      }
    ]
  },
  { _id: false }
);

UserSchema.pre('find', function() {
  this.populate('observableMovies');
}).pre('findOne', function() {
  this.populate('observableMovies');
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
