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
    var idleTime = 0;
    var idleInterval = setInterval(timerIncrement, 5000); // 5 seconds

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
            
            //Add profile class to overall Container
            $('#Container').addClass(currentProfile[0]);
            //Fade screensaver
            screenSaver.css('opacity', '0');
            //Fade in looping BG
            $('#BG_source video').attr('src', 'video/' + currentProfile[0] + '_BG.mp4');
            $('#BG_source').addClass('faded_in');
             
            //dynamicNav();
            
            //Once faded out, play profile introduction video
            var currentVideo = $('#video_container' + ' ' + '#'+currentProfile[0]).get(0)

            screenSaver.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                currentVideo.play();
            });
            //Stop video at 5 seconds (tap to continue screen)
            var checkedFirst = false;
            var checkedSecond = false;

            currentVideo.addEventListener('timeupdate', function(event)
                                          {
                //console.log(currentVideo.currentTime); 
                if (currentVideo.currentTime >= 5 && !checkedFirst)
                {
                    checkedFirst = true;
                    currentVideo.pause();
                }

                if (currentVideo.currentTime >= 13 && !checkedSecond)
                {
                    checkedSecond = true;
                    currentVideo.pause();
                    $('#video_container').addClass('invisible');
                    $('#video_container').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                        console.log('video end');
                        $('#Bio').addClass('faded_in');
                    });
                    
                    //Make Bio smaller, fade rest of the elements after 3 seconds
                    $('#Bio').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                        console.log('Bio just faded in!');
                        //setTimeout(function(){
                            /*$('#video_container').delay(3000).addClass('hidden');
                            
                            $('#Container').addClass('Phase_2');
                            
                            $('#Bio').addClass('Reduced');*/

                            //$('#Testimonial' + '.' + currentProfile[0]).addClass('faded_in');
                            //$('#Keypoints' + '.' + currentProfile[0]).addClass('faded_in');
                            
                            
                        //}, 3000);
                        
                        
                        $('#video_container').delay(3000).fadeOut('slow').queue(function(){
                            $('#Container').addClass('Phase_2');
                            $('#Bio').addClass('Reduced');
                        });

                        //$('#Container').delay(3000).addClass('Phase_2');

                        //$('#Bio').delay(3000).addClass('Reduced');
                        
                    });
                    
                }
            });


            $('#video_container').click(function(event){
                currentVideo.play();
                console.log('replay');
            });
            //NOTE: Main function could continue here, however it will be moved to the bottom as the stand might not be triggered by the motion sensor.
        }
    }

    //Modal windows function
    function popupModals(){
        var popupBtn = $('#Keypoints ul li button');
        var otherModals = $('#Keypoints ul li div');
        var popupClass
        
        popupBtn.each(function(){
            $(this).on('click', function(){
                console.log($(this).attr('class'));
                otherModals.fadeOut('slow');
                $(this).next('div').fadeIn('slow');
            });
        });

        //close btn function
        $('.close_btn').on('click', function(){
            $(this).parent('div').fadeOut('slow');
        });
    };
    
    //Patient navigation function
    function patientSwitch(){
        var patientBtn = $('#Patients ul li');
        
        patientBtn.each(function(){
            $(this).on('click', function(){
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
                
                console.log('#Patients ul li' + '.' +switchProfile);
                
                $('#Patients ul li' + '.' +switchProfile).insertAfter('#Patients ul li:last')
                
                $('#BG_source video').attr('src', 'video/' + switchProfile + '_BG.mp4');
                
   
            });
        });
        
        
    };
    
    //Patient navigation reacts dynamically to overall container class
    function dynamicNav(){
        $('#Patients ul li').each(function(){
            if($(this).hasClass(currentProfile[0])){
                console.log('The container class matches with one of the Nav items');
                $(this).insertAfter('#Patients ul li:last');
            }
        });
    }

    
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
            if($('#Container').attr('class') == ''){
                console.log('Pi says motion was detected')
                
                clearInterval(idleInterval);

                loadProfile();

                console.log(currentProfile[0]);
            }

            //FUTURE: Set time out for reverting the main function if the user is inactive for a few minutes. Return to slideshow

        } else {
            console.log('Pi is still')
            //document.body.style.backgroundColor = "black";

            //Reset non motion events here after a short time

        }
    });

    //Backup Screen tap function
    if($('#Container').attr('class') == ''){
        $('#Container').on('click', function(){
            console.log('User tapped screen')
            clearInterval(idleInterval);
            loadProfile();
            console.log(currentProfile[0]);
        });
    }
    
    
}