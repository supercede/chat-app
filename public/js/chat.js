const increase = document.getElementById('increment');
const msgForm = document.getElementById('message-form');
const locationBtn = document.getElementById('send-location');
const msgInput = document.getElementById('message');
const sendBtn = document.querySelector('.send-btn');
const messages = document.getElementById('messages');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

const socket = io();

socket.on('message', message => {
  const html = Mustache.render(messageTemplate, {
    message
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', locationURL => {
  const loc = Mustache.render(locationTemplate, {
    location: locationURL
  });

  messages.insertAdjacentHTML('beforeend', loc);
});

msgForm.addEventListener('submit', e => {
  e.preventDefault();

  sendBtn.setAttribute('disabled', 'disabled');

  const userMessage = msgInput.value;

  socket.emit('sendMessage', userMessage, err => {
    sendBtn.removeAttribute('disabled');
    msgInput.value = '';
    msgInput.focus();
    if (err) {
      return console.log(err);
    }
    console.log(`Message delivered`);
  });
});

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Your browser does not support geolocation');
  }
  locationBtn.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        locationBtn.removeAttribute('disabled');
        console.log('You shared your location');
      }
    );
  });
});
