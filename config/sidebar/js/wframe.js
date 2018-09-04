require.config({
    shim: {
        'MenuService': {
            deps: ['jquery', 'common'],
            exports: "MenuService"
        }
    },
    paths: {
        "menu": '../../sidebar/js/menu',
        "MenuService": "../../basemanage/common/js/service/MenuController",
        "layer": "../../basemanage/common/libs/layer/layer"
    }
})
define(["menu", "MenuService", "layer"], function (menu, MenuService, layer) {
    var frame = {};
    frame.htm = ['<div class="side-left">',
        '    <nav class="navbar sidebar" data-sidenav>',
        '        <ul class="side-menu menu">',
        '            <li>',
        '                <a class="menu-elem" href="">',
        '                    <i class="fa fa-user-o"></i>',
        '                    <span>用户管理</span>',
        '                    <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                </a>',
        '            </li>',
        '        </ul>',
        '        <div class="add_menu">',
        '            <p class="side-collapse"><a id="hideSide" href="#"><i class="fa fa-angle-left"',
        '                                                                  style="font-size: 25px"></i></a></p>',
        '            <ul class="config-menu">',
        '                <li>',
        '                    <a id="addMenu" href="javascript:;">',
        '                        <i class="fa fa-plus-circle"></i>',
        '                        <span>添加菜单</span>',
        '                    </a>',
        '                </li>',
        '            </ul>',
        '        </div>',
        '    </nav>',
        '    <div class="second-menu-list">',
        '        <div class="second-menu">',
        '            <ul class="menu">',
        '                <li>',
        '                    <a class="menu-elem" href="../../role/view/rolemanage.html">',
        '                        <i class="fa fa-address-book"></i>',
        '                        <span>角色管理</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="../../user/view/usermanage.html">',
        '                        <i class="fa fa-user-o"></i>',
        '                        <span>用户管理</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="#">',
        '                        <i class="fa fa-cloud"></i>',
        '                        <span>域管理</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '            </ul>',
        '        </div>',
        '        <div class="second-menu">',
        '            <ul class="menu">',
        '                <li>',
        '                    <a href="">',
        '                        <i class="fa fa-cogs"></i>',
        '                        <span>中心管理2</span>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a href="">',
        '                        <i class="fa fa-cogs"></i>',
        '                        <span>中心管理2</span>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a href="">',
        '                        <i class="fa fa-cogs"></i>',
        '                        <span>中心管理2</span>',
        '                    </a>',
        '                </li>',
        '            </ul>',
        '        </div>',
        '    </div>',
        '</div>',
        '<button type="button" class="hambuger is-closed">',
        '    <span class="ham-top"></span>',
        '    <span class="ham-bottom"></span>',
        '</button>'].join("");

    //创建菜单
    function createMenu(parentId, level, callback) {
        MenuService.getCurrentUserMenuListByParentId(parentId, function (data) {
            if (data.result) {
                if (data.dataSize != 0) {
                    var html = "";
                    if (level === 2) {
                        html += "<div id='" + parentId + "' class='second-menu'>" +
                            menu.createMenu(data.data, menu.secondIcons) + "</div>";
                        callback(html, data.data);
                    } else if (level === 3) {
                        html += "<div id='" + parentId + "' class='third-menu'>" +
                            menu.createMenu(data.data, menu.secondIcons) + "</div>";
                        callback(html);
                    }
                }
            }
        })
    }

    //展示菜单
    function displayMenu() {
        //一级菜单
        MenuService.getCurrentUserMenuListByParentId(-1, function (data) {
            if (data.result) {
                var firsthtml = "";
                var secondhtml = "";
                var thirdhtml = "";
                for (var i = 0; i < data.data.length; i++) {
                    createMenu(data.data[i].id, 2, function (shtml, secondData) {
                        if (shtml !== undefined) {
                            //获得一级菜单
                            firsthtml += "<li id='" + i + "'><a href=''>" + firstMenu.icon + "<span>"
                                + data.data[i].name + "</span></a></li>";
                            //获得二级菜单
                            secondhtml += shtml;
                            for (var j = 0; j < secondData.length; j++) {
                                createMenu(secondData[j].id, 3, function (thtml) {
                                    //获得三级菜单
                                    thirdhtml += thtml;
                                })
                            }
                        }
                    })
                }
                //创建一级菜单
                $('.side-menu').html(firsthtml);
                //创建二级菜单
                $('.second-menu-list').html(secondhtml);
                //创建三级菜单
                $('.third-menu-list').html(thirdhtml);
            } else {
                //ToDo 后台接口返回异常处理
            }
        })
    }

    /* //显示或隐藏侧边栏
     var isClosed=true;
     function toggleSide(){
         $('.hambuger').click(function () {
             $('.sidebar').toggleClass('tog-side');
             $('.second-menu').toggleClass('tog-side');
             $('.third-menu').toggleClass('tog-side');
             $('.contentpage').toggleClass('tog-cont');
             if(isClosed){
                 $(this).removeClass('is-closed');
                 $(this).addClass('is-opend');
                 isClosed=false;
             }else{
                 $(this).removeClass('is-opend');
                 $(this).addClass('is-closed');
                 isClosed=true;
             }
         })
     }*/

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

    //显示菜单栏编辑按钮
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
                    $('.e-menu-wrap').css("top", 90 + i * 60);
                    console.log($(elem).find('span').html())
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
    }

    //添加菜单
    function addMenu() {
        $('#addMenu').click(function () {
            var form = '<form class="form-horizontal">\n' +
                '        <div class="form-group form-group-sm" style="margin: 15px 0px">\n' +
                '            <label class="control-label col-sm-4"><i class="required">*</i>菜单名称</label>\n' +
                '            <div class="col-sm-7">\n' +
                '                <input name="" type="text" class="form-control">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="form-group form-group-sm" style="margin: 15px 0px">\n' +
                '            <label class="control-label col-sm-4"><i class="required">*</i>上级菜单</label>\n' +
                '            <div class="col-sm-7">\n' +
                '                <select class="form-control">\n' +
                '                    <option>无</option>\n' +
                '                    <option>用户管理</option>\n' +
                '                </select>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="form-group form-group-sm" style="margin: 15px 0px">\n' +
                '            <label class="control-label col-sm-4">页面路径</label>\n' +
                '            <div class="col-sm-7">\n' +
                '                <input name="" type="text" class="form-control">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="form-group form-group-sm" style="margin: 15px 0px">\n' +
                '                <label class="control-label col-sm-4">菜单图标</label>\n' +
                '                <div class="col-md-3">\n' +
                '                    <div class="" style="width: 55px;height: 55px;border: 1px solid lightgray;text-align: center;vertical-align: center;padding-top: 8px">\n' +
                '                        <i class="fa fa-user-o fa-2x"></i>\n' +
                '                        <a onclick="editIcon()" href="javascript:;" style="display: block;font-size: 12px;background-color: lightgray">修改图标</a>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        <div class="form-group form-group-sm" style="margin: 15px 0px">\n' +
                '            <label class="control-label col-sm-4">备注</label>\n' +
                '            <div class="col-sm-7">\n' +
                '                <textarea class="form-control"></textarea>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="form-group" style="padding-left: 120px;margin: 15px 0px">\n' +
                '            <button name="doAdd" type="submit" class="btn btn-danger" style="margin-right: 30px">提交</button>\n' +
                '            <button name="doCancel" type="button" class="btn btn-default">取消</button>\n' +
                '        </div>\n' +
                '    </form>'
            layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '添加菜单',
                content: form
            })
        })
    }

    //修改菜单
    function editMenu() {
        $('.edit_opera').click(function () {

        })
    }
    //删除菜单
    function delMenu() {

    }

    frame.init = function () {
        //菜单效果初始化
        menu.secondMenuShow();
        menu.thirdMenuShow();
        menu.secondMenuLeave();
        menu.thirdMenuLeave();
        displayMenu();
        showSide();
        hideSide();
        addMenu();
        showEditIcon();
        showEditPage();
        editMenu();
    }
    return frame;
})