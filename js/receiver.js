window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:8080');
    var status = document.getElementById("status");

    socket.on("connect", function() {
        console.log("Connected!");
    });

    //VIDEO FUNCTIONS DEFINED HERE
    //NOTE: store the needed video frame times in variables, use those across the script
    //NOTE: video ID's set in variables too
    var video = $('video');
    var screenSaver = $('#slides_container');

    //Variable to establish which profile to load (MAIN function)
    var profiletoLoad = loadProfile_1; //Load first profile at the start

    video.each(function() {
        var vidID = $(this).attr('id');

        $(this).on('loadedmetadata', function() {
            //console.log(vidID + ' total playtime ' + this.duration);
        });
    });

    //Slideshow
    var idleTime = 0;
    var idleInterval = setInterval(timerIncrement, 5000); // 2.5 seconds

    var $t = $('.slides'),
        $item = $t.children().addClass('item')

        $t.addClass('rotator');

    if ($item.length > 1) {
        $item.first().addClass('current')
        //console.log($('.current').attr('class'));
    }

    var currentProfile = $('.current').attr('class').split(' ');

    function timerIncrement() {
        var c = $t.find('.current');
        if (c.next().length === 0) {
            c.removeClass('current')
            $item.first().addClass('current')
        } else {
            c.removeClass('current').next().addClass('current')
        };
        //console.log($('.current').attr('class'));
        currentProfile = $('.current').attr('class').split(' ');

        if (currentProfile[0] == 'Profile_1') {
            console.log('go to profile 1');
            profiletoLoad = loadProfile_1
        } else if (currentProfile[0] == 'Profile_2') {
            console.log('go to profile 2');
            profiletoLoad = loadProfile_2
        } else if (currentProfile[0] == 'Profile_3') {
            console.log('go to profile 3');
            profiletoLoad = loadProfile_4
        } else if (currentProfile[0] == 'Profile_4') {
            console.log('go to profile 4');
            profiletoLoad = loadProfile_4
        }
    }


    //MAIN load Profile functions
    function loadProfile_1() {
        //alert('load profile 1');
    }

    function loadProfile_2() {
        //alert('load profile 2');
        $('#Container').addClass('Profile_2')
        screenSaver.css('opacity', '0');
        screenSaver.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
            $('#video_container #Profile_2').get(0).play();
        });
    }

    function loadProfile_3() {
        //alert('load profile 2');
    }

    function loadProfile_4() {
        //alert('load profile 2');
    }


    //MOTION DETECTION EVENTS START HERE
    //FUTURE: Include a counter that gets reset if the counter goes to green (use banner counter as base)
    socket.on('pirstatus', function(data) {
        if (data) {
            console.log('Pi says motion was detected')
            //document.body.style.backgroundColor = "#545454";
            //Fire motion detection events here

            //TODO when users steps in, play the 'intro' function entirely, then set a time out of 30 seconds, if nothing else happens. Return to Screensaver
            
            //Clear timer in slideshow so it stops on selected profile 
            //clearInterval(idleInterval);
            
            //profiletoLoad();

            console.log(currentProfile[0]);

        } else {
            console.log('Pi is still')
            //document.body.style.backgroundColor = "black";

            //Reset non motion events here after a short time

        }
    });
}