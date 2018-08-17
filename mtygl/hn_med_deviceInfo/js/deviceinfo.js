var deviceInfoController = DeviceInfoController();
var deviceTypeController = DeviceTypeController();
/*var deviceModeController= DeviceModelController();
var manufacture=DeviceManufacturerController();*/

$(function () {
    //初始化设备表格
    var tableObj = new deviceTable();
    tableObj.init();
    //初始化设备类型树
    var treeObj = new deviceTree("device_tree");
    //添加设备
    var addObj = new addDevice();
    addObj.init();
    //修改设备
    var editObj=new editTable("device_table");
})
init_page={
    pageNumber:1,
    pageSize:10,
    parameter:{}
}
//初始化表格
function loadTable() {
    deviceInfoController.getDeviceInfoList(init_page,function (data) {
        if(data.result){
            common.loadTableData(init_page,data,"device_table");
        }
    });
}
//设备表格
var deviceTable = function () {
    var tableInit = new Object();
    tableInit.init = loadTable;
    return tableInit;
}
//切换页面
function changePage(page) {
    init_page.pageNumber=$(page).html();
    $('#device_table').bootstrapTable('destroy')
    loadTable();
    return false;
}
//设备类型树
var deviceTree = function (treeId) {
    var page_temp_type = {
        pageSize: 999,
        pageNumber: 1
    };
    deviceTypeController.getTypeTreeList(page_temp_type, function (data) {
        if (data.result) {
            var nodes = [];
            for (var i = 0; i < data.data.length; i++) {
                var node = {id: data.data[i].devTypeIndex, text: data.data[i].devTypeName};
                nodes.push(node)
            }
            var devTree = [{
                id: -1,
                text: "设备类型",
                nodes: nodes
            }]
            $("#" + treeId).treeview({
                data: devTree,
                collapseIcon: 'glyphicon glyphicon-folder-open',
                expandIcon: 'glyphicon glyphicon-folder-close',
                emptyIcon: 'glyphicon glyphicon-tasks',
                onNodeSelected: function (event, data) {
                    if (data.id == -1) {
                        data.id = "";
                    }
                    /*//根据设备类型刷新表格数据
                    $('#device_table').bootstrapTable('refresh', {query: {deviceTypeIndex: data.id}})*/
                    init_page.deviceTypeIndex=data.id;
                    init_page.pageNumber=1;
                    $('#device_table').bootstrapTable('destroy')
                    loadTable();
                }
            })
        }
    })
}

//添加设备
var addDevice = function () {
    function openInit() {

    }

    function openWindow() {
        layer.open({
            type: 1,
            skin: 'layui-layer-rim',
            area: ['30%','85%'],
            scrollbar: false,
            title: '新增设备窗口',
            content: $('#add_dev_form')
        })
    }
    
    function onCloseWindow() {
        layer.closeAll();
    }
    
    function initValidator() {
        $('#add_dev_form').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                cDeviceName: {
                    validators: {
                        notEmpty: {
                            message: '设备名称不能为空'
                        }
                    }
                },
                cDeviceAddress: {
                    validators: {
                        notEmpty: {
                            message: '设备信息安装地址不能为空'
                        }
                    }
                },
                cDeviceIp: {
                    validators: {
                        notEmpty: {
                            message: '设备IP地址不能为空'
                        },
                        ip: {
                            message: 'IP地址格式有误'
                        }
                    }

                },
                cAmgPort: {
                    validators: {
                        notEmpty: {
                            message: '拉流服务端口不能为空'
                        },
                        numberic: {
                            message: '端口必须为数字'
                        }
                    }
                },
                cAdgPort: {
                    validators: {
                        notEmpty: {
                            message: '运维端口不能为空'
                        },
                        numberic: {
                            message: '端口必须为数字'
                        }
                    }
                },
                cDeviceUser: {
                    validators: {
                        notEmpty: {
                            message: '设备登录用户名不能为空'
                        }
                    }
                },
                cDevicePwd: {
                    validators: {
                        notEmpty: {
                            message: '设备登录密码不能为空'
                        }
                    }
                },
                re_cDevicePwd: {
                    validators: {
                        notEmpty: {
                            message: '请输入确认密码'
                        }
                    }
                }
            }

        });
    }

    var obj = {
        openAwin: function () {
            openWindow();
        },
        cancelAct:function(){
          onCloseWindow();
        },
        initVal: function () {
            initValidator();
        },
        init: function () {
            $('#add_device').click(function () {
                obj.openAwin();
                obj.initVal();
            });
            $('#doCancel').click(function () {
               obj.cancelAct();
            });
            $('#add_dev_form').on('success.form.bv',function (e) {
                var formInfo={};
                formInfo.deviceName=$("input[name='cDeviceName']").val();
                formInfo.deviceAddress=$("input[name='cDeviceAddress']").val();
                formInfo.deviceOnlineStatus="ON";
                formInfo.deviceIp=$("input[name='cDeviceIp']").val();
                formInfo.amgPort=$("input[name='cAmgPort']").val();
                formInfo.amgProto=$("input[name='cAmgProto']").val();
                formInfo.adgPort=$("input[name='cAdgPort']").val();
                formInfo.adgProto=$("input[name='cAdgProto']").val();
                formInfo.deviceChaNum=$("input[name='iDeviceChaNum']").val();
                formInfo.deviceUser=$("input[name='cDeviceUser']").val();
                formInfo.devicePwd=$("input[name='cDevicePwd']").val();
                var para_cModelId=$("input[name='cModelId']").val();
                var para_cManuId=$("input[name='cManuId']").val();
                deviceInfoController.existInfoName(formInfo.deviceName,function (data) {
                    if(data.data){
                        layer.msg('设备名'+formInfo.deviceName+'已存在')
                    }else{
                        var re_password=$("input[name='re_cDevicePwd']").val();
                        if(formInfo.devicePwd!=re_password){
                            layer.msg('两次输入的密码不一致，请重新输入')
                        }else{
                            deviceInfoController.addDeviceInfo(formInfo,para_cModelId,para_cManuId,function (data) {
                                if(data.result){
                                    $('#device_table').bootstrapTable('refresh');
                                    layer.msg(data.description)
                                }else{
                                    layer.msg(data.description)
                                }
                                onCloseWindow();
                            })
                        }
                    }
                })
                return false;
            })
        }
    }
    return obj;
}

var editTable=function (tableId) {

}