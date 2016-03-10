window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:8080');
    var status = document.getElementById("status");

    socket.on("connect", function () {  
        console.log("Connected!");
    });

    socket.on('pirstatus', function (data) {
        if(data) {
            status.innerHTML = "Motion detected";
            document.body.style.backgroundColor = "green";
        }
        else{
            status.innerHTML = "Awaiting motion";
            document.body.style.backgroundColor = "red";
        }
    });
}