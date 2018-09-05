require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'bootstrap': {
            deps: ['jquery']
        }
    },
    paths: {
        "frame": "../../sidebar/js/wframe",
        "jquery": "../../common/libs/jquery/jquery-1.11.3.min",
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "MenuService": "../../common/js/service/MenuController",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer"
    }
});
require(['jquery', 'bootstrap','frame'], function (jquery, bootstrap, frame) {
    //初始化frame
    $('#sidebar').html(frame.htm);
    frame.init();
})