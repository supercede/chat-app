import express from 'express';
import { config } from 'dotenv';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import socketio from 'socket.io';

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

const message = 'Welcome';
io.on('connection', socket => {
  console.log('New Connection');

  socket.emit('message', message);
  socket.broadcast.emit('message', 'A new user has joined');

  socket.on('sendMessage', userMessage => {
    io.emit('message', userMessage);
  });

  socket.on('sendLocation', ({ latitude, longitude }) => {
    io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has disconnected');
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
