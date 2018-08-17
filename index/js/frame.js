//body初始化
function initBody() {
    window.resizeTo(screen.availWidth,screen.availHeight)
}
//窗口分辨率调整
function resize() {
    var height=window.innerHeight;
    var width=window.innerWidth;
    var headHeight=$('.main-header').height();
    var sideWidth=$('.main-sidebar').width();
    var h=height-headHeight;
    var w=width-sideWidth;
    $('.main-container').css('height',h);
}
function openPage(url,parentName,name) {
    $('iframe').attr('src',url);
}
$(function () {
    initScroll()
})
//初始化侧边栏滚动条
function initScroll(){
    $('.slimscrollleft').slimScroll({
        height:'730px',
        position:'right',
        color:'#7A868F',
        size:'5px',
        wheelStep:5
    })
}