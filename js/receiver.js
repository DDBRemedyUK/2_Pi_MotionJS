window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:8080');
    var status = document.getElementById("status");

    socket.on("connect", function() {
        console.log("Connected!");
    });

    //Function to disable right click menu
    $('body').on('contextmenu', function() {
        return false;
    });

    //Global variables to log time and time between click events
    var startDate,
        currentDay,
        currentHours,
        currentMinutes,
        currentSeconds,
        currentTime,
        subtractDate,
        subtractHours,
        subtractMinutes,
        subtractSeconds,
        subtractTime,
        timeSpent,
        timeSpentHours,
        timeSpentMinutes,
        timeSpentSeconds,
        loggedHours,
        loggedMinutes,
        loggedSeconds;

    //Functions to capture date and time
    function getCurrentTime() {
        startDate = new Date();
        currentDay = startDate.getDate();
        currentHours = startDate.getHours();
        currentMinutes = startDate.getMinutes();
        currentSeconds = startDate.getSeconds();
        currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
    };

    function calculateTime() {
        loggedHours = currentHours;
        loggedMinutes = currentMinutes;
        loggedSeconds = currentSeconds;
        subtractDate = new Date();
        subtractHours = subtractDate.getHours();
        subtractMinutes = subtractDate.getMinutes();
        subtractSeconds = subtractDate.getSeconds();
        subtractTime = subtractHours + ":" + subtractMinutes + ":" + subtractSeconds;
        timeSpentHours = subtractHours - loggedHours;
        timeSpentMinutes = subtractMinutes - loggedMinutes;
        timeSpentSeconds = subtractSeconds - loggedSeconds;
        timeSpent = timeSpentHours + ":" + timeSpentMinutes + ":" + timeSpentSeconds;
    };

    //VIDEO FUNCTIONS DEFINED HERE
    //NOTE: store the needed video frame times in variables, use those across the script
    //NOTE: video ID's set in variables too
    var video = $('video'),
        screenSaver = $('#slides_container'),
        //Variable to establish which profile to load (MAIN function)
        loadProfile;

    video.each(function() {
        var vidID = $(this).attr('id');

        $(this).on('loadedmetadata', function() {
            //console.log(vidID + ' total playtime ' + this.duration);
        });
    });

    //Analytics, global session number variable
    var sessionNo,
    //Slideshow
        idleTime = 1,
        idleInterval = setInterval(timerIncrement, 5000); // 5 seconds
        $t = $('.slides'),
        $item = $t.children().addClass('item');

    $t.addClass('rotator');

    if ($item.length > 1) {
        $item.first().addClass('current')
        //console.log($('.current').attr('class'));
    }

    //Global profile variable is defined here
    var currentProfile = $('.current').attr('class').split(' ');

    function timerIncrement() {

        idleTime = idleTime + 1;
        console.log(idleTime);

        var c = $t.find('.current');
        if (c.next().length === 0) {
            c.removeClass('current')
            $item.first().addClass('current')
        } else {
            c.removeClass('current').next().addClass('current')
        }
        //console.log($('.current').attr('class'));
        currentProfile = $('.current').attr('class').split(' ');

        if (currentProfile[0] == 'Profile_1') {
            console.log('go to profile 1');
        } else if (currentProfile[0] == 'Profile_2') {
            console.log('go to profile 2');
        } else if (currentProfile[0] == 'Profile_3') {
            console.log('go to profile 3');
        } else if (currentProfile[0] == 'Profile_4') {
            console.log('go to profile 4');
        }
    };

    //NOTE: creating global variable to be used as a closure to avoid the event firing more than once.
    var profileLoaded,
        currentVideo;

    function loadProfile() {
        if (!profileLoaded) {
            getCurrentTime();
            profileLoaded = true;

            //Analytics: generate random 4 digit number to identify sessions
            //Generate session number
            sessionNo = Math.floor(Math.random()*9000) + 1000;

            sessionNo = 'Session ID: ' + sessionNo + ' ';

            console.log(sessionNo + 'started');

            //Analytics identifier
            ga('send', 'event', 'Main function', 'Switch detected user', sessionNo + 'Main function started on profile: ' + currentProfile[0] + ' on: ' + currentDay + 'th April at: ' + currentTime);
            
            //Run Warning modal window
            warningModal();
            
            //dynamic nav
            dynamicNav();

            //Add profile class to overall Container
            $('#Container').addClass(currentProfile[0]);
            //Fade screensaver
            screenSaver.css('opacity', '0');
            //Fade in looping BG
            $('#BG_source video').attr('src', 'video/' + currentProfile[0] + '_BG.mp4');
            $('#BG_source').addClass('faded_in');

            //Bring videos back to start
            $('video.Profile')[0].pause();
            $('video.Profile')[0].currentTime = 0;

            //Once faded out, play profile introduction video
            var currentVideo = $('#video_container' + ' ' + '#' + currentProfile[0]).get(0);
            console.log(currentVideo);

            screenSaver.fadeIn('slow', function() {
                currentVideo.play();
                $('#video_container').addClass('unclickable');
            });

            //Stop video at 5 seconds (tap to continue screen)
            var checkedFirst = false;
            var checkedSecond = false;

            currentVideo.addEventListener('timeupdate', function(event) {
                //console.log(currentVideo.currentTime); 
                
                //1. Pause video at second 5
                if (currentVideo.currentTime >= 5 && !checkedFirst) {
                    checkedFirst = true;
                    currentVideo.pause();
                    $('#video_container').removeClass('unclickable');
                }

                //3. End vido after resuming it
                if (currentVideo.currentTime >= 13 && !checkedSecond) {
                    checkedSecond = true;
                    currentVideo.pause();
                    console.log('video end');
                    fadeBio();
                }
            });
            
            //2. Resume video on click
            $('#video_container').one('click', function(event) {
                calculateTime();
                getCurrentTime();
                currentVideo.play();
                console.log('replay');
                $('#video_container').addClass('unclickable');
                //Analytics identifier
                ga('send', 'event', 'Screen tap', 'User tapped on video pause', sessionNo + 'App proceeds to load Phase 2 at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
                /*currentVideo.addEventListener('timeupdate', function(event) {
                    console.log(currentVideo.currentTime);
                });*/
            });
            
        }
    }

    //Fade Bio functions
    var phase2Timeout;
    
    function fadeBio(){
        $('#video_container').hide();
        $('#video_container ' + '#' + currentProfile[0]).get(0).pause();
        $('#video_container ' + '#' + currentProfile[0]).get(0).currentTime = 0;
        $('#Bio').addClass('faded_in');
        phase2Timeout = setTimeout(phase2, 3000);

        function phase2(){
            clearTimeout(phase2Timeout);
            console.log('Bio just faded in');
            $('#Container').addClass('Phase_2');
        }
    }
    
    //Modal windows function
    function popupModals() {
        var popupBtn = $('#Keypoints ul li button');
        var otherModals = $('#Keypoints ul li div');
        var popupClass

        popupBtn.each(function() {
            $(this).on('click', function() {
                calculateTime();
                getCurrentTime();
                popupClass = $(this).attr('class').split(' ');
                console.log(popupClass[0]);
                otherModals.fadeOut('slow');
                $(this).next('div').fadeIn('slow');
                resetModalTimer();
                
                //Analytics identifier
                ga('send', 'event', 'Screen tap', 'Modal Popup', sessionNo + 'User chooses to see popup:' + popupClass[0] + ' at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
            });
        });

        //close btn function
        $('.patientPopup .close_btn').on('click', function() {
            calculateTime();
            getCurrentTime();
            $(this).parent('div').fadeOut('slow');
            resetModalTimer();

            //Analytics identifier
            ga('send', 'event', 'Screen tap', 'Modal Popup', sessionNo + 'User closes popup:' + popupClass[0] + ' at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
        });
    };

    //Patient navigation function
    function patientSwitch() {
        var patientBtn = $('#Patients ul li');

        patientBtn.each(function() {
            $(this).on('click', function() {
                calculateTime();
                getCurrentTime();
                var switchProfile = $(this).attr('class');
                console.log(switchProfile);
                currentProfile = switchProfile.split(' ');


                /*$('#Container').removeClass(currentProfile[0]);
                $('#Container').removeClass('Phase_2');*/
                //Reset container class
                $('#Container').removeClass('Phase_2');
                $('#Container').attr('class', '');

                $('#Container').addClass(switchProfile);
                $('#Container').addClass('Phase_2');

                console.log('#Patients ul li' + '.' + switchProfile);

                $('#Patients ul li' + '.' + switchProfile).insertAfter('#Patients ul li:last')

                $('#BG_source video').attr('src', 'video/' + switchProfile + '_BG.mp4');
                $('.patientPopup').fadeOut('slow');

                //clearTimer();
                resetModalTimer();

                
                //Analytics identifier
                ga('send', 'event', 'Screen tap', 'Profile switch', sessionNo + 'User chooses to navigate to: ' + switchProfile + ' at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
                
            });
        });
    };

    //Patient navigation reacts dynamically to overall container class
    function dynamicNav() {
        $('#Patients ul li').each(function() {
            if ($(this).hasClass(currentProfile[0])) {
                console.log('The container class matches with one of the Nav items');
                $(this).insertAfter('#Patients ul li:last');
            }
        });
    }

    //Warning timer when user has been idle - careful here, Settimeouts and SetIntervals being used, don't want to go full Inception
    var counter,
        countDown,
        modalTimeout,
        modalIncrement,
        modalTimer;
    
    function warningModal() {
        //Check if user has been inactive
        //var modalTimeout = setTimeout(modalIncrement, 5000); //Max idle time: 10 seconds
        function startTimer(){
            modalTimeout = setTimeout(function() {
                    clearTimeout(modalTimeout);
                    modalTimeout = null;
                    if (modalTimeout == null){
                        console.log('timer has finished');
                        modalIncrement();
                    } else {
                        console.log('timer is still running');
                    }
            }, 180000); //Max idle time: 3 minutes(180000) or 5 minutes (300000)
        };
        
        function modalIncrement(){
            
            if(idleTime == 0){
                calculateTime();
                getCurrentTime();
                console.log('3 minutes passed');
                $('#Container').addClass('unclickable');
                $('#IdleModal').fadeIn('slow', function(){
                    counter = 20;
                    countDown = setInterval(modalTimer, 1000); //1000 will  run it every 1 second
                    
                    //Analytics identifier
                    ga('send', 'event', 'Main function', 'User', sessionNo + 'was idle for long, therefore popup was shown at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
                });
            }
        };

        startTimer();

    };


    //This function fires when modal timer has finished
    function modalTimer() {
        counter = counter - 1;
        if (counter <= 0) {
            //counter ended, do something here
            clearInterval(countDown);
            revertEverything();
            return;
        }
        $('.countdown').text(counter);
        //Do code for showing the number of seconds here;
        console.log(counter);
    };

    //function for modal close button
    $('#IdleModal .close_btn').one('click', function() {
        console.log('modal close btn clicked');
        $(this).parent('div').fadeOut('slow', function() {
            $('#Container').removeClass('unclickable');
            $('.countdown').text('20');
            clearInterval(countDown);
            counter = 20;
            resetModalTimer();
        });
    });

    function resetModalTimer() {
        clearTimeout(modalTimeout);
        modalTimeout = null;
        if (modalTimeout == null){
            console.log('Resetting modal timer');
            warningModal();
        } else {
            console.log('TIMER IS STILL RUNNING!!! h');
        }
    };

  
    
    //Revert function to reset to home screens
    function revertEverything() {
        console.log('Modal timeout completed, session' + sessionNo + 'ended.');
        
        //Analytics identifier
        ga('send', 'event', 'Main function', 'User', sessionNo + 'went idle and did not return, dropping on profile: ' + currentProfile[0] + ' at: ' + currentTime + '. Time since last interaction: ' + timeSpent);
        
        //IF anything bugs out on this function just refresh the page (comment everything below this line)
        $('#IdleModal').fadeOut('fast');
        $('.countdown').text('20');
        
        profileLoaded = false;
        
        //run the revert functions here
        //Slideshow Restarts
        clearInterval(idleInterval);
        idleTime = 1;
        idleInterval = setInterval(timerIncrement, 5000); // 5 seconds
        
        
        //Bring videos back to start
        $('#video_container ' + '#' + currentProfile[0]).get(0).pause();
        $('#video_container ' + '#' + currentProfile[0]).get(0).currentTime = 0;
        $('video').each(function() {
            if ( $('video')[0].currentTime == 0) {
                console.log('videos have reset');
            } else {
                console.log('videos have NOT reset');
            }
        });
        
        
        //Hide all shown elements
        //$('#Container').removeClass('Phase_2');
        $('#slides_container').removeAttr('style');
        $('#video_container').removeAttr('class unclickable style');
        $('#Container, #BG_source, #Bio').removeAttr('class');
        $('#Keypoints ul li div').removeAttr('style');
        
        
        //Analytics: renew session Number
        /*sessionNo = Math.floor(Math.random()*9000) + 1000;
        sessionNo = 'Session ID: ' + sessionNo + ' ';
        console.log(sessionNo);*/
        
        //IF anything bugs out on this function just refresh the page (comment everything above this line)
        //location.reload();
        
    };

    //This function clears the screensaver slideshow timer, other functions are set not to trigger if its running
    function clearTimer() {
        clearInterval(idleInterval);
        idleTime = 0;
        console.log(idleTime);
        console.log('slideshow timer cleared');
    };

    //Calling our functions
    popupModals();
    patientSwitch();


    //MOTION DETECTION EVENTS START HERE
    //FUTURE: Include a counter that gets reset if the counter goes to green (use banner counter as base)
    socket.on('pirstatus', function(data) {
        if (data) {
            //Fire motion detection event here

            //Clear timer in slideshow so it stops on selected profile

            //Only trigger the main function if the container section does NOT have any class
            if (!$('#Container').attr('class')) {
                console.log('Pi says motion was detected')
                clearTimer();
                loadProfile();
                console.log(currentProfile[0]);
            }

            //FUTURE: Set time out for reverting the main function if the user is inactive for a few minutes. Return to slideshow

        } else {
            //console.log('Pi is still')
            //document.body.style.backgroundColor = "black";
            //Reset non motion events here after a short time
        }
    });

    //Backup Screen tap function
    $('#Container').on('click', function() {
        if (!$('#Container').attr('class')) {
            console.log('User tapped screen')
            clearTimer();
            loadProfile();
            console.log(currentProfile[0]);
        }
    });

};