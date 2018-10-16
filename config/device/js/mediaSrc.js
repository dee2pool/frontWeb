require.config({
    shim:{
        'ztree': {
            deps: ['jquery']
        },
        'common': {
            deps: ['jquery'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        }
    },
    paths:{
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "common": "../../common/js/util",
        "topBar": "../../../common/component/head/js/topbar",
        "layer": "../../../common/lib/layer/layer",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "mediaSrcService":"../../../common/js/service/MediaSrcsController",
        "deviceService": "../../../common/js/service/DeviceInfoController"
    }
});
require(['jquery','common','topBar','layer','bootstrap','ztree','bootstrap-table','mediaSrcService','deviceService'],function (jquery,common,topBar,layer,bootstrap,ztree,bootstrapTable,mediaSrcService,deviceService) {
    $('#head').html(topBar.htm);
    topBar.init();
    //解决layer不显示问题
    layer.config({
        path: '../../../common/lib/layer/'
    });
    /*var setting = {};
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    var zNodes = [
        {
            name: "默认管理域", open: true, icon: '../../domain/media/domain-img2.png', children: [
                {
                    name: "研发中心",
                    open:true,
                    icon: '../../org/media/org.png',
                    children: [{name: "编码设备",open:true,icon: "../../device/img/device.png",children:[{
                        name:"通道1",open:true,icon:"../../device/img/no.png"
                        },{
                            name:"IPC",open:true,icon:"../../device/img/camera.png"
                        },{
                            name:"通道3",open:true,icon:"../../device/img/no.png"
                        },{
                            name:"通道4",open:true,icon:"../../device/img/no.png"
                        }]}]
                }, {name: "厂区", icon: '../../org/media/org.png'}]
        },
    ]
    $.fn.zTree.init($("#orgTree"), setting, zNodes)*/
    /********************************* 媒体源信息表格 ***************************************/
    $('#mediaSrc_table').bootstrapTable({
        columns:[{
            checkbox: true
        }, {
            title: '序号',
            align: 'center',
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'srcsName',
            title: '媒体源名称',
            align: 'center'
        }, {
            field: 'srcsUri',
            title: '通道号',
            align: 'center'
        }, {
            field: 'srcsType',
            title: '通道类型',
            align: 'center'
        }, {
            field: 'gb28181Id',
            title: 'GB28181编码',
            align: 'center'
        }, {
            field: 'deviceId',
            visible:false
        },{
            field: 'deviceIp',
            title: '设备IP',
            align: 'center'
        }, {
            field: 'srcsStreamType',
            title: 'srcsStreamType',
            align: 'center'
        }, {
            field: 'deviceIp',
            title: '设备IP',
            align: 'center'
        }]
    })
    /********************************* 通道关联设备表格 ***************************************/
    $('#device_table_media').bootstrapTable({
        columns: [{
            checkbox: true
        }, {
            title: '序号',
            align: 'center',
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'deviceName',
            title: '设备名称',
            align: 'center'
        }, {
            field: 'deviceAddress',
            title: '安装地址',
            align: 'center'
        }, {
            field: 'deviceChaNum',
            title: '设备通道数',
            align: 'center'
        }]
    })
    var deviceTable = {};
    deviceTable.page = {
        'pageNumber': 1,
        'pageSize': 10
    }
    deviceTable.init = function () {
        deviceService.getDeviceInfoList(deviceTable.page, null, null,null, function (data) {
            if (data.result) {
                //向表格中填充数据
                $('#device_table_media').bootstrapTable('load',data.data);
            }
        })
    }
    deviceTable.init();
    /********************************* 修改通道关联设备 ***************************************/
    $('#altMediaDev').click(function () {
        var dev=$('#mediaSrc_table').bootstrapTable('getSelections');
        if(dev.length==0){
            layer.msg('请选择设备')
        }else if(dev.length>1){
            layer.msg('只能选择一个设备')
        }else{
            var layerId = layer.open({
                type: 1,
                resize:false,
                skin: 'layui-layer-rim',
                scrollbar: false,
                offset: '100px',
                content: $('#deviceTable')
            })
        }
    })
    //提交
    $('#sub').click(function () {
        var dev=$('#device_table_media').bootstrapTable('getSelections');
        var media=$('#mediaSrc_table').bootstrapTable('getSelections');
        if(dev.length==0){
            layer.msg('请选择设备')
        }else if(dev.length>1){
            layer.msg('只能选择一个设备')
        }else{
            mediaSrcService.updateById(dev[0].id,media[0].id,function (data) {
                if(data.result){
                    layer.msg('修改关联设备成功')
                }else{
                    layer.msg(data.description);
                }
                console.log(data)
            })
        }
    })
    /********************************* 批量删除 ***************************************/
    $('#delMediaDev').click(function () {
        var devs = $('#device_table').bootstrapTable('getSelections');
        if (devs.length == 0) {
            layer.msg('请选择要删除的设备')
        } else {
            layer.confirm('确定删除?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var ids = new Array();
                for (var i = 0; i < devs.length; i++) {
                    ids.push(devs[i].id);
                }
                deviceService.deleteDeviceInfo(ids, function (data) {
                    if (data.result) {
                        layer.msg('删除设备成功!');
                        $('#device_table').bootstrapTable('remove', {
                            field: 'id',
                            values: ids
                        })
                    } else {
                        layer.msg(data.description);
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
    })
    /********************************* 通道关联设备 ***************************************/
    $('#addMediaSrc').click(function () {
        var dev = $('#mediaSrc_table').bootstrapTable('getSelections');
        if (dev.length == 0) {
            layer.msg('请选择媒体源');
        } else if (dev.length > 1) {
            layer.msg('一次只能选择一个媒体源')
        } else {
           /* $('input[name="deviceSrcConId"]').val(dev[0].id)
            $('input[name="deviceSrcCode"]').val(dev[0].gb28181Id);*/
            var layerId = layer.open({
                type: 1,
                skin: 'layui-layer-lan',
                resize: false,
                area: ['420px', '218px'],
                scrollbar: false,
                offset: '100px',
                title: '加入通道',
                content: $('#addMedia')
            })
        }
    })
    /********************************* 通道信息 ***************************************/
    var mediaTable = {};
    mediaTable.page = {
        'pageNumber': 1,
        'pageSize': 10
    }
    mediaTable.init = function () {
        mediaSrcService.getMediaSrcsList(mediaTable.page,null,function (data) {
            if (data.result) {
                //向表格中填充数据
                $('#mediaSrc_table').bootstrapTable('load',data.data);
            }
        })
    }
    mediaTable.init();
})