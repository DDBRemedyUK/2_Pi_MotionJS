window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:8080');
    var status = document.getElementById("status");

    socket.on("connect", function () {  
        console.log("Connected!");
    });

    //VIDEO FUNCTIONS DEFINED HERE
    //NOTE: store the needed video frame times in variables, use those across the script
    //NOTE: video ID's set in variables too
    var video = $('video');
    var video_screenSaver = $('#screensaver');

    //Variable to establish which profile to load
    var profiletoLoad; 

    video.each(function(){
        var vidID = $(this).attr('id');

        $(this).on('loadedmetadata', function(){
            console.log(vidID + ' total playtime ' + this.duration);
        });
    });

    //Just for testing, log time counter of screensaver loop
    video_screenSaver.on('timeupdate', function(event){
        onTrackedVideoFrame(this.currentTime);
        //Define function to be excecuted depending on frame
        if (this.currentTime >= 1.000 && this.currentTime <= 5.000) {
            console.log('go to profile 1');
            profiletoLoad = loadProfile_1
        } else if(this.currentTime >= 5.000 && this.currentTime <= 10.000){
            console.log('go to profile 2');
            profiletoLoad = loadProfile_2
        } else if(this.currentTime >= 10.000 && this.currentTime <= 15.000){
            console.log('go to profile 3');
        } else if(this.currentTime >= 15.000 && this.currentTime <= 20.000){
            console.log('go to profile 4');
        }
    });

    //TEST Log screensaver current time to screen
    function onTrackedVideoFrame(currentTime){
        $(".current").text(currentTime);
        //console.log(currentTime);
    };

    //MAIN load Profile functions
    function loadProfile_1() {
        alert('load profile 1');
    }

    function loadProfile_2() {
        alert('load profile 2');
    }
    
    
    //Start slideshow
    $(".slides").rotator();
    
    
    //MOTION DETECTION EVENTS START HERE
    //FUTURE: Include a counter that gets reset if the counter goes to green (use banner counter as base)
    socket.on('pirstatus', function (data) {
        if(data) {
            console.log('Pi says motion was detected')
            document.body.style.backgroundColor = "#545454";
            //Fire motion detection events here
            
            //TODO when users steps in, play the 'intro' function entirely, then set a time out of 30 seconds, if nothing else happens. Return to Screensaver
            
        }
        else{
            console.log('Pi is still')
            document.body.style.backgroundColor = "black";
            
            //Reset non motion events here after a short time
            
        }
    });
}