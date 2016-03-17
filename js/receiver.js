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
    var loadProfile
    video.each(function() {
        var vidID = $(this).attr('id');

        $(this).on('loadedmetadata', function() {
            //console.log(vidID + ' total playtime ' + this.duration);
        });
    });

    
    
    //Slideshow
    var idleTime = 1;
    var idleInterval = setInterval(timerIncrement, 5000); // 5 seconds

    var $t = $('.slides'),
        $item = $t.children().addClass('item')

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
        };
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
    }

    //NOTE: creating global variable to be used as a closure to avoid the event firing more than once.
    var profileLoaded;

    function loadProfile() {
        if (!profileLoaded) {
            profileLoaded = true;
            
            //Run Warning modal window
            warningModal();
            
            //Add profile class to overall Container
            $('#Container').addClass(currentProfile[0]);
            //Fade screensaver
            screenSaver.css('opacity', '0');
            //Fade in looping BG
            $('#BG_source video').attr('src', 'video/' + currentProfile[0] + '_BG.mp4');
            $('#BG_source').addClass('faded_in');

            //dynamicNav();

            //Once faded out, play profile introduction video
            var currentVideo = $('#video_container' + ' ' + '#' + currentProfile[0]).get(0)

            screenSaver.fadeIn('slow', function() {
                currentVideo.play();
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
                currentVideo.play();
                console.log('replay');
                $('#video_container').addClass('unclickable');
            });
            
        }
    }

    //Fade Bio functions
    var phase2Timeout
    
    function fadeBio(){
        $('#video_container').fadeOut('slow', function() {
            $('video.Profile')[0].pause();
            $('video.Profile')[0].currentTime = 0;
            $('#Bio').addClass('faded_in');
            phase2Timeout = setTimeout(phase2, 3000);
        });
        
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
                console.log($(this).attr('class'));
                otherModals.fadeOut('slow');
                $(this).next('div').fadeIn('slow');
                //clearTimer();
                resetModalTimer();
            });
        });

        //close btn function
        $('.close_btn').on('click', function() {
            $(this).parent('div').fadeOut('slow');
            //clearTimer();
            resetModalTimer();
        });
    };

    //Patient navigation function
    function patientSwitch() {
        var patientBtn = $('#Patients ul li');

        patientBtn.each(function() {
            $(this).on('click', function() {
                var switchProfile = $(this).attr('class')
                console.log(switchProfile);

                /*$('#Container').removeClass(currentProfile[0]);
                $('#Container').removeClass('Phase_2');*/
                //Reset container class
                $('#Container').removeClass('Phase_2');
                $('#Container').attr('class', '');

                $('#Container').addClass(switchProfile);
                $('#Container').addClass('Phase_2');

                /*$('#Testimonial, #Keypoints').each(function(){
                    $(this).fadeOut('slow');
                    $('#Testimonial' + '.' + switchProfile).fadeIn('slow');
                });*/

                console.log('#Patients ul li' + '.' + switchProfile);

                $('#Patients ul li' + '.' + switchProfile).insertAfter('#Patients ul li:last')

                $('#BG_source video').attr('src', 'video/' + switchProfile + '_BG.mp4');

                //clearTimer();
                resetModalTimer();

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
    var counter
    var countDown
    var modalTimeout
    var modalIncrement
    var modalTimer
    
    function warningModal() {
        //Check if user has been inactive
        //var modalTimeout = setTimeout(modalIncrement, 5000); //Max idle time: 10 seconds
        function startTimer(){
            var modalTimeout = setTimeout(
                function(){
                    clearTimeout(modalTimeout);
                    modalIncrement();

                }, 60000); //Max idle time: 20 seconds (testing)  
        };
        
        function modalIncrement(){
            
            if(idleTime == 0){
                console.log('1 minute passed');
                $('#IdleModal').fadeIn('slow', function(){
                    counter = 20;
                    countDown = setInterval(modalTimer, 1000); //1000 will  run it every 1 second
                    function modalTimer() {
                        counter = counter - 1;
                        if (counter <= 0) {
                            //counter ended, do something here
                            revertEverything();
                            clearInterval(countDown);
                            return;
                        }
                        $('.countdown').text(counter);
                        //Do code for showing the number of seconds here;
                        console.log(counter);
                    }
                });
                
                $('#IdleModal .close_btn').one('click', function(){
                    $('.countdown').text('20');
                    clearInterval(countDown);
                    counter = 20;
                    
                    //clearTimeout(modalTimeout);
                    startTimer();
                });
            };
        };
        
        startTimer();
        
    };
    
    
    function resetModalTimer(){
        console.log('Resetting modal timer');
        $('.countdown').text('20');
        clearTimeout(modalTimeout);
        clearInterval(countDown);
        counter = 20;
        
    }

  
    
    //Revert function to reset to home screens
    function revertEverything() {
        console.log('Modal timeout completed');
        
        $('#IdleModal').fadeOut('fast');
        $('.countdown').text('20');
        
        profileLoaded = false;
        
        //run the revert functions here
        //Slideshow Restarts
        clearInterval(idleInterval);
        idleTime = 1;
        idleInterval = setInterval(timerIncrement, 5000); // 5 seconds
        
        
        //Bring videos back to start
        $('video.Profile')[0].pause();
        $('video.Profile')[0].currentTime = 0;
        
        //Hide all shown elements
        $('#Container').attr('class', '');
        $('#Container').removeClass('Phase_2');
        $('#slides_container').attr('style', '');
        $('#video_container').attr('class', '');
        $('#video_container').attr('style', '');
        $('#BG_source').attr('class', '');
        //$('#Bio').attr('class', '');
        //$('#Bio').hide();
    }

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
            if ($('#Container').attr('class') == '') {
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
    if ($('#Container').attr('class') == '') {
        $('#Container').one('click', function() {
            console.log('User tapped screen')
            clearTimer();
            loadProfile();
            console.log(currentProfile[0]);
        });
    }



}