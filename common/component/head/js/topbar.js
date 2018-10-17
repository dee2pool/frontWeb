define(["../../../common/js/service/LoginController"],function (loginservice) {
    var topBar={};
    //logo图片路径
    topBar.imgSrc='../../../common/component/head/img/logo.png';
    topBar.menuManage='../../../config/menu/view/menumanage.html';
    topBar.deviceManage='../../../config/device/view/index.html';
    topBar.url = "/hnvmns-frontweb";
    topBar.img=topBar.url+"/common/component/head/img";
    topBar.htm=['<nav class="navbar navbar-default top-navbar" role="navigation">',
        '    <div class="navbar-header">',
        '        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">',
        '            <span class="sr-only">Toggle navigation</span>',
        '            <span class="icon-bar"></span>',
        '            <span class="icon-bar"></span>',
        '            <span class="icon-bar"></span>',
        '        </button>',
        '        <a class="navbar-brand" href="index.html"><img src="'+topBar.imgSrc+'" alt="华南光电"/></a>',
        '        <span class="navbar-text" style="color: #fff">智能可视化监管系统</span>',
        '        <ul class="navbar-main">',
        '            <li><a href="'+topBar.url+'/main/index.html"><span class="fa fa-home"></span>&nbsp;主页</a></li>',
        '            <li><a href="'+topBar.url+'/main/core/view/core2.html"><span class="fa fa-map"></span>&nbsp;一张图</a></li>',
        '            <li><a href="'+topBar.url+'/main/depot/view/index.html"><span class="fa fa-plane"></span>驾驶舱</a></li>',
        '        </ul>',
        '    </div>',
        '    <ul class="nav navbar-top-links navbar-right">',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle panel-home" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/menu.png" width="15" height="15">',
        '            </a>',
        '            <div class="navpanel">',
        '                <div class="row" style="height: 100%">',
        '                    <div class="col-md-3 funcMenu" style="background-color: #90B4E7">',
        '                        <a href="'+topBar.menuManage+'"><i class="fa fa-cog fa-2x"></i>',
        '                            <p>基础配置</p></a></div>',
        '                    <div class="col-md-3 funcMenu" style="background-color: #79d57f">',
        '                               <a href="'+topBar.deviceManage+'"><i class="fa fa-server fa-2x"></i>',
        '                                  <p>设备管理</p></a></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                    <div class="col-md-3 funcMenu"></div>',
        '                </div>',
        '            </div>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle panel-home" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/user.png" width="15" height="15">',
        '            </a>',
        '            <ul class="user-info">',
        '                <li>',
        '                    <a href="#"><img src="'+topBar.img+'/user-info.png" width="15" height="15">&nbsp;&nbsp;个人信息</a>',
        '                </li>',
        '                <li class="divider"></li>',
        '                <li>',
        '                    <a href="#"><img src="'+topBar.img+'/altpwd.png" width="15" height="15">&nbsp;&nbsp;修改密码</a>',
        '                </li>',
        '            </ul>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/msg.png" width="15" height="15">',
        '            </a>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/info.png" width="15" height="15">',
        '            </a>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle panel-home" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/phone.png" width="15" height="15">',
        '            </a>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                <img src="'+topBar.img+'/download.png" width="15" height="15">',
        '            </a>',
        '        </li>',
        '        <li class="dropdown">',
        '            <a id="loginout" class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">',
        '                退出',
        '            </a>',
        '        </li>',
        '    </ul>',
        '</nav>'].join("");
    //显示隐藏功能面板
    function showPanel(){
        $('.panel-home').hover(function () {
            $(this).parent().append('<div class="panel-sign"></div>');
            $(this).next().show();
        })
        $('.navpanel').mouseleave(function () {
            $('.navbar-right').find('.panel-sign').remove();
            $(this).hide();
        })
        $('.user-info').mouseleave(function () {
            $('.navbar-right').find('.panel-sign').remove();
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
        showPanel();
        logOut();
    }
    return topBar;
})