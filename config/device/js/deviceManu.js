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
        "manufacturerService": "../../../common/js/service/DeviceManufacturerController"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'bootstrapValidator', 'topBar', 'buttons', 'manufacturerService'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap, bootstrapValidator, topBar, buttons, manufacturerService) {
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
        /********************************* 设备厂商表格 ***************************************/
        var deviceManuTable = {};
        deviceManuTable.init = function () {
            var queryUrl = common.host + "/mgc/deviceManufacturerService/getManuList";
            $('#deviceManu_table').bootstrapTable({
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
                    field: 'manuName',
                    title: '厂商名称',
                    align: "center"
                }, {
                    field: 'manuIdentity',
                    title: '厂商标识',
                    align: "center"
                }, {
                    field: 'manuDesc',
                    title: '描述',
                    align: "center"
                }, {
                    title: '操作',
                    align: "center",
                    events: {
                        "click #edit": function (e, value, row, index) {
                            dmEdit.init(row, index);
                        },
                        "click #del": function (e, value, row, index) {
                            dmDel.init(row);
                        }
                    },
                    formatter: function () {
                        var icons = "<button id='edit' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>修改</button>" +
                            "<button id='del' class='btn btn-danger btn-xs'><i class='fa fa-remove'></i>删除</button>"
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
                showRefresh: false,
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
        deviceManuTable.init();
        //初始化表格高度
        $('#deviceManu_table').bootstrapTable('resetView', {height: $(window).height() - 165});
        //自适应表格高度
        common.resizeTableDH('#deviceManu_table');
        /********************************* 添加设备厂商 ***************************************/
        var dmAdd = {};
        dmAdd.valia = function () {
            $('#addform').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    manuname: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商名称不能为空'
                            }
                        }
                    },
                    manuiden: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商标识不能为空'
                            }
                        }
                    }
                }
            })
        }
        dmAdd.submit = function () {
            $('#addform').on('success.form.bv', function () {
                var dm = {};
                dm.manuName = $('input[name="manuname"]').val();
                dm.manuIdentity = $('input[name="manuiden"]').val();
                dm.manuDesc = $('textarea[name="manuremark"]').val();
                manufacturerService.addDeviceManufacturer(dm, function (data) {
                    if (data.result) {
                        common.clearForm('addform');
                        layer.closeAll();
                        layer.msg('添加成功')
                        //刷新表格
                        $('#deviceManu_table').bootstrapTable('refresh', {silent: true});
                        dmAdd.isClick=false;
                    } else {
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        dmAdd.isClick=false;
        dmAdd.init = function () {
            $('#addManu').click(function () {
                //打开弹窗
                layer.open({
                    type: 1,
                    title: '添加设备厂商',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_deviceManu'),
                    cancel: function (index, layero) {
                        common.clearForm('addform');
                        dmAdd.isClick=false;
                    }
                })
                if(!dmAdd.isClick){
                    dmAdd.valia();
                    dmAdd.submit();
                    dmAdd.isClick=true;
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('addform');
                dmAdd.isClick=false;
            })
        }
        dmAdd.init();
        /********************************* 修改设备厂商 ***************************************/
        var dmEdit = {};
        dmEdit.valia = function () {
            $('#editform').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    emanuname: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商名称不能为空'
                            }
                        }
                    },
                    emanuiden: {
                        validators: {
                            notEmpty: {
                                message: '设备厂商标识不能为空'
                            }
                        }
                    }
                }
            })
        }
        dmEdit.submit = function (row, index) {
            $('#editform').on('success.form.bv', function () {
                var dm = {};
                dm.id = row.id;
                dm.manuName = $('input[name="emanuname"]').val();
                dm.manuIdentity = $('input[name="emanuiden"]').val();
                dm.manuDesc = $('textarea[name="emanuremark"]').val();
                manufacturerService.updateDeviceManufacturer(dm, function (data) {
                    if (data.result) {
                        //修改表格
                        $('#deviceManu_table').bootstrapTable('updateRow', {index: index, row: dm});
                        common.clearForm('editform');
                        layer.closeAll();
                        layer.msg('修改成功');
                        dmEdit.isClick=false;
                    } else {
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        dmEdit.isClick=false;
        dmEdit.init = function (row, index) {
            //填充表单
            $('input[name="emanuname"]').val(row.manuName);
            $('input[name="emanuiden"]').val(row.manuIdentity);
            $('input[name="emanuremark"]').val(row.manuDesc);
            //打开弹窗
            layer.open({
                type: 1,
                title: '修改设备厂商',
                skin: 'layui-layer-lan',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#edit_deviceManu')
            })
            if(!dmEdit.isClick){
                //启用校验
                dmEdit.valia();
                //表单提交
                dmEdit.submit(row, index);
                dmEdit.isClick=true;
            }
        }
        /********************************* 删除设备厂商 ***************************************/
        var dmDel = {};
        dmDel.init = function (row) {
            //点击删除按钮
            layer.confirm('确定删除 ' + row.manuName + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                //删除操作
                manufacturerService.deleteDeviceManufacturerByids(row.id, function (data) {
                    if (data.result&&data.dataCount == 1) {
                        $('#deviceManu_table').bootstrapTable('remove', {field: 'id', values: [row.id]});
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