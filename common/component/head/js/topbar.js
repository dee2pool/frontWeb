require.config({
    shim:{
        'nav':{
            deps:['jquery'],
            exports:"nav"
        },
        'loginservice': {
            deps: ['jquery', 'common'],
            exports: "loginservice"
        },
    },
    paths:{
        "nav":'../../basemanage/common/libs/nav/js/nav.min',
        "loginservice": "../../basemanage/common/js/service/LoginController"
    }
})
define(["nav","loginservice"],function (nav,loginservice) {
    var topBar={};
    //logo图片路径
    topBar.imgSrc='../../../../config/head/img/logo.png';
    topBar.userManage='http://hnvmns-frontweb.frontconfig:8080/hnvmns-frontweb/basemanage/role/view/rolemanage.html';
    topBar.htm=['<div id="sui_nav" class="sui-nav horizontal">',
        '    <div class="sui-nav-wrapper nav-border nav-line">',
        '        <div class="pull-left nav-header">',
        '            <img src="'+topBar.imgSrc+'" alt="华南光电">',
        '            智能可视化监管系统',
        '        </div>',
        '        <ul>',
        '            <li><a class="" href="http://hnvmns-frontweb.frontmain:8080/hnvmns-frontweb/index/views/index.html"><span class="glyphicon glyphicon-home"></span>&nbsp;主页</a></li>',
        '            <li><a class="" href="http://hnvmns-frontweb.frontmain:8080/hnvmns-frontweb/core/view/core.html"><span class="glyphicon glyphicon-fire"></span>&nbsp;一张图</a></li>',
        '            <li><a href="http://hnvmns-frontweb.frontmain:8080/hnvmns-frontweb/depot/view/index.html"><span class="glyphicon glyphicon-plane"></span>驾驶舱</a>',
        '            </li>',
        '        </ul>',
        '        <ul class="pull-right">',
        '            <li>',
        '                <a class="glyphicon glyphicon-home panel-home"></a>',
        '                <div class="navpanel">',
        '                    <div class="row" style="height: 100%">',
        '                        <div class="col-md-3 funcMenu" style="background-color: #90B4E7"><i',
        '                                class="fa fa-user fa-2x"></i><a href="'+topBar.userManage+'"><p>用户管理</p></a></div>',
        '                        <div class="col-md-3 funcMenu" style="background-color: #acb0cc"><i',
        '                                class="fa fa-tasks fa-2x"></i><a href=""><p>设备管理</p></a></div>',
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
                if(data.result){
                    window.location.href="../../login.html";
                }
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