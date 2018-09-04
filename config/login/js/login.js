require.config({
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'loginservice': {
            deps: ['jquery', 'common'],
            exports: "loginservice"
        },
        'common': {
            deps: ['jquery', 'bootstrap-table'],
            exports: "common"
        },
        'bootstrap-table': {
            deps: ['jquery', 'bootstrap'],
            exports: "bootstrapTable"
        }
    },
    paths: {
        "jquery": "../../common/libs/jquery/jquery-1.11.3.min",
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "layer": "../../common/libs/layer/layer",
        "loginservice": "../../common/js/service/LoginController",
        "common": "../../common/js/util"
    }
});
require(['jquery', 'bootstrap', 'layer', 'loginservice', 'common'], function (jquery, bootstrap, layer, loginservice, common) {
    //防止被嵌套到其它页面iframe中
    if (window.top !== window.self) {
        window.top.location.href = window.location.href;
    }
    //解决layer不显示问题
    layer.config({
        path: 'common/libs/layer/'
    });
    //页面初始化时判断ip是否被锁定，如果没有被锁定判断是否需要验证码
    isIpBlock(function (data) {
        if (!data) {
            isNeedCaptcha();
        }
    })
    //判断ip是否已经被锁定
    function isIpBlock(callback) {
        loginservice.isIpAddressBlocked(function (data) {
            if (data.result) {
                if (data.data) {
                    layer.msg(data.description);
                    $('#login-btn').addClass('disabled');
                    $('#login-btn').unbind();
                    callback(true)
                } else {
                    callback(false)
                }
            }
        });
    }
    //判断是否需要验证码
    var isNeedCaptcha = function () {
        loginservice.isNeedCaptcha(function (data) {
            if (data.result) {
                if (data.data) {
                    loginservice.generateCaptcha(function (data) {
                        if (data.result) {
                            $('#captcha').html('<input id="captchaVal" class="form-control input-lg captcha-input">\n' +
                                '               <input id="captchaId" type="hidden" name="">\n' +
                                '               <img id="captchaImg" class="captcha-img" alt="验证码" src="">');
                            $('#captchaId').val(data.data.captchaId);
                            $('#captchaImg').attr('src', 'data:image/png;base64,' + data.data.imageStr);
                            //点击切换验证码
                            $('#captchaImg').bind("click", function () {
                                loginservice.generateCaptcha(function (data) {
                                    if (data.result) {
                                        $('#captchaId').val(data.data.captchaId);
                                        $('#captchaImg').attr('src', 'data:image/png;base64,' + data.data.imageStr);
                                    }
                                })
                            })
                        }
                    })
                }
            }
        });
    };
    //登录
    $('#login-btn').on('click', function () {
        if ($('#username').val() == '' || $('#username').val() == null) {
            layer.msg('请输入用户名');
            $('#username').focus();
        } else if ($('#password').val() == '' || $('#password').val() == null) {
            layer.msg('请输入密码');
            $('#password').focus();
        } else if ($('#captchaVal').is(':visible') && !$('#captchaVal').val()) {
            layer.msg('请输入验证码');
            $('#captchaVal').focus();
        } else {
            var userName = $('#username').val();
            var p = $('#password').val();
            var password = hex_md5(p)
            var captchaId = $('#captchaId').val();
            var captcha = $('#captchaVal').val();
            loginservice.login(userName, password, captchaId, captcha, function (data) {
                if (data.result) {
                    window.location.href = "../main/index/views/index.html"

                } else {
                    isIpBlock(function (msg) {
                        if (!msg) {
                            isNeedCaptcha();
                            layer.msg(data.description)
                        }
                    })
                }
            })
        }
        return false;
    })
})