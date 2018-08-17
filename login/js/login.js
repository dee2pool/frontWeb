require.config({
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'layer': {
            deps:['jquery'],
            exports:"layer"
        },
        'loginservice':{
            deps:['jquery','common'],
            exports:"loginservice"
        },
        'common':{
            deps:['jquery'],
            exports:"common"
        }
    },
    paths: {
        "jquery": "../../common/libs/jquery/jquery-1.11.3.min",
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "layer": "../../common/libs/layer/layer",
        "mock": "../../common/libs/mock",
        "loginservice":"../../common/js/LoginController",
        "common":"../../common/js/util"
    }
});
require(['jquery', 'bootstrap', 'layer', 'mock','loginservice','common'], function (jquery, bootstrap, layer, Mock,loginservice,common) {
    layer.config({
        path:'common/libs/layer/'
    });
    loginservice.isIpAddressBlocked(function (data) {
        if(data.result){
            if(data.data){
                layer.msg("您的IP已经被锁定");
                $('#login-btn').addClass('disabled');
            }
        }
    });
    loginservice.isNeedCaptcha(function (data) {
        if(data.result){
            if(data.data){
                
            }
        }
    });
    $('#login-btn').on('click',function () {
        
    })
})