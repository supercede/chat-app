const increase = document.getElementById('increment');
const msgForm = document.getElementById('message-form');
const locationBtn = document.getElementById('send-location');
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

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Your browser does not support geolocation');
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
});
