var io = require('socket.io-client');
//var socket = io.connect('http://169.254.9.35:8080', {reconnect: true}); //Change IP here

var socket = io.connect('http://10.50.7.34:8080', {reconnect: true}); //Change IP here

socket.emit('pirstatus', true);//For PIR the value is false

var gpio = require("gpio");

//Define  the GPIO pin here (7 by defaults)
var gpio7 = gpio.export(9, {
    direction: "in",
    ready: function() {
        console.log('ready');
    }
});

gpio7.on("change", function(val) {
    console.log(val)
    if (val == 1) {//For PIR the value is 0
        socket.emit('pirstatus', false);   
    }
    else{
        socket.emit('pirstatus', true);   
    }
});
