define('device',['jquery','common','layx','layer'], function ($,common,layx) {
    //内部变量定义
    const device = {};
    //内部url配置
    const url = common.api+"/device";

    //测试
    device.index = function () {
        return "测试"
    };

    //轨迹添加
    device.addDevice = function (name, deviceWKT,id) {
        var obj = {"name": name, "geom": deviceWKT};
        var jsonObj = JSON.stringify(obj);
        $.ajax({
            type: "post",
            url: url+"/addDevice",
            data: jsonObj,
            //dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (result) {
                layer.msg('添加成功');
                // $("#add-device-form").css('display','none');
                layx.destroy(id);
            },
            error:function (result) {
                layer.msg('添加失败');
            }
        });
    };
    return device;
});