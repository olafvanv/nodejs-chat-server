const socket = io();

const form = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input .text');
const messages = document.querySelector('.messages-wrapper');

const addMessage = (message, id) => {
  const div = document.createElement('div');
  div.classList.add('message');
  if(id === socket.id) div.classList.add('message--me')


  div.innerText = message;
  messages.appendChild(div);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('chat', chatInput.value);
  chatInput.value = '';
});

socket.on('chat', data => {
  addMessage(data.message, data.id);
});