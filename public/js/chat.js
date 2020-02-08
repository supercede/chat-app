const increase = document.getElementById('increment');
const msgForm = document.getElementById('message-form');
const socket = io();

socket.on('message', message => {
  console.log(message);
});

msgForm.addEventListener('submit', e => {
  e.preventDefault();
  const userMessage = document.getElementById('message').value;

  socket.emit('sendMessage', userMessage);
  document.getElementById('message').value = '';
});
