define(function () {
    var menu = {};
    //根据后台返回的数据生成菜单
    menu.createMenu = function (data, IconList) {
        var html = "<ul class='menu'>"
        for (var i = 0; i < data.length; i++) {
            html += "<li>" +
                "<a href='" + data[i].url + "'><span>" + data[i].name + "</span></a></li>";
        }
        html += "</ul>";
        return html;
    }
    menu.secondMenuShow = function () {
        $('.side-menu li').hover(function () {
            var id = $(this).attr('id');
            var $showMenu = $('.second-menu-list>.second-menu[name="' + id + '"]');
            /*$('.second-menu-list>.second-menu[name="'+id+'"]').stop().removeClass('on').eq($(this).index()).addClass('on')*/
            $showMenu.addClass('on');
            $showMenu.siblings().removeClass('on');

        })
    };
    menu.secondMenuLeave = function () {
        $('.side-left').hover(function () {
        }, function () {
            $('.second-menu-list .second-menu').stop().removeClass('on')
        })
    }
    return menu;
})