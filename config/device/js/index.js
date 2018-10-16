require.config({
    shim:{

    },
    paths:{
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "topBar": "../../../common/component/head/js/topbar",
        "layer": "../../../common/lib/layer/layer",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
    }
});
require(['jquery','topBar','layer','bootstrap'],function (jquery,topBar,layer,bootstrap) {
    $('#head').html(topBar.htm);
    topBar.init();
})