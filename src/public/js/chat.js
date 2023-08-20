const socketClient = io();

// Envío de mensajes desde el form
document.getElementById('messageForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('user').value;
  const message = document.getElementById('message').value;
  socketClient.emit('chatMessage', { user, message });
  document.getElementById('message').value = '';
});

// Muestra los mensajes al cliente
socketClient.on('chatMessage', (messageData) => {
  const messages = document.getElementById('messages');
  const newMessage = document.createElement('li');
  newMessage.textContent = `${messageData.user}: ${messageData.message}`;
  messages.appendChild(newMessage);
});
