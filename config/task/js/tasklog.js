require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap': {
            deps: ['jquery']
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "frame": "../../sidebar/js/wframe",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "topBar": "../../../common/component/head/js/topbar",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController"
    }
});
require(['jquery', 'common', 'layer','bootstrap','frame','topBar'],
    function (jquery, common, layer,bootstrap,frame,topBar) {
        //初始化frame
        $('#sidebar').html(frame.taskHtm);
        frame.showLeave();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });

    })