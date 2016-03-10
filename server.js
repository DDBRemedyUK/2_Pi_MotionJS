var http = require("http");
var express = require("express");
var app = express();
var port = process.env.port || 8080;

var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html')
});

io.sockets.on('connection', function (socket) {
    socket.on('pirstatus', function (data) {
        io.sockets.emit('pirstatus', data);
        console.log('pirstatus', data);
    });
});

console.log("Listening on port " + port);

/*
 * Instructions:
 * 
  Sooooo, the lastest Node and Express versions need to be installed in both Raspberry and PCs in order to get this baby working.
  The Raspberry Pi also needs to have gpio installed via npm in order to get its pins working.
  
  I'd advise just cloning the contents of the SD card of the raspberry in case more than 1 are needed.
  I'm renaming the receiver to index.html as no controller HTML file will be required (all events willl be triggered from a single JS file on the PI)
  
  - Make sure both the PC and the Pi are connected to the same network and identify the PC's IP in order to get connected.
  
  - On the Pi, navigate to the 2_Pi_Controller directory and open the PI_Controller.js file; change the IP on the top for the target device's IP address.
  
  - On the pi, navigate to the directory 2_Pi_Controller directory and input the following text in the console:
    
    node PI_Controller.js
  
    the console should come back with a 'Ready' log and start logging movement straight away.
  
  - The localhost server by navigating to 2_Pi_MotionJS using the command line.
  
  - Startup the server: node server.js
  
    The console should start listening on port 8080.
    
    good to go!
  
 * 
 * */