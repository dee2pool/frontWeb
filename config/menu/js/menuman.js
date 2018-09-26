require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
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
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'MenuService', 'bootstrap-table', 'bootstrapValidator', 'bootstrap', 'topBar'],
    function (jquery, common, layer, frame, MenuService, bootstrapTable, bootstrapValidator, bootstrap, topBar) {
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
        /********************************* 添加菜单 ***************************************/
        var menuAdd = {};
        //验证
        menuAdd.valia = function () {
            $('#addMpanel').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    Menuname: {
                        validators: {
                            notEmpty: {
                                message: '菜单名称不能为空'
                            }
                        }
                    }, MenuorderNo: {
                        validators: {
                            numeric: {
                                message: '菜单展示序号只能为数字'
                            },
                            notEmpty: {
                                message: '菜单展示序号不能为空'
                            }
                        }
                    }
                }
            })
        }
        //下拉框
        menuAdd.initSele = function () {
            $('select[name="MenuparentId"]>option[value!="-1"]').remove();
            MenuService.getMenuListByParentId('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.data.length; i++) {
                        $('select[name="MenuparentId"]').append('<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>')
                    }
                }
            })
        }
        //提交
        menuAdd.submit = function (layerId) {
            $('#addMpanel').on('success.form.bv', function () {
                var menu = {};
                menu.name = $("input[name='Menuname']").val();
                menu.parentId = $("select[name='MenuparentId']").val();
                menu.url = $("input[name='Menuurl']").val();
                menu.remark = $("textarea[name='Menuremark']").val();
                menu.orderNo = $("input[name='MenuorderNo']").val();
                MenuService.addMenu(menu, function (data) {
                    if (data.result) {
                        menu.id = data.data;
                        if (menu.parentId == '-1') {
                            $('#menu_table').bootstrapTable('append', menu);
                        }
                        layer.closeAll();
                        layer.msg('添加成功');
                        common.clearForm("addMpanel");
                    } else {
                        layer.msg('添加失败')
                    }
                })
                return false;
            })
        }
        menuAdd.init = function () {
            $('#addMenu').click(function () {
                //启用验证
                menuAdd.valia();
                menuAdd.initSele();
                //开启弹窗
                var layerId = layer.open({
                    type: 1,
                    area: '380px',
                    scrollbar: false,
                    offset: '100px',
                    title: '添加菜单',
                    content: $('#addMpanel')
                })
                //表单提交
                menuAdd.submit(layerId);
            })
        }
        menuAdd.init();
        /********************************* 修改菜单 ***************************************/
        var menuEdit = {};
        menuEdit.valia = function () {
            $('#editMpanel').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    edit_Mname: {
                        validators: {
                            notEmpty: {
                                message: '菜单名称不能为空'
                            }
                        }
                    }, edit_Mno: {
                        validators: {
                            numeric: {
                                message: '菜单展示序号只能为数字'
                            },
                            notEmpty: {
                                message: '菜单展示序号不能为空'
                            }
                        }
                    }
                }
            })
        }
        menuEdit.submit = function (row, index, layerId) {
            $('#editMpanel').on('success.form.bv', function () {
                var menu = {};
                menu.name = $("input[name='edit_Mname']").val();
                menu.url = $("input[name='edit_Murl']").val();
                menu.orderNo = $("input[name='edit_Mno']").val();
                menu.remark = $("textarea[name='edit_Mremark']").val();
                menu.id = $("input[name='edit_Mid']").val();
                MenuService.updateMenuById(menu.id, menu, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        layer.msg('修改菜单成功')
                        if (row.parentId == '-1') {
                            $('#menu_table').bootstrapTable('updateRow', {index: index, row: menu});
                        }
                        $("button[type='submit']").removeAttr('disabled');
                        //清空验证
                        $("#editMpanel").data('bootstrapValidator').destroy();
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        menuEdit.init = function (row, index) {
            menuEdit.valia();
            $("input[name='edit_Mid']").val(row.id);
            $("input[name='edit_Mname']").val(row.name);
            $("input[name='edit_Murl']").val(row.url);
            $("input[name='edit_Mno']").val(row.orderNo);
            $("textarea[name='edit_Mremark']").val(row.remark);
            var layerId = layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '修改菜单',
                content: $('#editMpanel')
            })
            menuEdit.submit(row, index, layerId);
        }
        /********************************* 删除菜单 ***************************************/
        var menuDel = {};
        menuDel.init = function (row) {
            layer.confirm('确定删除 ' + row.name + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                MenuService.deleteMenuById(row.id, function (data) {
                    if (data.result) {
                        $('#menu_table').bootstrapTable('remove', {
                            field: 'id',
                            values: [row.id]
                        })
                        layer.closeAll();
                    } else {
                        layer.msg(data.description)
                    }
                })
                //删除操作
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 菜单表格 ***************************************/
        var menuTable = {};
        menuTable.init = function (pId, tableId) {
            MenuService.getMenuListByParentId(pId, function (data) {
                if (data.result) {
                    $(tableId).bootstrapTable({
                        columns: [{
                            field: 'id',
                            visible: false
                        }, {
                            field: 'name',
                            title: '菜单名称',
                            align: 'center'
                        }, {
                            field: 'url',
                            title: '菜单URL',
                            align: 'center'
                        }, {
                            field: 'parentId',
                            title: '上级菜单编号',
                            align: 'center'
                        }, {
                            field: 'orderNo',
                            title: '菜单展示序号',
                            align: 'center'
                        }, {
                            field: 'remark',
                            title: '备注',
                            align: 'center'
                        }, {
                            title: '操作',
                            align: 'center',
                            events: {
                                "click #edit_btn": function (e, value, row, index) {
                                    //点击编辑按钮
                                    menuEdit.init(row, index);
                                },
                                "click #del_btn": function (e, value, row, index) {
                                    //点击删除按钮
                                    menuDel.init(row);
                                }
                            },
                            formatter: function () {
                                var icons = "<div class='btn-group'><button id='edit_btn' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                    "<button id='del_btn' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                    "</div>"
                                return icons;
                            }
                        }],
                        data: data.data,
                        detailView: true,
                        onExpandRow: function (index, row, $detail) {
                            var t = $detail.html('<table></table>').find('table');
                            menuTable.init(row.id, t);
                        }
                    })
                }
            })
        }
        menuTable.init('-1', '#menu_table');
    })