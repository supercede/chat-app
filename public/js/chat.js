const increase = document.getElementById('increment');
const msgForm = document.getElementById('message-form');
const locationBtn = document.getElementById('send-location');
const msgInput = document.getElementById('message');
const sendBtn = document.querySelector('.send-btn');
const messages = document.getElementById('messages');
const sidebar = document.getElementById('sidebar');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Parse query string
const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

const autoScroll = () => {
  // last child of the messages element
  const newMessage = messages.lastElementChild;

  //Get height of new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  //height of messages container
  const containerHeight = messages.scrollHeight;

  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on('message', message => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    username: message.name,
    message: message.message,
    createdAt: moment(message.createdAt).format('kk:mm')
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('locationMessage', locationURL => {
  console.log(locationURL);

  const loc = Mustache.render(locationTemplate, {
    username: locationURL.name,
    location: locationURL.url,
    createdAt: moment(message.createdAt).format('kk:mm')
  });

  messages.insertAdjacentHTML('beforeend', loc);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const menu = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  sidebar.innerHTML = menu;
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

socket.emit('join', { name, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
