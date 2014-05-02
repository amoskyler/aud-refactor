var socket = io.connect('http://localhost:5000');

window.onload = function(){

    var ownerInfo = document.getElementById("ownerInfo");
    //console.log(roomOwner);
    var requests = document.getElementById("requests");
    socket.emit('subscribe', {room: roomId, roomOwner: roomOwner});
    socket.on('request', function(request){

      html = "new request from #: "+"<br>song request for: "+"<br>";
      requests.innerHTML = requests.innerHTML + html;
      console.log(request);

    });

};

window.onunload = function(){
  socket.disconnect();
};
