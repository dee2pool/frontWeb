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
        'bootstrap-table-zh-CN':{
            deps: ['bootstrap-table', 'jquery'],
            exports: "bootstrapTableZhCN"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
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
        "bootstrap-table-zh-CN":"../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'MenuService','bootstrap','bootstrap-table','bootstrap-table-zh-CN','bootstrapValidator', 'topBar'],
    function (jquery, common, layer, frame, MenuService,bootstrap,bootstrapTable,bootstrapTableZhCN,bootstrapValidator,topBar) {
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
                    },Menuurl:{
                        validators: {
                            regexp: {
                                regexp:/^#|(..\/)*[a-z0-9\/]+(.html){1}$/,
                                message: '页面路径格式不正确'
                            },
                            notEmpty: {
                                message: '页面路径不能为空'
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
                        menuAdd.isClick=false;
                        common.clearForm("addMpanel");
                    } else {
                        layer.msg('添加失败 请稍后重试');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        menuAdd.isClick=false;
        menuAdd.init = function () {
            $('#addMenu').click(function () {
                //开启弹窗
                var layerId = layer.open({
                    type: 1,
                    area: '380px',
                    skin: 'layui-layer-lan',
                    scrollbar: false,
                    resize: false,
                    offset: '100px',
                    title: '添加菜单',
                    content: $('#addMpanel'),
                    cancel: function (index, layero) {
                        common.clearForm('addMpanel');
                        menuAdd.isClick=false;
                    }
                })
                if(!menuAdd.isClick){
                    //启用验证
                    menuAdd.valia();
                    menuAdd.initSele();
                    //表单提交
                    menuAdd.submit(layerId);
                    menuAdd.isClick=true;
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('addMpanel');
                menuAdd.isClick=false;
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
                    },Menuurl:{
                        validators: {
                            regexp: {
                                regexp:/^#|(..\/)*[a-z0-9\/]+(.html){1}$/,
                                message: '页面路径格式不正确'
                            },
                            notEmpty: {
                                message: '页面路径不能为空'
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
                        common.clearForm('editMpanel');
                        menuEdit.isClick=false;
                    } else {
                        layer.msg('修改菜单失败 请稍后重试');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        menuEdit.isClick=false;
        menuEdit.init = function (row, index) {
            $("input[name='edit_Mid']").val(row.id);
            $("input[name='edit_Mname']").val(row.name);
            $("input[name='edit_Murl']").val(row.url);
            $("input[name='edit_Mno']").val(row.orderNo);
            $("textarea[name='edit_Mremark']").val(row.remark);
            var layerId = layer.open({
                type: 1,
                area: '380px',
                scrollbar: false,
                skin: 'layui-layer-lan',
                offset: '100px',
                title: '修改菜单',
                content: $('#editMpanel')
            })
            if(!menuEdit.isClick){
                menuEdit.valia();
                menuEdit.submit(row, index, layerId);
                menuEdit.isClick=true;
            }
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
                        layer.msg('删除菜单成功')
                    } else {
                        layer.msg('删除菜单失败')
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
                                var icons = "<button id='edit_btn' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>修改</button>" +
                                    "<button id='del_btn' class='btn btn-danger btn-xs'><i class='fa fa-remove'></i>删除</button>"
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
        //初始化表格高度
        $('#menu_table').bootstrapTable('resetView',{height:$(window).height()-135});
        //自适应表格高度
        common.resizeTableH('#menu_table');
    })