var socket = io.connect('http://localhost:5000');

window.onload = function(){

    var ownerInfo = document.getElementById("ownerInfo");
    var requests = document.getElementById("requests");

    //socket.emit('subscribe', {room: "rdio-room1"});
    socket.emit('pleasework', {dammitIreallymeanit: "please work"});
    socket.on('roomId', function (data) {
        console.log(Math.random());
    });

    socket.on('request', function(request){
      html = "new request from #: "+"<br>song request for: "+"<br>";
      requests.innerHTML = requests.innerHTML + html;
      console.log(request);
    });
};


window.onbeforeunload = function(){

    socket.emit("unsubscribe", {room: "global"});
    socket.disconnect();
};
