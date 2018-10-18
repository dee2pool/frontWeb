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
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrap-table-zh-CN': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTableZhCN"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'buttons': {
            deps: ['jquery']
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "common": "../../common/js/util",
        "frame": "../../sidebar/js/wframe",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "topBar": "../../../common/component/head/js/topbar",
        "layer": "../../../common/lib/layer/layer",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "domainService": "../../../common/js/service/DomainController",
        "deviceService": "../../../common/js/service/DeviceInfoController",
        "mediaSrcService": "../../../common/js/service/MediaSrcsController",
        "orgService": "../../../common/js/service/OrgController",
        "buttons": "../../common/js/buttons",
        "orgTree": "../js/orgTree"
    }
});
require(['jquery', 'frame', 'topBar', 'common', 'layer', 'bootstrap', 'bootstrapValidator', 'ztree', 'bootstrap-table', 'bootstrap-table-zh-CN', 'domainService', 'buttons', 'orgService', 'orgTree', 'deviceService', 'mediaSrcService'],
    function (jquery, frame, topBar, common, layer, bootstrap, bootstrapValidator, ztree, bootstrapTable, bootstrapTableZhCN, domainService, buttons, orgService, orgTree, deviceService, mediaSrcService) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        /*头部*/
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 区域组织树 ***************************************/
        var tree = {};
        tree.setting = {
            data: {
                key: {
                    title: 'name'
                },
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode"
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    tree.selected = treeNode;
                    deviceTable.orgCode=treeNode.code;
                    deviceTable.init();
                }
            }
        }
        tree.init = function () {
            var treeObj = $.fn.zTree.init($("#orgTree"), tree.setting, orgTree.zNodes());
            treeObj.expandAll(true);
        }
        tree.init();
        //搜索树节点
        tree.search = function () {
            var treeObj = $.fn.zTree.getZTreeObj('orgTree')
            var keywords = $('#keyword').val();
            var nodes = treeObj.getNodesByParamFuzzy("name", keywords, null);
            if (nodes.length > 0) {
                treeObj.selectNode(nodes[0]);
            }
        }
        //查询节点
        document.getElementById('keyword').addEventListener('input', tree.search, false);
        /********************************* 主设备表格 ***************************************/
        $('#device_table').bootstrapTable({
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
                field: 'deviceType',
                title: '设备类型',
                align: 'center',
                formatter: function (value, row, index) {

                }
            }, {
                field: 'deviceIp',
                title: '设备IP地址',
                align: 'center'
            }, {
                field: 'amgPort',
                title: '拉流服务端口',
                align: 'center'
            }, {
                field: 'amgProto',
                title: '拉流协议',
                align: 'center'
            }, {
                field: 'adgPort',
                title: '运维端口',
                align: 'center'
            }, {
                field: 'adgProto',
                title: '运维设备协议',
                align: 'center'
            }, {
                field: 'deviceChaNum',
                title: '设备通道数',
                align: 'center'
            }, {
                field: 'deviceUser',
                title: '登录名',
                align: 'center'
            }, {
                field: 'deviceModel',
                title: '设备型号',
                align: 'center'
            }, {
                field: 'deviceManu',
                title: '设备厂商',
                align: 'center'
            }, {
                field: 'gb28181Id',
                title: 'GB28181',
                align: 'center'
            }, {
                field: 'orgCode',
                title: '组织',
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
                title: '操作',
                align: 'center',
                events: {
                    "click #edit_btn": function (e, value, row, index) {
                        deviceEdit.init(row, index);
                    }
                },
                formatter: function () {
                    var icons = "<div class='button-group'><button id='edit_btn' type='button' class='button button-tiny button-highlight'><i class='fa fa-edit'></i>修改</button>" +
                        "</div>"
                    return icons;
                }
            }]
        })
        var deviceTable = {};
        deviceTable.page = {
            'pageNumber': 1,
            'pageSize': 10
        }
        deviceTable.init = function () {
            deviceService.getDeviceInfoList(deviceTable.page,deviceTable.ip,deviceTable.name,deviceTable.orgCode, function (data) {
                if (data.result) {
                    //向表格中填充数据
                    $('#device_table').bootstrapTable('load', data.data);
                    deviceTable.page['count']=data.extra;
                    //初始化分页组件
                    common.pageInit(deviceTable.page.pageNumber, deviceTable.page.pageSize, data.extra);
                }
            })
        }
        deviceTable.init();
        /********************************* 分页操作 ***************************************/
        common.initPageOpera(deviceTable.page,deviceTable.init)
        /********************************* 查询设备 ***************************************/
        $('#search').click(function () {
             deviceTable.ip = $('input[name="d_ip"]').val();
            deviceTable.name = $('input[name="d_name"]').val();
            deviceTable.init();
        })
        /********************************* 添加设备 ***************************************/
        var deviceAdd = {};
        deviceAdd.valiadator = function () {
            $('#DeviceForm').bootstrapValidator({
                container: 'tooltip',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    deviceName: {
                        validators: {
                            notEmpty: {
                                message: '设备名称不能为空'
                            }
                        }
                    }, ip: {
                        validators: {
                            notEmpty: {
                                message: 'ip不能为空'
                            }
                        }
                    }, amgPort: {
                        validators: {
                            notEmpty: {
                                message: '拉流端口不能为空'
                            }
                        }
                    }, adgPort: {
                        validators: {
                            notEmpty: {
                                message: '拉流协议不能为空'
                            }
                        }
                    }, deviceUser: {
                        validators: {
                            notEmpty: {
                                message: '登录用户名不能为空'
                            }
                        }
                    }, devicePwd: {
                        validators: {
                            notEmpty: {
                                message: '登录密码不能为空'
                            }
                        }
                    }
                }
            })
        }
        deviceAdd.submit = function () {
            $('#DeviceForm').on('success.form.bv', function () {
                var device = {};
                device.deviceName = $('input[name="deviceName"]').val();
                device.deviceIp = $('input[name="ip"]').val();
                device.amgPort = $('input[name="amgPort"]').val();
                device.adgPort = $('input[name="adgPort"]').val();
                device.deviceChaNum = $('select[name="deviceChaNum"]').val();
                device.deviceUser = $('input[name="deviceUser"]').val();
                device.devicePwd = $('input[name="devicePwd"]').val();
                device.modelId = $('select[name="modelId"]').val();
                device.manuId = $('select[name="manuId"]').val();
                device.amgProto = $('select[name="amgProto"]').val();
                device.adgProto = $('select[name="adgProto"]').val();
                var parentCode = $('select[name="parentCode"]').val();
                var orgCode = $('input[name="orgCode"]').val();
                var dictCode = $('select[name="dictCode"]').val();
                var typeCode = $('select[name="typeCode"]').val();
                deviceService.addDeviceInfo(device, orgCode, parentCode, typeCode, dictCode, function (data) {
                    if (data.result) {
                        //向表格中添加
                        device.id = data.data;
                        var allPageNum=$('.page-next').prev().children().html();
                        if(deviceTable.page.pageNumber==allPageNum){
                            $('#device_table').bootstrapTable('append', device);
                        }
                        //更新分页条
                        common.pageInit(deviceTable.page.pageNumber,deviceTable.page.pageSize,deviceTable.page.count+1);
                        //清空表格
                        $("input[name='res']").click();
                        //清空验证
                        $("#DeviceForm").data('bootstrapValidator').destroy();
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('添加成功')
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        deviceAdd.init = function () {
            $('#addDevice').click(function () {
                if (tree.selected) {
                    //开启验证
                    deviceAdd.valiadator();
                    //开启弹窗
                    $('input[name="orgName"]').val(tree.selected.name)
                    $('input[name="orgCode"]').val(tree.selected.code)
                    var layerId = layer.open({
                        type: 1,
                        skin: 'layui-layer-lan',
                        resize: false,
                        area: ['620px', '435px'],
                        scrollbar: false,
                        offset: '100px',
                        title: '添加设备',
                        content: $('#add_device')
                    })
                    //表单提交
                    deviceAdd.submit();
                } else {
                    layer.msg('请选择左侧组织')
                }
            })
        }
        deviceAdd.init();
        /********************************* 修改设备 ***************************************/
        var deviceEdit = {};
        deviceEdit.valia = function () {
            $('#editDeviceForm').bootstrapValidator({
                container: 'tooltip',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editDeviceName: {
                        validators: {
                            notEmpty: {
                                message: '设备名称不能为空'
                            }
                        }
                    },
                    editip: {
                        validators: {
                            notEmpty: {
                                message: 'ip不能为空'
                            }
                        }
                    },
                    editParentCode: {
                        validators: {
                            notEmpty: {
                                message: '网关不能为空'
                            }
                        }
                    },
                    editAmgPort: {
                        validators: {
                            notEmpty: {
                                message: '拉流端口不能为空'
                            }
                        }
                    },
                    editAdgPort: {
                        validators: {
                            notEmpty: {
                                message: '运维端口不能为空'
                            }
                        }
                    },
                    editDeviceUser: {
                        validators: {
                            notEmpty: {
                                message: '登录用户名不能为空'
                            }
                        }
                    },
                    editDevicePwd: {
                        validators: {
                            notEmpty: {
                                message: '登录密码不能为空'
                            }
                        }
                    }

                }
            })
        }
        deviceEdit.submit = function (row, index, layerId) {
            $('#editDeviceForm').on('success.form.bv', function () {
                var device = {};
                device.id = $('input[name="deviceId"]').val();
                device.deviceName = $('input[name="editDeviceName"]').val();
                device.deviceIp = $('input[name="editip"]').val();
                device.amgPort = $('input[name="editAmgPort"]').val();
                device.adgPort = $('input[name="editAdgPort"]').val();
                device.deviceChaNum = $('select[name="editDeviceChaNum"]').val();
                device.deviceUser = $('input[name="editDeviceUser"]').val();
                device.devicePwd = $('input[name="editDevicePwd"]').val();
                device.modelId = $('select[name="editModelId"]').val();
                device.manuId = $('select[name="editManuId"]').val();
                device.amgProto = $('select[name="editAmgProto"]').val();
                device.adgProto = $('select[name="editAdgProto"]').val();
                deviceService.updateDeviceInfo(device, device.modelId, device.manuId, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        layer.msg('修改设备成功')
                        //更新表格
                        $('#device_table').bootstrapTable('updateRow', {index: index, row: device});
                        $("button[type='submit']").removeAttr('disabled');
                        //清空验证
                        $("#editDeviceForm").data('bootstrapValidator').destroy();
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        deviceEdit.init = function (row, index) {
            //启用校验
            deviceEdit.valia();
            //填充表单
            $("select[name='eidtDictCode']").val(row.deviceType);
            $("input[name='editDeviceName']").val(row.deviceName);
            $("input[name='deviceId']").val(row.id);
            $("input[name='editip']").val(row.deviceIp);
            $("select[name='editAmgPot']").val(row.amgPort);
            $("select[name='editAmgProto']").val(row.amgProto);
            $("input[name='editAdgPort']").val(row.adgPort);
            $("select[name='editAdgProto']").val(row.adgProto);
            $("select[name='editDeviceChaNum']").val(row.deviceChaNum);
            $("input[name='editDeviceUser']").val(row.deviceUser);
            $("input[name='editDevicePwd']").val(row.devicePwd);
            $("select[name='editModelId']").val(row.deviceModel);
            $("select[name='editManuId']").val(row.deviceManu);
            //打开弹窗
            var layerId = layer.open({
                type: 1,
                skin: 'layui-layer-lan',
                resize: false,
                area: ['620px', '385px'],
                scrollbar: false,
                offset: '100px',
                title: '修改设备',
                content: $('#edit_device')
            })
            //表单提交
            deviceEdit.submit(row, index, layerId)
        }
        /********************************* 删除设备 ***************************************/
        var deviceDel = {};
        deviceDel.init = function (row) {
            $('#delDevice').click(function () {
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
                                //更新分页条
                                var pageCount=deviceTable.page.count-data.dataCount
                                common.pageInit(deviceTable.page.pageNumber,deviceTable.page.pageSize,pageCount);
                                deviceTable.page.count=pageCount;
                            } else {
                                layer.msg(data.description);
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }
            })
        }
        deviceDel.init();
        /********************************* 添加到媒体源 ***************************************/
        $('#addMediaSrc').click(function () {
            var dev = $('#device_table').bootstrapTable('getSelections');
            if (dev.length == 0) {
                layer.msg('请选择设备');
            } else if (dev.length > 1) {
                layer.msg('只能选择一个设备')
            } else {
                $('input[name="deviceSrcName"]').val(dev[0].deviceName);
                $('input[name="deviceSrcConId"]').val(dev[0].id);
                $('input[name="deviceSrcCode"]').val(dev[0].gb28181Id);
                var layerId = layer.open({
                    type: 1,
                    skin: 'layui-layer-lan',
                    resize: false,
                    area: ['420px', '257px'],
                    scrollbar: false,
                    offset: '100px',
                    title: '加入媒体源',
                    content: $('#addMedia')
                })
            }
        })
        //选择编码设备
        var dev_layer;
        $('#choseDevice').click(function () {
            dev_layer = layer.open({
                type: 1,
                resize: false,
                skin: 'layui-layer-rim',
                scrollbar: false,
                title:'关联设备',
                area: ['520px', '457px'],
                offset: '100px',
                content: $('#deviceTable')
            })
        })
        var addMediaSrc = {};
        addMediaSrc.valia = function () {
            $('#addMediaForm').bootstrapValidator({
                container: 'tooltip',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    deviceName: {
                        validators: {
                            notEmpty: {
                                message: '通道名称不能为空'
                            }
                        }
                    },
                    device: {
                        validators: {
                            notEmpty: {
                                message: '请选择编码设备'
                            }
                        }
                    },
                    uriNum: {
                        validators: {
                            notEmpty: {
                                message: '请输入设备通道号'
                            }
                        }
                    }

                }
            })
        }
        addMediaSrc.valia();
        //表单提交
        addMediaSrc.submit = function () {
            $('#addMediaForm').on('success.form.bv', function () {
                var deviceId = $('input[name="deviceSrcId"]').val();
                var uriNum = $('input[name="uriNum"]').val();
                var deviceName = $('input[name="deviceSrcName"]').val();
                var deviceConId = $('input[name="deviceSrcConId"]').val();
                var deviceCode = $('input[name="deviceSrcCode"]').val();;
                var typeCode = $('select[name="srcTypeCode"]').val();
                mediaSrcService.addMediaSrcsList(deviceId,uriNum,deviceName,deviceConId,deviceCode,typeCode, function (data) {
                    if (data.result) {
                        layer.msg('添加到通道成功!')
                        //清空表格
                        //清空验证
                        $("#addMediaForm").data('bootstrapValidator').destroy();
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        addMediaSrc.submit();
        /********************************* 查询通道信息 ***************************************/
        $('#device_table_media').bootstrapTable({
            columns: [{
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'id',
                visible: false
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
            }],
            onClickRow: function (row, $element, field) {
                layer.close(dev_layer)
                $('input[name="device"]').val(row.deviceName);
                $('input[name="deviceSrcId"]').val(row.id);
            }
        })
        var mediaTable={};
        mediaTable.init = function () {
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
        mediaTable.init();
        /********************************* 刷新 ***************************************/
        $('#refresh').click(function () {
            deviceTable.init();
        })
    })