require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery', 'bootstrap-table'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: "bootstrap"
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'bootstrap-treeview': {
            deps: ['bootstrap', 'jquery'],
            exports: 'bootstrapTreeView'
        },
        'deviceInfoService': {
            deps: ['common'],
            exports: 'deviceInfoService'
        },
        'deviceTypeService': {
            deps: ['common'],
            exports: 'deviceTypeService'
        },
        'jquery-slimScroll':{
            deps:['jquery']
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "deviceInfoService": "../../common/js/service/DeviceInfoController",
        "deviceTypeService": "../../common/js/service/DeviceTypeController",
        "jquery-slimScroll":"../../common/libs/jquery-slimScroll/jquery.slimscroll.min"
    }
});
require(['jquery','common','layer','frame', 'bootstrap-table','jquery-slimScroll','bootstrapValidator', 'bootstrap-treeview', 'deviceInfoService', 'deviceTypeService', 'common','topBar'],
    function (jquery,common,layer,frame, bootstrapTable,slimScroll,bootstrapValidator, bootstrapTreeView, deviceInfoService, deviceTypeService, common,topBar) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../common/libs/layer/'
        });
        //初始化表格
        var init_page = {
            pageNumber: 1,
            pageSize: 10,
            parameter: {}
        }
        deviceInfoService.getDeviceInfoList(init_page, function (data) {
            if (data.result) {
                $('#device_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'id',
                        title: '编码设备序号',
                        visible:false,
                        align: 'center'
                    }, {
                        field: 'deviceName',
                        title: '设备名称',
                        align: 'center'
                    }, {
                        field: 'devTypeName',
                        title: '设备类型',
                        align: 'center'
                    }, {
                        field: 'deviceAddress',
                        title: '安装地址',
                        align: 'center'
                    }, {
                        field: 'deviceOnlineStatus',
                        title: '在线状态',
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
                        title: '设备登录用户名',
                        align: 'center'
                    }, {
                        field: 'modelIdentity',
                        title: '设备型号',
                        align: 'center'
                    }, {
                        field: 'manuIdentity',
                        title: '设备厂商',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        formatter: function () {
                            var icons = "<div class='btn-group-sm'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data:data.data
                })
                //初始化分页组件
                common.pageInit(init_page.pageNumber,init_page.pageSize,data.extra)
            }
        })
        //改变页面展示数据条数
        $('li[role="menuitem"]>a').click(function () {
            init_page.pageSize=$(this).html();
            $('.page-size').html($(this).html());
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            deviceInfoService.getDeviceInfoList(init_page,function (data) {
                if(data.result){
                    $('#device_table').bootstrapTable('load',data.data);
                    //清除
                    $('.pagination>li').each(function () {
                        if($(this).children().html()>1){
                            $(this).remove();
                        }
                    })
                    //初始化分页组件
                    common.pageInit(init_page.pageNumber,init_page.pageSize,data.extra)
                }
            })
        })
        //点击上一页
        $('.page-pre>a').click(function () {
            if(init_page.pageNumber>1){
                init_page.pageNumber--;
                deviceInfoService.getDeviceInfoList(init_page,function (data) {
                    if(data.result){
                        $('#device_table').bootstrapTable('load',data.data);
                    }
                })
            }
        })
        //点击下一页
        $('.page-next>a').click(function () {
            var pageNum=$('.page-next').prev().children().html();
            if(init_page.pageNumber<pageNum){
                init_page.pageNumber++;
                deviceInfoService.getDeviceInfoList(init_page,function (data) {
                    if(data.result){
                        $('#device_table').bootstrapTable('load',data.data);
                    }
                })
            }
        })
        //跳转到指定的页面
        $('.pNo>a').click(function () {
            alert("aa")
            //得到跳转的页码
            var pnum=$(this).html();
            alert(pnum)
            init_page.pageNumber=pnum;
            //跳转到指定的页面
            deviceInfoService.getDeviceInfoList(init_page,function (data) {
                if(data.result){
                    $('#device_table').bootstrapTable('load',data.data);
                }
            })
        })
        //初始化设备树
        var page_temp_type = {
            pageSize: 999,
            pageNumber: 1
        };
        deviceTypeService.getTypeTreeList(page_temp_type, function (data) {
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
                $("#device_tree").treeview({
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
                        init_page.deviceTypeIndex = data.id;
                        init_page.pageNumber = 1;
                        $('#device_table').bootstrapTable('destroy')
                        loadTable();
                    }
                })
            }
        })
        //设备树滚动条
        /*$('.slimscrollleft').slimScroll({
            height:common.height
        })*/
        //表单验证
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
        //添加设备
        $('#add_device').click(function () {
            layer.open({
                type: 1,
                offset: '100px',
                area: '600px',
                resize: false,
                title: '新增设备窗口',
                content: $('#add_dev_form')
            })
        })

        function onCloseWindow() {
            layer.closeAll();
        }
        //关闭弹窗
        $('#doCancel').click(function () {
            onCloseWindow();
        });
        //表单提交
        $('#add_dev_form').on('success.form.bv', function (e) {
            var formInfo = {};
            formInfo.deviceName = $("input[name='cDeviceName']").val();
            formInfo.deviceAddress = $("input[name='cDeviceAddress']").val();
            formInfo.deviceOnlineStatus = "ON";
            formInfo.deviceIp = $("input[name='cDeviceIp']").val();
            formInfo.amgPort = $("input[name='cAmgPort']").val();
            formInfo.amgProto = $("input[name='cAmgProto']").val();
            formInfo.adgPort = $("input[name='cAdgPort']").val();
            formInfo.adgProto = $("input[name='cAdgProto']").val();
            formInfo.deviceChaNum = $("input[name='iDeviceChaNum']").val();
            formInfo.deviceUser = $("input[name='cDeviceUser']").val();
            formInfo.devicePwd = $("input[name='cDevicePwd']").val();
            var para_cModelId = $("input[name='cModelId']").val();
            var para_cManuId = $("input[name='cManuId']").val();
            deviceInfoService.existInfoName(formInfo.deviceName, function (data) {
                if (data.data) {
                    layer.msg('设备名' + formInfo.deviceName + '已存在')
                } else {
                    var re_password = $("input[name='re_cDevicePwd']").val();
                    if (formInfo.devicePwd != re_password) {
                        layer.msg('两次输入的密码不一致，请重新输入')
                    } else {
                        deviceInfoService.addDeviceInfo(formInfo, para_cModelId, para_cManuId, function (data) {
                            if (data.result) {
                                $('#device_table').bootstrapTable('refresh');
                                layer.msg(data.description)
                            } else {
                                layer.msg(data.description)
                            }
                            onCloseWindow();
                        })
                    }
                }
            })
            return false;
        })
    })
