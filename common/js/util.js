define(['layer'],function (layer) {
    var common = {};
    common.host = "http://192.168.0.142:8080";
    common.wsHost = 'https:' == document.location.protocol ? "wss://" + document.location.host + "/web" : "ws://" + document.location.host + "/web";
    $.ajaxSetup({
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            try {
                var resp = data.responseText;
                var msg = JSON.parse(resp);
                var httpStatus = data.status;
                if (httpStatus == 403) {
                    window.parent.location.href = loginPageUrl;
                } else if (httpStatus == 404) {
                    layer.msg('网络异常，请稍后再试')
                }
            } catch (e) {
                layer.msg('网络异常，请稍后再试')
                console.log(data.responseText);
            } finally {

            }
        }
    })
    return common;
})