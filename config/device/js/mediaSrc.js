require.config({
    shim: {
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
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "common": "../../common/js/util",
        "topBar": "../../../common/component/head/js/topbar",
        "layer": "../../../common/lib/layer/layer",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "mediaSrcService": "../../../common/js/service/MediaSrcsController",
        "deviceService": "../../../common/js/service/DeviceInfoController",
        "orgService": "../../../common/js/service/OrgController"
    }
});
require(['jquery', 'common', 'topBar', 'layer', 'bootstrap', 'bootstrapValidator', 'ztree', 'bootstrap-table', 'mediaSrcService', 'deviceService', 'orgService'],
    function (jquery, common, topBar, layer, bootstrap, bootstrapValidator, ztree, bootstrapTable, mediaSrcService, deviceService, orgService) {
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 媒体源信息表格 ***************************************/
        $('#mediaSrc_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'srcsName',
                title: '通道名称',
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
                field: 'srcsReferId',
                title: '关联设备',
                align: 'center',
                formatter: function (value, row, index) {

                }
            }, {
                field: 'srcsPublished',
                title: '是否已发布',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == 1) {
                        return '已发布'
                    }
                    if (value == 0) {
                        return '未发布'
                    }
                }
            }, {
                field: 'deviceName',
                title: '主设备',
                align: 'center'
            }/*, {
                field: 'deviceIp',
                title: '主设备IP',
                align: 'center'
            }, {
                field: 'deviceUser',
                title: '主设备登录账号',
                align: 'center'
            }, {
                field: 'devicePwd',
                title: '主设备登录密码',
                align: 'center'
            }, {
                field: 'deviceChaNum',
                title: '主设备通道数',
                align: 'center'
            }, {
                field: 'amgPort',
                title: '拉流端口',
                align: 'center'
            }, {
                field: 'amgProto',
                title: '拉流协议',
                align: 'center'
            }*/]
        })
        /********************************* 媒体源信息 ***************************************/
        var mediaTable = {};
        mediaTable.page = {
            'pageNumber': 1,
            'pageSize': 10
        }
        mediaTable.init = function () {
            mediaSrcService.getMediaSrcsList(mediaTable.page, null, function (data) {
                if (data.result) {
                    //向表格中填充数据
                    $('#mediaSrc_table').bootstrapTable('load', data.data);
                    common.pageInit(mediaTable.page.pageNumber, mediaTable.page.pageSize, data.extra)
                    mediaTable.page['count']=data.extra;
                }
            })
        }
        mediaTable.init();
        /********************************* 分页操作 ***************************************/
        common.initPageOpera(mediaTable.page,mediaTable.init)
        /******************************** 通道关联设备表格 **************************************/
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
                field: 'deviceModel',
                title: '设备型号',
                align: 'center'
            }, {
                field: 'orgCode',
                title: '所属组织',
                align: 'center',
                formatter: function (value) {
                    var orgName;
                    orgService.getOrgByCode(value, function (data) {
                        if (data.result) {
                            orgName = data.data.name;
                        }
                    })
                    if (orgName == null) {
                        return '无'
                    } else {
                        return orgName;
                    }
                }
            }, {
                field: 'id',
                visible: false
            }, {
                field: 'gb28181Id',
                visible: false
            }]
        })
        var deviceTable = {};
        deviceTable.init = function () {
            var type = new Array();
            //根据设备类型查询设备类型暂时只指定120:ipc，121:dome
            type.push(120);
            type.push(121);
            deviceService.getDeviceInfoByType(type, function (data) {
                if (data.result) {
                    //向表格中填充数据
                    $('#device_table_media').bootstrapTable('load', data.data);
                }
            })
        }
        deviceTable.init();
        /********************************* 修改通道关联设备 ***************************************/
        var altMedia = {};
        altMedia.sub = function () {
            //提交
            $('#sub').click(function () {
                var dev = $('#device_table_media').bootstrapTable('getSelections');
                var media = $('#mediaSrc_table').bootstrapTable('getSelections');
                if (dev.length == 0) {
                    layer.msg('请选择设备')
                } else if (dev.length > 1) {
                    layer.msg('只能选择一个设备')
                } else {
                    mediaSrcService.updateById(media[0].id, dev[0].id, function (data) {
                        if (data.result) {
                            layer.msg('修改关联设备成功')
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }
            })
        }
        $('#altMediaDev').click(function () {
            var dev = $('#mediaSrc_table').bootstrapTable('getSelections');
            if (dev.length == 0) {
                layer.msg('请选择设备')
            } else if (dev.length > 1) {
                layer.msg('只能选择一个设备')
            } else {
                var layerId = layer.open({
                    type: 1,
                    resize: false,
                    skin: 'layui-layer-lan',
                    title: '关联设备',
                    scrollbar: false,
                    area: '580px',
                    offset: '100px',
                    content: $('#deviceTable')
                })
                altMedia.sub();
            }
        })
        /********************************* 批量删除 ***************************************/
        $('#delMediaDev').click(function () {
            var devs = $('#mediaSrc_table').bootstrapTable('getSelections');
            if (devs.length == 0) {
                layer.msg('请选择要删除的通道信息')
            } else {
                layer.confirm('确定删除?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    var ids = new Array();
                    for (var i = 0; i < devs.length; i++) {
                        ids.push(devs[i].id);
                    }
                    mediaSrcService.deleteMediaSrcsByIds(ids, function (data) {
                        if (data.result) {
                            layer.msg('删除通道信息成功!');
                            $('#mediaSrc_table').bootstrapTable('remove', {
                                field: 'id',
                                values: ids
                            })
                            //更新分页
                            if(!mediaTable.page.count&&data.dataCount!=0){
                                common.pageInit(mediaTable.page.pageNumber,mediaTable.page.pageSize,mediaTable.page.count-data.dataCount);
                            }
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }, function () {
                    layer.closeAll();
                });
            }
        })
        /********************************* 通道关联设备 **************************************
         var addMedia = {};
         addMedia.valia = function () {
            
        }
         //提交
         addMedia.sub = function () {
            $('#addMediaSub').click(function () {
                var dev=$('input[name="device"]').val();
                if(dev==''){
                    layer.msg('请选择要关联的设备')
                }else{
                    var deviceId = $('input[name="deviceSrcId"]').val();
                    var uriNum = $('input[name="uriNum"]').val();
                    var deviceName = $('input[name="deviceName"]').val();
                    var deviceConId = $('input[name="deviceConId"]').val();
                    var deviceCode = $('input[name="deviceCode"]').val();;
                    var typeCode = $('select[name="srcTypeCode"]').val();
                    mediaSrcService.addMediaSrcsList(deviceId,uriNum,deviceName,deviceConId,deviceCode,typeCode, function (data) {
                        if (data.result) {
                            //清空表单
                            $("input[name='res']").click();
                            layer.closeAll();
                            layer.msg('设备添加到通道成功!')
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }
            })
        }
         addMedia.init = function () {
            $('#addMediaSrc').click(function () {
                //启用验证
                addMedia.valia();
                //获得媒体源
                var dev = $('#mediaSrc_table').bootstrapTable('getSelections');
                if (dev.length == 0) {
                    layer.msg('请选择媒体源');
                } else if (dev.length > 1) {
                    layer.msg('一次只能选择一个媒体源')
                } else {
                    //打开弹窗
                    $('input[name="deviceName"]').val(dev[0].deviceName)
                    $('input[name="uriNum"]').val(dev[0].srcsUri);
                    $('input[name="deviceSrcId"]').val(dev[0].id);
                    var layerId = layer.open({
                        type: 1,
                        skin: 'layui-layer-lan',
                        resize: false,
                        area: ['420px', '258px'],
                        scrollbar: false,
                        offset: '100px',
                        title: '关联设备',
                        content: $('#addMedia')
                    })
                    //选择编码设备
                    var dev_layer;
                    $('#choseDevice').click(function () {
                        dev_layer = layer.open({
                            type: 1,
                            resize: false,
                            skin: 'layui-layer-rim',
                            scrollbar: false,
                            area: ['720px', '457px'],
                            offset: '100px',
                            content: $('#deviceTable')
                        })
                    })
                    //点击确定
                    $('#sub').click(function () {
                        var dev = $('#device_table_media').bootstrapTable('getSelections');
                        if (dev.length == 0) {
                            layer.msg('请选择设备')
                        } else if (dev.length > 1) {
                            layer.msg('只能选择一个设备')
                        } else {
                            $('input[name="deviceId"]').val(dev[0].id);
                            $('input[name="device"]').val(dev[0].deviceName)
                            $('input[name="deviceCode"]').val(dev[0].gb28181Id);
                            layer.close(dev_layer);
                        }
                    })
                    //提交
                    addMedia.sub();
                }
            })
        }
         addMedia.init();*/
    })