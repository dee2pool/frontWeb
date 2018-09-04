define(function () {
    var menu = {};
    //二级菜单图标列表，按照组织、资源、用户、人员、证卡、系统配置方式组织
    menu.secondIcons = new Array();
    menu.secondIcons.push("<i class=\"fa fa-sitemap\"></i>");
    menu.secondIcons.push("<i class=\"fa fa-th-large\"></i>");
    menu.secondIcons.push("<i class=\"fa fa-user-o\"></i>");
    menu.secondIcons.push("<i class=\"fa fa-users\"></i>");
    menu.secondIcons.push("<i class=\"fa fa-credit-card\"></i>");
    menu.secondIcons.push("<i class=\"fa fa-cog\"></i>");
    //根据后台返回的数据生成菜单
    menu.createMenu = function (data, IconList) {
        var html = "<ul class='menu'>"
        for (var i = 0; i < data.length; i++) {
            html += "<li id='" + data.id + "'>" +
                "<a href='" + data.url + "'>" + menu.secondIcons[data.orderNo] + "<span>" + data.name + "</span></a></li>";
        }
        html += "</ul>";
        return html;
    }
    menu.secondMenuShow = function () {
        $('.side-menu li').hover(function () {
            $('.second-menu-list .second-menu').stop().removeClass('on').eq($(this).index()).addClass('on')
        })
    };
    menu.thirdMenuShow = function () {
        $('.second-menu li').hover(function () {
            $('.third-menu-list .third-menu').stop().removeClass('on').eq($(this).index()).addClass('on')
        })
    }
    menu.secondMenuLeave = function () {
        $('.side-left').hover(function () {
        }, function () {
            $('.second-menu-list .second-menu').stop().removeClass('on')
        })
    }
    menu.thirdMenuLeave = function () {
        $('.side-left').hover(function () {
        }, function () {
            $('.third-menu-list .third-menu').stop().removeClass('on')
        })
    }
    return menu;
})