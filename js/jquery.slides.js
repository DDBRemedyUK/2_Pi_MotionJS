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
                setInterval(function() {
                    var c = $t.find('.current');
                    if (c.next().length === 0) {
                        c.removeClass('current')
                        $item.first().addClass('current')
                    } else {
                        c.removeClass('current').next().addClass('current')
                    }
                }, settings.interval);
            }
        });
    };
})(jQuery);