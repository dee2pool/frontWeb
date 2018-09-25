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
        "RoleService": "../../common/js/service/RoleController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
    }
});
require(['jquery', 'layer', 'frame', 'MenuService', 'bootstrap-table', 'bootstrapValidator', 'bootstrap', 'topBar'],
    function (jquery, layer, frame, MenuService, bootstrapTable, bootstrapValidator, bootstrap, topBar) {
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
        var parentMenu;
        MenuService.getMenuListByParentId('-1', function (data) {
            if (data.result) {
                parentMenu = data.data;
                $('#menu_table').bootstrapTable({
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
                            "click #edit_role": function (e, value, row, index) {
                                //点击编辑按钮
                                menuOpera.editMenu(row);
                                menuOpera.formValia();
                                menuOpera.formSub(index);
                            },
                            "click #del_role": function (e, value, row, index) {
                                //点击删除按钮
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
                        },
                        formatter: function () {
                            var icons = "<div class='btn-group'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data: data.data,
                    detailView: true,
                    onExpandRow: function (index, row, $detail) {
                        var t = $detail.html('<table></table>').find('table');
                        MenuService.getMenuListByParentId(row.id, function (data) {
                            if (data.result) {
                                $(t).bootstrapTable({
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
                                    },{
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
                                            "click #edit_role": function (e, value, row, index) {
                                                //点击编辑按钮
                                                menuOpera.editMenu(row);
                                                menuOpera.formValia();
                                                menuOpera.formSub(index);
                                            },
                                            "click #del_role": function (e, value, row, index) {
                                                //点击删除按钮
                                                layer.confirm('确定删除 ' + row.name + ' ?', {
                                                    btn: ['确定', '取消'] //按钮
                                                }, function () {
                                                    //删除操作
                                                    MenuService.deleteMenuById(row.id, function (data) {
                                                        if (data.result) {
                                                            layer.msg('删除成功!');
                                                            layer.closeAll();
                                                        } else {
                                                            layer.msg(data.description)
                                                        }
                                                    })
                                                }, function () {
                                                    layer.closeAll();
                                                });
                                            }
                                        },
                                        formatter: function () {
                                            var icons = "<div class='btn-group'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                                "</div>"
                                            return icons;
                                        }
                                    }],
                                    data: data.data
                                })
                            }
                        })
                    }
                })
            }
        })
        //菜单表单验证
        var menuValia={};
        menuValia.addValia=function(){
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
        //添加菜单弹窗
        $('#addMenu').click(function () {
            //启用验证
            menuValia.addValia();
            $('select[name="MenuparentId"]>option[value!="-1"]').remove();
            for (var i = 0; i < parentMenu.length; i++) {
                $('select[name="MenuparentId"]').append('<option value="' + parentMenu[i].id + '">' + parentMenu[i].name + '</option>')
            }
            layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '添加菜单',
                content: $('#addMpanel')
            })
            //添加菜单表单提交
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
                        if(menu.parentId=='-1'){
                            $('#menu_table').bootstrapTable('append', menu);
                        }
                        layer.closeAll();
                        //表单清空
                        $("input[name='res']").click();
                        //清空验证
                        $("#addMpanel").data('bootstrapValidator').destroy();
                        //重新启用验证
                        menuValia.addValia();
                    }else{
                        layer.msg('添加失败')
                    }
                })
                return false;
            })
        })
        //修改菜单提交
        var menuOpera = {};
        menuOpera.editMenu = function (row) {
            $("input[name='edit_Mid']").val(row.id);
            $("input[name='edit_Mname']").val(row.name);
            $("input[name='edit_Murl']").val(row.url);
            $("input[name='edit_Mno']").val(row.orderNo);
            $("textarea[name='edit_Mremark']").val(row.remark);
            layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                offset: '100px',
                title: '修改菜单',
                content: $('#editMpanel')
            })
        }
        menuOpera.formValia = function () {
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
        menuOpera.menu={};
        menuOpera.formSub = function (index) {
            $('#editMpanel').on('success.form.bv', function () {
                menuOpera.menu.name = $("input[name='edit_Mname']").val();
                menuOpera.menu.url = $("input[name='edit_Murl']").val();
                menuOpera.menu.orderNo = $("input[name='edit_Mno']").val();
                menuOpera.menu.remark = $("textarea[name='edit_Mremark']").val();
                menuOpera.menu.id = $("input[name='edit_Mid']").val();
                MenuService.updateMenuById(menuOpera.menu.id,menuOpera.menu, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        $('#menu_table').bootstrapTable('updateRow', {index:index,row: menuOpera.menu})
                        $("button[type='submit']").removeAttr('disabled');
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
    })