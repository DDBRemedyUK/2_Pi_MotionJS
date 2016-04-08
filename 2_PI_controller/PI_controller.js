var io = require('socket.io-client');
var socket = io.connect('http://10.50.7.32:8080', {reconnect: true}); //Change IP here

socket.emit('pirstatus', false);

var gpio = require("gpio");
var gpio7 = gpio.export(7, {
    direction: "in",
    ready: function() {
        console.log('ready');
    }
});

gpio7.on("change", function(val) {
    console.log(val)
    if (val == 0) {
        socket.emit('pirstatus', false);   
    }
    else{
        socket.emit('pirstatus', true);   
    }
});

//This is my comment