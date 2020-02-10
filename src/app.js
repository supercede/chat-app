import express from 'express';
import { config } from 'dotenv';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import socketio from 'socket.io';
import Filter from 'bad-words';
import { generateMessage, generatelocationMessage } from './utils/messages';
import {
  getUser,
  getUsersInRoom,
  addUser,
  removeUser
} from './controllers/userController';

config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { NODE_ENV, port } = process.env;

if (NODE_ENV === 'development') {
  app.use(logger('dev'));
}
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

const filter = new Filter();
filter.removeWords('hells', 'sadist', 'nigga');

io.on('connection', socket => {
  console.log('New Connection');

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.name} has joined the room`)
      );

    callback();
  });

  //filter words with acknowlegement
  socket.on('sendMessage', (userMessage, callback) => {
    // if (filter.isProfane(userMessage)) {
    //   return callback('profanity not allowed');
    // }
    const user = getUser(socket.id);
    userMessage = filter.clean(userMessage);
    io.to(user.room).emit('message', generateMessage(user.name, userMessage));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      'locationMessage',
      generatelocationMessage(user.name, latitude, longitude)
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.name} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
