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
    
    
    
    //MOTION DETECTION EVENTS START HERE
    socket.on('pirstatus', function (data) {
        if(data) {
            status.innerHTML = "Motion detected";
            document.body.style.backgroundColor = "green";
            
            //Fire motion detection events here
            
        }
        else{
            status.innerHTML = "Awaiting motion";
            document.body.style.backgroundColor = "red";
            
            //Reset non motion events here after a short time
            
        }
    });
}