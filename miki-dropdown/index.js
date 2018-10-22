/**
 * author:mikixing
 * create:2018.10.22
 * description:a jquery plugin use in jquery object
 */
(function ($) {
    //辅助函数
    function slice (obj) {
        return [].slice.call(obj)
    }
    $.fn.mikiDp = function () {
        var $box = $(this)
        var dp = $box.find('.miki-dp')[0]
        var $dp = $(dp)
        var arr = slice($dp.children('.miki-dp-child'))
        for (var i = 0; i < arr.length; i++) {
            $(arr[i]).css('display', 'block')
        }
        dp.onselectstart = function () {return false}
        $dp.on('click', function (ev) {
            var target = ev.target
            var $p = $(target.parentNode)
            var arr = slice($p.children('.miki-dp-child'))
            if ($p.hasClass('miki-dp-more')) {
                arr.map(function (e) {
                    var $e = $(e)
                    if ($e.css('display') === 'none' ) {
                        $e.slideDown('normal')
                    } else {
                        $e.slideUp('fast')
                    }
                })
            }
        })
    }
})(jQuery)