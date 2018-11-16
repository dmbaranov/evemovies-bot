import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import db from '../../util/firebase';

const { leave } = Stage;

const movies = new Scene('movies');
movies.enter(async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  // const userSnapshot = await db
  //   .collection('users')
  //   .doc(uid)
  //   .get();
  // const user = userSnapshot.data();
  const observableMovies = await db
    .collection('observableMovies')
    .where('user_id', '==', '128723556')
    .get();

  const moviesRef = db.collection('movies');

  observableMovies.forEach(item => {
    console.log(item.data());
    moviesRef.where('imdbid', '==', item.data().imdbid);
  });

  const movies = await moviesRef.get();
  // movies.forEach(item => console.log(item.data()));

  // const movies = await moviesRef.get();
  // console.log(movies.size);

  // const movies = await db
  //   .collection('movies')
  //   .where('imdbid', '==', user.observableMovies[0])
  //   .get();

  // const allMovies = await db.collection('movies').get();
  // allMovies.forEach(item => console.log(item.data()));

  // console.log(user.observableMovies[0]);
  // console.log(movies.size, movies.empty);
  // movies.forEach(movie => console.log(movie.data()));
  ctx.reply('Entered movies stage...');
});
movies.leave((ctx: any) => ctx.reply('Leaving movies stage...'));
movies.command('cancel', leave());

export default movies;
