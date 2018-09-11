define(["menu", "MenuService", "layer"], function (menu, MenuService, layer) {
    var frame = {};
    frame.htm = ['<div class="side-left">',
        '    <nav class="navbar sidebar" data-sidenav>',
        '        <ul class="side-menu menu">',
        '        </ul>',
        '        <div class="add_menu">',
        '            <p class="side-collapse"><a id="hideSide" href="#">',
        '                <i class="fa fa-angle-left"style="font-size: 25px"></i></a></p>',
        '            <ul class="config-menu">',
        '                <li>',
        '                    <a href="javascript:;">',
        '                        <i class="fa fa-plus-circle"></i>',
        '                        <span>添加菜单</span>',
        '                    </a>',
        '                </li>',
        '            </ul>',
        '        </div>',
        '    </nav>',
        '    <div class="second-menu-list">',
        '    </div>',
        '</div>',
        '<button type="button" class="hambuger is-closed">',
        '    <span class="ham-top"></span>',
        '    <span class="ham-bottom"></span>',
        '</button>'].join("");

    //创建菜单
    function displayMenu() {
        MenuService.getMenuListByParentId(-1, function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    //一级菜单
                    var firsthtml = "<li id='" + data.data[i].id + "'><a class='menu-elem' href='" + data.data[i].url + "'><span>" + data.data[i].name + "</span>" +
                        "</a></li>";
                    //在内部插入一级菜单
                    $('.side-menu').append(firsthtml);
                    //二级菜单
                    MenuService.getMenuListByParentId(data.data[i].id, function (data2) {
                        if (data2.result) {
                            if (data2.dataSize > 0) {
                                $('.second-menu-list').append('<div name="' + data.data[i].id + '" class="second-menu">' + menu.createMenu(data2.data, menu.secondIcons) + '</div>');
                            }
                        }
                    })
                }
            }
        })
    }

    //显示侧边栏
    function showSide() {
        $('.hambuger').click(function () {
            $('.sidebar').addClass('tog-side');
            $('.second-menu').addClass('tog-side');
            $('.contentpage').addClass('tog-cont');
            $('.hambuger').hide()
        })
    }

    //隐藏侧边栏
    function hideSide() {
        $('#hideSide').click(function () {
            $('.sidebar').removeClass('tog-side');
            $('.second-menu').removeClass('tog-side');
            $('.contentpage').removeClass('tog-cont');
            $('.hambuger').show()
        })
    }

    /*//显示菜单栏编辑按钮
    function showEditIcon() {
        $('.menu-elem').mouseover(function () {
            $(this).children('.edit-menu').show();
        })
        $('.menu-elem').mouseleave(function () {
            $(this).children('.edit-menu').hide();
        })
    }
    //显示菜单栏编辑页面
    function showEditPage() {
        var html = '<div class="editM" style="position: absolute;top: 0px;left: 0px;width: 100%;display: none">\n' +
            '    <div class="e-menu-wrap">\n' +
            '        <ul class="e-menu-list">\n' +
            '            <li><a class="edit_opera" href="javascript:;">编辑</a></li>\n' +
            '            <li><a class="del_opera" href="javascript:;">删除</a></li>\n' +
            '        </ul>\n' +
            '    </div>\n' +
            '</div>';
        $('body').append(html);
        $('.edit-menu').mouseenter(function () {
            $.each($('nav>ul>li'), function (i, elem) {
                if ($(elem).find('div').is(':visible')) {
                    $('.editM').show();
                    $('.e-menu-wrap').css("left", 160);
                    $('.e-menu-wrap').css("top", 90 + i * 55);
                    $('.e-menu-list').attr('id', $(elem).attr('id'))
                    $('.e-menu-list').attr('name',$(elem).find('span').html())
                }
            })
            $.each($('.second-menu>ul>li'), function (i, elem) {
                if ($(elem).find('div').is(':visible')) {
                    $('.editM').show();
                    $('.e-menu-wrap').css("left", 340);
                    $('.e-menu-wrap').css("top", 90 + i * 60);
                }
            })
        })
        $('.menu').mouseleave(function () {
            $('.editM').hide();
        })
        $('.editM').mouseover(function () {
            $('.editM').show();
        })
        $('.editM').mouseleave(function () {
            $('.editM').hide();
        })
    }*/
    frame.init = function () {
        displayMenu();
        //菜单效果初始化
        menu.secondMenuShow();
        menu.secondMenuLeave();
        showSide();
        hideSide();
    }
    return frame;
})