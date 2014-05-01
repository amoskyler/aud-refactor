window.onload = function(){
    var socket = io.connect('http://localhost:5000');
    var ownerInfo = document.getElementById("ownerInfo");

    socket.on('roomId', function (data) {
        stringed = data;
        ownerInfo.innerHTML = data.roomId;
        console.log(data.roomId);
    });


}
