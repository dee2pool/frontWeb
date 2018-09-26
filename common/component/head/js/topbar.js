define(["../../../common/lib/nav/js/nav.min","../../../common/js/service/LoginController"],function (nav,loginservice) {
    var topBar={};
    //logo图片路径
    topBar.imgSrc='../../../common/component/head/img/logo.png';
    topBar.menuManage='../../../config/menu/view/menumanage.html';
    topBar.deviceManage='../../../config/hn_med_deviceInfo/views/hn_med_deviceInfo.html';
    topBar.url = "/hnvmns-frontweb"
    topBar.htm=['<div id="sui_nav" class="sui-nav horizontal">',
        '    <div class="sui-nav-wrapper nav-border nav-line">',
        '        <div class="pull-left nav-header">',
        '            <img src="'+topBar.imgSrc+'" alt="华南光电">',
        '            智能可视化监管系统',
        '        </div>',
        '        <ul>',
        '            <li><a href="'+topBar.url+'/main/index.html\"><span class="fa fa-home"></span>&nbsp;主页</a></li>',
        '            <li><a href="'+topBar.url+'/main/core/view/core.html\"><span class="fa fa-map"></span>&nbsp;一张图</a></li>',
        '            <li><a href="'+topBar.url+'/main/depot/view/index.html\"><span class="fa fa-plane"></span>驾驶舱</a>',
        '            </li>',
        '        </ul>',
        '        <ul class="pull-right">',
        '            <li>',
        '                <a class="glyphicon glyphicon-home panel-home"></a>',
        '                <div class="navpanel">',
        '                    <div class="row" style="height: 100%">',
        '                        <div class="col-md-3 funcMenu" style="background-color: #90B4E7"><i',
        '                                class="fa fa-cog fa-2x"></i><a href="'+topBar.menuManage+'"><p>基础配置</p></a></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                        <div class="col-md-3 funcMenu"></div>',
        '                    </div>',
        '                </div>',
        '            </li>',
        '            <li><a class="glyphicon glyphicon-user"></a>',
        '                <ul>',
        '                    <li><a href="javascript:;">个人信息</a></li>',
        '                    <li><a href="javascript:;">修改密码</a></li>',
        '                    <li><a id="loginout" href="javascript:;">退出</a></li>',
        '                </ul>',
        '            </li>',
        '        </ul>',
        '    </div>',
        '</div>'].join("");
    //创建头部
    function createTopBar() {
        var topbar = $('#sui_nav').SuiNav({});
        var navbar = topbar.create('nav_second', {}, {});
        $('.MenuToggle').click(function() {
            console.log("toggle");
            topbar.toggle();
        });
        $('.MenuOpen').click(function() {
            console.log("open");
            topbar.show();
        });
    }
    //显示隐藏功能面板
    function showPanel(){
        $('.panel-home').hover(function () {
            $(this).parent().after('<div class="panel-sign"></div>');
            $('.navpanel').show();
        })
        $('.navpanel').mouseleave(function () {
            $('.pull-right').find('.panel-sign').remove();
            $(this).hide();
        })
    }
    //退出
    function logOut(){
        $('#loginout').click(function () {
            loginservice.logout(function (data) {
                window.location.href="../../login.html";
            })
        })
    }
    topBar.init=function () {
        createTopBar();
        showPanel();
        logOut();
    }
    return topBar;
})