var socket = io.connect('http://localhost:5000');

window.onload = function(){
  socket.emit('subscribe', {room: 'super special admin access'});
}
