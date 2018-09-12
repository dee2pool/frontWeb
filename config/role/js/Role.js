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
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'RoleService': {
            deps: ['common'],
            exports: "RoleService"
        },
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "roleAdd": "role_add",
        "editRole": "role_edit",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "RoleService": "../../common/js/service/RoleController",
        "bootstrap-switch": "../../common/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
    }
});
require(['jquery', 'layer', 'frame', 'bootstrap-table', 'RoleService', 'bootstrapValidator', 'bootstrap', 'bootstrap-switch', 'bootstrap-treeview', 'topBar', 'roleAdd', 'editRole'],
    function (jquery, layer, frame, bootstrapTable, RoleService, bootstrapValidator, bootstrap, bootstrapSwitch, treeview, topBar, roleAdd, editRole) {
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
        //点击取消
        $('.btn-cancel').click(function () {
            layer.closeAll();
        })
        //菜单树
        $('#menutree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: frame.menuTree,
            onNodeChecked: function (event, node) {
                var nodeId = [];
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#menutree").treeview("checkNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    var parentNode = $('#menutree').treeview("getNode", pId);
                    var checkNum = 0;
                    for (var i = 0; i < parentNode.nodes.length; i++) {
                        if (parentNode.nodes[i].state.checked) {
                            checkNum++;
                        }
                    }
                    if (checkNum == parentNode.nodes.length) {
                        $("#menutree").treeview("checkNode", parentNode.nodeId);
                    }
                }
            },
            onNodeUnchecked: function (event, node) {
                var nodeId = [];
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#menutree").treeview("uncheckNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    var parentNode = $('#menutree').treeview("getNode", pId);
                    var checkNum = 0;
                    for (var i = 0; i < parentNode.nodes.length; i++) {
                        if (!parentNode.nodes[i].state.checked) {
                            checkNum++;
                        }
                    }
                    if (checkNum == parentNode.nodes.length) {
                        $("#menutree").treeview("uncheckNode", parentNode.nodeId);
                    }
                }
            }
        })
        $('#menutree').treeview('collapseAll');
        //中心树
        $('#centertree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: [{
                text: '默认控制中心',
                nodes: [
                    {
                        text: '研发中心'
                    }, {
                        text: '测试中心'
                    }, {
                        text: '产品中心'
                    }, {
                        text: '后勤中心'
                    }
                ]
            }],
            onNodeChecked: function (event, node) {
            }
        })
        //部门树
        $('#depttree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: [{
                text: '研发部门',
                nodes: [
                    {
                        text: '测试部门'
                    }, {
                        text: '产品部门'
                    }
                ]
            }],
            onNodeSelected: function (event, data) {
            }
        })
        //初始化表格
        RoleService.getRoleList(function (data) {
            if (data.result) {
                //初始化表格
                $('#role_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'id',
                        visible: false
                    }, {
                        field: 'name',
                        title: '角色名称',
                        align: 'center'
                    }, {
                        field: 'remark',
                        title: '描述信息',
                        align: 'center'
                    }, {
                        field: 'inbuiltFlag',
                        visible: false
                    }, {
                        field: 'permit',
                        title: '状态',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (value == 1) {
                                var switchIcon = "<input type='checkbox' name='permit' checked>";
                            } else {
                                var switchIcon = "<input type='checkbox' name='permit'>";
                            }
                            return switchIcon;
                        }
                    }, {
                        title: '权限配置',
                        align: 'center',
                        events: {
                            "click #rolecfig": function (e, value, row, index) {
                                //角色分配权限
                                layer.open({
                                    type: 1,
                                    title: '权限配置',
                                    offset: '100px',
                                    area: '600px',
                                    resize: false,
                                    content: $('#auth_config')
                                })
                                permission.menu(row.id)
                            }
                        },
                        formatter: function () {
                            return "<a id='rolecfig' href='#' style='font-size: 18px'><i class='fa fa-cog fa-1x'></i></a>"
                        }
                    }, {
                        title: '操作',
                        align: 'center',
                        events: {
                            "click #edit_role": function (e, value, row, index) {
                                //点击编辑按钮
                                editRole.openWin(row.name, row.remark);
                                editRole.formVali();
                            },
                            "click #del_role": function (e, value, row, index) {
                                //点击删除按钮
                                layer.confirm('确定删除角色 ' + row.name + ' ?', {
                                    btn: ['确定', '取消'] //按钮
                                }, function () {
                                    //删除操作
                                    if (row.inbuiltFlag == 1) {
                                        layer.msg('系统内置角色不能删除!')
                                    } else {
                                        RoleService.deleteRole(row.id, function (data) {
                                            if (data.result) {
                                                $('#role_table').bootstrapTable('removeByUniqueId', index)
                                            } else {
                                                layer.msg('删除失败!')
                                            }
                                        })
                                    }
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
                //初始化switch开关
                $("[name='permit']").bootstrapSwitch({
                    size: 'small',
                    onText: '启用',
                    offText: '禁用',
                    onColor: 'primary',
                    offColor: 'danger',
                    labelWidth: 10,
                    onSwitchChange: function (event, state) {

                    }
                })
            }
        })
        //添加角色
        roleAdd.init();
        var permission={};
        permission.menu=function (roleId) {
            $('#menuPerSave').click(function () {
                var menuChecked=$('#menutree').treeview('getChecked');
                var menuIds=new Array();
                for(var i=0;i<menuChecked.length;i++){
                    menuIds.push(menuChecked[i].id);
                }
                RoleService.grantMenu(roleId,menuIds,function (data) {
                    if(data.result){
                        layer.msg('分配权限成功!');
                        layer.closeAll();
                    }
                })
            })
        }
    })