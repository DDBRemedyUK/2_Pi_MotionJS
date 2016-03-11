//Slideshow    
(function($) {
    $.fn.rotator = function(settings) {
        settings = jQuery.extend({
            interval: 5000,
            speed: 1500
        }, settings);

        return this.each(function() {
            var $t = $(this),
                $item = $t.children().addClass('item')

            $t.addClass('rotator');

            if ($item.length > 1) {
                $item.first().addClass('current')
                //console.log($('.current').attr('class'));
                //var currentProfile = $('.current').attr('class').split(' ');
                setInterval(function() {
                    var c = $t.find('.current');
                    if (c.next().length === 0) {
                        c.removeClass('current')
                        $item.first().addClass('current')
                    } else {
                        c.removeClass('current').next().addClass('current')
                    }                
                    //console.log($('.current').attr('class'));
                    //currentProfile = $('.current').attr('class').split(' ');
                    //console.log(currentProfile[0]);
                }, settings.interval);
            }
        });
    };
})(jQuery);