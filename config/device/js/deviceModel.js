require.config({
    shim: {
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
            exports: "bootstrapTableZhcN"
        },
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
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
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../../common/js/service/MenuController",
        "buttons": "../../common/js/buttons",
        "deviceModelService": "../../../common/js/service/DeviceModelController",
        "manufacturerService": "../../../common/js/service/DeviceManufacturerController",
        "dictService": "../../../common/js/service/dictController"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'bootstrapValidator', 'topBar', 'buttons', 'deviceModelService','manufacturerService','dictService'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap, bootstrapValidator, topBar, buttons, deviceModelService,manufacturerService,dictService) {
        /********************************* 页面初始化 ***************************************/
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 设备型号表格 ***************************************/
        var deviceModelTable = {};
        deviceModelTable.init = function () {
            var queryUrl = common.host + "/mgc/deviceModelService/getModelList";
            $('#deviceModel_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'id',
                    visible: false
                }, {
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'modelName',
                    title: '型号名称',
                    align: "center"
                }, {
                    field: 'modelIdentity',
                    title: '型号标识',
                    align: "center"
                }, {
                    field: 'devTypeName',
                    title: '设备类型',
                    align: "center"
                }, {
                    field: 'manuName',
                    title: '设备厂商',
                    align: "center"
                }, {
                    field: 'modelDesc',
                    title: '描述',
                    align: "center"
                }, {
                    title: '操作',
                    align: "center",
                    events: {
                        "click #edit": function (e, value, row, index) {
                            dmEdit.init(row,index)
                        },
                        "click #del": function (e, value, row, index) {
                            dmDel.init(row)
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'><button id='edit' type='button' class='button button-tiny button-highlight'>" +
                            "<i class='fa fa-edit'></i>修改</button>" +
                            "<button id='del' type='button' class='button button-tiny button-caution'><i class='fa fa-remove'></i>刪除</button>" +
                            "</div>"
                        return icons;
                    }
                }],
                url: queryUrl,
                method: 'GET',
                cache: false,
                pagination: true,
                sidePagination: 'server',
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 20, 30],
                smartDisplay: false,
                showRefresh: true,
                queryParamsType: '',
                responseHandler: function (res) {
                    var rows = res.data;
                    var total = res.extra;
                    return {
                        "rows": rows,
                        "total": total
                    }
                },
                queryParams: function (params) {
                    var temp = {
                        page: JSON.stringify({
                            pageNumber: params.pageNumber,
                            pageSize: params.pageSize
                        })
                    }
                    return temp
                }
            })
        }
        deviceModelTable.init();
        //初始化表格高度
        $('#deviceModel_table').bootstrapTable('resetView', {height: $(window).height() - 165});
        //自适应表格高度
        common.resizeTableDH('#deviceModel_table');
        /********************************* 设备厂商下拉框 ***************************************/
        var page={
            pageNumber:1,
            pageSize:1000
        }
        manufacturerService.getManuList(page,function (data) {
            if(data.result){
                if (data.extra > 0) {
                    for (var i = 0; i < data.extra; i++) {
                        $('select[name="dmmanu"]').append('<option value="' + data.data[i].id + '">' + data.data[i].manuName + '</option>');
                    }
                }
            }
        })
        /********************************* 设备类型下拉框 ***************************************/
        dictService.getChildList('1',function (data) {
            if(data.result){
                if(data.dataSize>0){
                    for (var i = 0; i < data.dataSize; i++) {
                        $('select[name="dmtype"]').append('<option value="' + data.data[i].dictCode + '">' + data.data[i].dictName + '</option>');
                    }
                }
            }
        })
        /********************************* 添加设备型号 ***************************************/
        var dmAdd = {};
        dmAdd.valia = function () {
            $('#addform').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    dmname: {
                        validators: {
                            notEmpty: {
                                message: '设备型号名称不能为空'
                            }
                        }
                    },
                    dmiden: {
                        validators: {
                            notEmpty: {
                                message: '设备型号标识不能为空'
                            }
                        }
                    },
                    dmtype: {
                        validators: {
                            notEmpty: {
                                message: '设备类型不能为空'
                            }
                        }
                    },
                    dmmanu: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商不能为空'
                            }
                        }
                    }
                }
            })
        }
        dmAdd.submit = function () {
            $('#addform').on('success.form.bv', function () {
                    var dm={};
                    var manuId=$('select[name="dmmanu"]').val();
                    dm.modelName=$('input[name="dmname"]').val();
                    dm.modelIdentity=$('input[name="dmiden"]').val();
                    dm.modelDesc=$('input[name="dmremark"]').val();
                    dm.deviceType=$('select[name="dmtype"]').val();
                    deviceModelService.addDeviceModel(dm,manuId,function (data) {
                        if(data.result){
                            common.clearForm('addform');
                            layer.closeAll();
                            layer.msg('添加成功');
                            //刷新表格
                            $('#deviceModel_table').bootstrapTable('refresh', {silent: true});
                        }else{
                            layer.msg(data.description);
                            $("button[type='submit']").removeAttr('disabled');
                        }
                    })
                    return false;
                })
        }
        dmAdd.init = function () {
            $('#addModel').click(function () {
                //启用校验
                dmAdd.valia();
                //打开弹窗
                layer.open({
                    type: 1,
                    title: '添加设备厂商',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_deviceModel')
                })
                //表单提交
                dmAdd.submit();
            })
        }
        dmAdd.init();
        /********************************* 修改设备型号 ***************************************/
        //TODO 设备厂商 设备型号
        var dmEdit = {};
        dmEdit.valia = function () {
            $('#editform').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    edmname: {
                        validators: {
                            notEmpty: {
                                message: '型号不能为空'
                            }
                        }
                    },
                    edmiden: {
                        validators: {
                            notEmpty: {
                                message: '型号标识不能为空'
                            }
                        }
                    },
                    dmtype: {
                        validators: {
                            notEmpty: {
                                message: '设备类型不能为空'
                            }
                        }
                    },
                    dmmanu: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商不能为空'
                            }
                        }
                    }
                }
            })
        }
        dmEdit.submit = function (row, index) {
            $('#editform').on('success.form.bv',function () {
                var dm = {};
                dm.id = row.id;
                dm.modelName = $('input[name="edmname"]').val();
                dm.modelIdentity = $('input[name="edmiden"]').val();
                dm.deviceType = $('select[name="dmtype"]').val();
                dm.manuId = $('select[name="dmmanu"]').val();
                dm.modelDesc = $('textarea[name="edmremark"]').val();
                deviceModelService.updateDeviceModel(dm, function (data) {
                    if (data.result) {
                        //修改表格
                        $('#deviceModel_table').bootstrapTable('updateRow', {index: index, row: dm});
                        common.clearForm('editform');
                        layer.closeAll();
                        layer.msg('修改成功');
                    } else {
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        dmEdit.init = function (row, index) {
            //启用校验
            dmEdit.valia();
            //填充表单
            $('input[name="edmname"]').val(row.modelName);
            $('input[name="edmiden"]').val(row.modelIdentity);
            $('select[name="dmtype"]').val(row.devTypeName);
            $('select[name="dmmanu"]').val(row.manuName);
            $('textarea[name="edmremark"]').val(row.modelDesc);
            //打开弹窗
            layer.open({
                type: 1,
                title: '修改设备型号',
                skin: 'layui-layer-lan',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#edit_deviceModel')
            })
            //表单提交
            dmEdit.submit(row, index);
        }
        /********************************* 删除设备型号 ***************************************/
        var dmDel = {};
        dmDel.init = function (row) {
            //点击删除按钮
            layer.confirm('确定删除 ' + row.modelName + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                //删除操作
                deviceModelService.deleteDeviceModel(row.id, function (data) {
                    if (data.result&&data.dataCount == 1) {
                        $('#deviceModel_table').bootstrapTable('remove', {field: 'id', values: [row.id]});
                        layer.msg("删除成功!")
                    } else {
                        layer.msg(data.description)
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
    })