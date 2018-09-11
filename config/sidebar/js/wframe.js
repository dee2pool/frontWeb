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
        '            <li>',
        '                <a class="menu-elem" href="">',
        '                    <span>设备管理</span>',
        '                    <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                </a>',
        '            </li>',
        '            <li>',
        '                <a class="menu-elem" href="">',
        '                    <span>GIS配置</span>',
        '                    <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                </a>',
        '            </li>',
        '        </ul>',
        '        <div class="add_menu">',
        '            <p class="side-collapse"><a id="hideSide" href="#">',
        '                <i class="fa fa-angle-left"style="font-size: 25px"></i></a></p>',
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
        '            </ul>',
        '        </div>',
        '        <div class="second-menu">',
        '            <ul class="menu">',
        '                <li>',
        '                    <a class="menu-elem" href="../../hn_med_deviceInfo/views/hn_med_deviceInfo.html">',
        '                        <span>设备信息</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="../../hn_med_deviceMode/view/hm_med_deviceMode.html">',
        '                        <span>设备型号</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="../../hn_med_manufacturer/views/hn_med_manufacturer.html">',
        '                        <span>设备厂商</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '            </ul>',
        '        </div>',
        '        <div class="second-menu">',
        '            <ul class="menu">',
        '                <li>',
        '                    <a class="menu-elem" href="../../gis/view/basemap.html">',
        '                        <span>底图配置</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="../../gis/view/feature_category.html">',
        '                        <span>要素分类</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
        '                    </a>',
        '                </li>',
        '                <li>',
        '                    <a class="menu-elem" href="../../gis/view/feature.html">',
        '                        <span>要素关联</span>',
        '                        <div class="edit-menu"><i class="fa fa-cog"></i></div>',
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
    function createMenu(parentId, parentName, level, callback) {
        MenuService.getMenuListByParentId(parentId, function (data) {
            if (data.result) {
                if (true) {
                    var html = "";
                    if (level === 2) {
                        html += "<div id='" + parentId + "' class='second-menu'>" +
                            menu.createMenu(data.data, menu.secondIcons) + "</div>";
                        callback(html, parentName);
                    }
                }
            }
        })
    }

    //展示菜单
    function displayMenu() {
        //一级菜单
        MenuService.getMenuListByParentId(-1, function (d) {
            if (d.result) {
                var firsthtml = "";
                var secondhtml = "";
                for (var i = 0; i < d.data.length; i++) {
                    createMenu(d.data[i].id, d.data[i].name, 2, function (shtml, pName) {
                        if (shtml !== undefined) {
                            //获得一级菜单
                            var firsthtml = "<li id='" + d.data[i].id + "'><a class='menu-elem' href='#'><span>" + pName + "</span>" +
                                "<div class='edit-menu'><i class='fa fa-cog'></i></div></a></li>";
                            //在内部插入一级菜单
                            $('.side-menu').append(firsthtml);
                            //获得二级菜单
                            $('.second-menu-list').append('<div class="second-menu">' + shtml + '</div>');
                        }
                    })
                }
            } else {
                //ToDo 后台接口返回异常处理
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
    }

    //添加菜单
    function addMenu() {
        $('#addMenu').click(function () {
            layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '添加菜单',
                content: $('#addMpanel')
            })
        })
        $('#doAdd').click(function () {
            //表单验证
            //表单提交
            var menu = {};
            menu.name = $("input[name='Menuname']").val();
            menu.parentId = $("select[name='MenuparentId']").val();
            menu.Menuurl = $("input[name='Menuurl']").val();
            menu.Menuremark = $("textarea[name='Menuremark']").val();
            menu.orderNo = $("input[name='MenuorderNo']").val();
            MenuService.addMenu(menu, function (data) {
                if (data.result) {
                    layer.msg('添加成功!')

                }
            })
            return false;
        })
    }

    //删除菜单
    function delMenu() {
        $('.del_opera').click(function () {
            layer.confirm('确定删除此菜单？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                console.log($('.e-menu-list').attr('id'));
                MenuService.deleteMenuById($('.e-menu-list').attr('id'), function (data) {
                    if (data.result) {
                        layer.msg('删除成功')
                    }
                })
            }, function () {

            });
        })
    }

    //編輯菜单
    function editMenu(){
        $('.edit_opera').click(function () {
            layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '修改菜单',
                content: $('#addMpanel')
            })
        })
    }
    frame.init = function () {
        displayMenu();
        //菜单效果初始化
        menu.secondMenuShow();
        menu.secondMenuLeave();
        showSide();
        hideSide();
        addMenu();
        showEditIcon();
        showEditPage();
        delMenu();
        editMenu();
    }
    return frame;
})