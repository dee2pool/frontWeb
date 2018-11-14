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
            deps: ['bootstrap-table', 'jquery'],
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
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "domainService": "../../../common/js/service/DomainController",
        "deviceService": "../../../common/js/service/DeviceInfoController",
        "mediaSrcService": "../../../common/js/service/MediaSrcsController",
        "orgService": "../../../common/js/service/OrgController",
        "orgTree": "../js/orgTree",
        "dictService": "../../../common/js/service/dictController",
        "deviceManu":"../../../common/js/service/DeviceManufacturerController",
        "deviceModel":"../../../common/js/service/DeviceModelController",
        "gbCatalogService":"../../../common/js/service/GBCatalogController"
    }
});
require(['jquery', 'frame', 'topBar', 'common', 'layer', 'bootstrap', 'bootstrapValidator', 'ztree', 'bootstrap-table','bootstrap-table-zh-CN','deviceManu','deviceModel','domainService', 'orgService', 'orgTree', 'deviceService', 'mediaSrcService', 'dictService','gbCatalogService'],
    function (jquery, frame, topBar, common, layer, bootstrap, bootstrapValidator, ztree, bootstrapTable,bootstrapTableZhcN,deviceManu,deviceModel,domainService, orgService, orgTree, deviceService, mediaSrcService, dictService,gbCatalogService) {
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
        var domainTree = {};
        domainTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
                },
                key: {
                    name: "name"
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    if (treeNode.type && treeNode.type === 'org') {
                        domainTree.selOrg=treeNode;
                        if(domainTree.selDomain){
                            domainTree.selDomain=null;
                        }
                    } else {
                        domainTree.selDomain = treeNode;
                        if(domainTree.selOrg){
                            domainTree.selOrg=null;
                        }
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    domainTree.obj.removeChildNodes(treeNode);
                    //如果节点是组织，获取组织下的子组织
                    if (treeNode.type && treeNode.type === 'org') {
                        //获得组织下的子组织
                        orgService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/org.png";
                                        data.data[i].type = 'org';
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            }
                        })
                    } else {
                        //判断域下是否有组织
                        domainService.getDomainOrg(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        //根据组织code查找组织名称 TODO:修改
                                        orgService.getOrgByCode(data.data[i].orgCode, function (orgData) {
                                            if (orgData.result) {
                                                data.data[i].isParent = true;
                                                data.data[i].icon = "../img/org.png";
                                                data.data[i].name = orgData.data.name;
                                                data.data[i].parentCode = orgData.data.parentCode;
                                                data.data[i].createTime = orgData.data.createTime;
                                                data.data[i].creatorId = orgData.data.creatorId;
                                                data.data[i].description = orgData.data.description;
                                                data.data[i].type = 'org';
                                                data.data[i].code = data.data[i].orgCode;
                                            } else {
                                                layer.msg('获取组织节点失败');
                                            }
                                        })
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得组织节点失败')
                            }
                        })
                        domainService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/domain.png";
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得子域节点失败')
                            }
                        })
                    }
                }
            }
        };
        domainTree.zNode = function () {
            var treeNode;
            domainService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/domain.png";
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        domainTree.init = function () {
            domainTree.obj = $.fn.zTree.init($("#orgTree"), domainTree.setting, domainTree.zNode());
        }
        domainTree.init();
        /********************************* 字典项查询 ***************************************/
        var dict={};
        dict.init=function (dictCode,selectId) {
            dictService.getChildList(dictCode,function (data) {
                if(data.result){
                    if(data.dataSize>0){
                        for (var i = 0; i < data.dataSize; i++) {
                            $(selectId).append('<option value="' + data.data[i].dictCode + '">' + data.data[i].dictName + '</option>');
                        }
                    }
                }
            })
        }
        /********************************* 设备类型下拉框查询 ***************************************/
        dict.init('1','.deviceType');
        /********************************* 网关下拉框 ***************************************/
        gbCatalogService.getGB28181AMGCode(function (data) {
            if(data.result){
                if (data.dataCount > 0) {
                    for (var i = 0; i < data.dataCount; i++) {
                        $('#getWay').append('<option value="' + data.data[i].deviceId + '">' + data.data[i].name + '</option>');
                    }
                }
            }
        })
        /********************************* 设备厂商下拉框 ***************************************/
        var page={
            pageNumber:1,
            pageSize:1000
        }
        deviceManu.getManuList(page,function (data) {
            if(data.result){
                if (data.extra > 0) {
                    for (var i = 0; i < data.extra; i++) {
                        $('.deviceManu').append('<option value="' + data.data[i].id + '">' + data.data[i].manuName + '</option>');
                    }
                }
            }
        })
        /********************************* 设备型号下拉框 ***************************************/
        var page={
            pageNumber:1,
            pageSize:1000
        }
        deviceModel.getModelList(page,function (data) {
            if(data.result){
                if (data.extra > 0) {
                    for (var i = 0; i < data.extra; i++) {
                        $('.deviceModel').append('<option value="' + data.data[i].id + '">' + data.data[i].modelName + '</option>');
                    }
                }
            }
        })
        /********************************* 主设备表格 ***************************************/
        var deviceTable={};
        deviceTable.init=function(){
            var queryUrl=common.host+"/mgc"+"/deviceInfoService"+"/getDeivceInfoList";
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
                    field: 'devicePwd',
                    title: '登录密码',
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
                        var icons = "<button id='edit_btn' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>修改</button>"
                        return icons;
                    }
                }],
                url:queryUrl,
                method:'GET',
                cache:false,
                pagination:true,
                sidePagination:'server',
                pageNumber:1,
                pageSize:10,
                pageList:[10,20,30],
                smartDisplay:false,
                search:true,
                trimOnSearch:true,
                showRefresh:false,
                queryParamsType:'',
                responseHandler:function(res){
                    var rows=res.data;
                    var total=res.extra;
                    return{
                        "rows":rows,
                        "total":total
                    }
                },
                queryParams:function (params) {
                    var temp={
                        page: JSON.stringify({
                            pageNumber: params.pageNumber,
                            pageSize: params.pageSize
                        }),
                        name:params.searchText
                    }
                    return temp
                }
            })
        }
        deviceTable.init();
        //初始化表格高度
        $('#device_table').bootstrapTable('resetView', {height: $(window).height() - 165});
        //自适应表格高度
        common.resizeTableDH('#device_table');
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
                    typeCode: {
                        validators: {
                            notEmpty: {
                                message: '设备类型不能为空'
                            }
                        }
                    },
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
                            },
                            regexp: {
                                regexp: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
                                message: 'ip地址格式不正确'
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
                    }, modelId: {
                        validators: {
                            notEmpty: {
                                message: '设备型号不能为空'
                            }
                        }
                    }, manuId: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商不能为空'
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
                device.deviceCode='-1';
                var parentCode = $('select[name="parentCode"]').val();
                var orgCode = $('input[name="orgCode"]').val();
                var dictCode = '-1';
                var typeCode = $('select[name="typeCode"]').val();
                deviceService.addDeviceInfo(device, orgCode, parentCode, typeCode, dictCode, function (data) {
                    if (data.result) {
                        //向表格中添加
                        device.id = data.data;
                        common.clearForm('DeviceForm');
                        //关闭弹窗
                        layer.closeAll();
                        //刷新表格
                        $('#device_table').bootstrapTable('refresh', {silent: true});
                        deviceAdd.isClick=false;
                    } else {
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        deviceAdd.isClick=false;
        deviceAdd.init = function () {
            $('#addDevice').click(function () {
                if (domainTree.selOrg) {
                    //开启弹窗
                    $('input[name="orgName"]').val(domainTree.selOrg.name)
                    $('input[name="orgCode"]').val(domainTree.selOrg.code)
                    var layerId = layer.open({
                        type: 1,
                        skin: 'layui-layer-lan',
                        resize: false,
                        area: ['620px', '395px'],
                        scrollbar: false,
                        offset: '100px',
                        title: '添加设备',
                        content: $('#add_device'),
                        cancel: function (index, layero) {
                            common.clearForm('DeviceForm');
                            deviceAdd.isClick=false;
                        }
                    })
                    if(!deviceTable.isClick){
                        //开启验证
                        deviceAdd.valiadator();
                        //表单提交
                        deviceAdd.submit();
                        deviceTable.isClick=true;
                    }
                } else {
                    layer.msg('请选择左侧组织')
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('DeviceForm');
                deviceTable.isClick=false;
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
                    },
                    editModelId: {
                        validators: {
                            notEmpty: {
                                message: '设备型号不能为空'
                            }
                        }
                    },
                    editManuId: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商不能为空'
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
                        deviceEdit.isClick=false;
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        deviceEdit.isClick=false;
        deviceEdit.init = function (row, index) {
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
                area: ['620px', '355px'],
                scrollbar: false,
                offset: '100px',
                title: '修改设备',
                content: $('#edit_device')
            })
            if(!deviceEdit.isClick){
                //启用校验
                deviceEdit.valia();
                //表单提交
                deviceEdit.submit(row, index, layerId)
                deviceEdit.isClick=true;
            }
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
                                var pageCount = deviceTable.page.count - data.dataCount
                                common.pageInit(deviceTable.page.pageNumber, deviceTable.page.pageSize, pageCount);
                                deviceTable.page.count = pageCount;
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
                title: '关联设备',
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
                var deviceCode = $('input[name="deviceSrcCode"]').val();
                var typeCode = $('select[name="srcTypeCode"]').val();
                mediaSrcService.addMediaSrcsList(deviceConId, uriNum, deviceName, deviceId, deviceCode, typeCode, function (data) {
                    if (data.result) {
                        //清空表格
                        common.clearForm('addMediaForm');
                        layer.closeAll();
                        layer.msg('添加到通道成功!');
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
        var mediaTable = {};
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
    })