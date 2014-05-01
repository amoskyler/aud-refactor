

window.onload = function(){

    var ownerInfo = document.getElementById("ownerInfo");
    var requests = document.getElementById("requests");
    var roomId = document.getElementById("roomCode");
    console.log(roomId.innerHTML)
    //socket.emit('subscribe', {room: roomId.innerHTML});
    //console.log(roomOwner);

};


window.onbeforeunload = function(){;
    //socket.disconnect();
};
