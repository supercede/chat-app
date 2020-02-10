import express from 'express';
import { config } from 'dotenv';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import socketio from 'socket.io';
import Filter from 'bad-words';
import { generateMessage, generatelocationMessage } from './utils/messages';

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

  socket.emit('message', generateMessage('Welcome'));
  socket.broadcast.emit('message', generateMessage('A new user has joined'));

  //filter words with acknowlegement
  socket.on('sendMessage', (userMessage, callback) => {
    // if (filter.isProfane(userMessage)) {
    //   return callback('profanity not allowed');
    // }
    userMessage = filter.clean(userMessage);
    io.emit('message', generateMessage(userMessage));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.emit('locationMessage', generatelocationMessage(latitude, longitude));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has disconnected'));
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
