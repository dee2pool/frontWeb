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
        "RoleService": "../../../common/js/service/RoleController",
        "domainService": "../../../common/js/service/DomainController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "departMentService": "../../../common/js/service/DepartmentController"
    }
});
require(['jquery', 'layer', 'frame', 'common', 'bootstrap-table', 'MenuService', 'RoleService', 'bootstrapValidator', 'bootstrap', 'bootstrap-treeview', 'topBar', 'roleAdd', 'editRole', 'departMentService','domainService'],
    function (jquery, layer, frame, common, bootstrapTable, MenuService, RoleService, bootstrapValidator, bootstrap, treeview, topBar, roleAdd, editRole, departMentService,domainService) {
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
        var treeData = [];
        MenuService.getMenuListByParentId(-1, function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    //生成菜单树节点
                    var treeNode = {};
                    treeNode.id = data.data[i].id;
                    treeNode.text = data.data[i].name;
                    treeNode.parentId = data.data[i].parentId;
                    MenuService.getMenuListByParentId(data.data[i].id, function (data2) {
                        if (data2.result) {
                            if (data2.dataSize > 0) {
                                treeNode.nodes = [];
                                for (var j = 0; j < data2.dataSize; j++) {
                                    var node2 = {};
                                    node2.id = data2.data[j].id;
                                    node2.text = data2.data[j].name;
                                    node2.parentId = data2.data[j].parentId;
                                    treeNode.nodes.push(node2);
                                }
                            }
                        }
                    })
                    treeData.push(treeNode);
                }
            }
        })
        //菜单树
        $('#menutree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: treeData,
            onNodeChecked: function (event, node) {
                var nodeId = [];
                //如果有子节点
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#menutree").treeview("checkNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    if (pId) {
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
                    if (pId) {
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
            }
        })
        $('#menutree').treeview('collapseAll');
        //部门树
        var deptTree = {};
        deptTree.getTreeList = function () {
            var tree = [];
            var temp = {};
            departMentService.listAll(function (data) {
                if (data.result) {
                    //将节点封装成树形结构
                    for (var i = 0; i < data.data.length; i++) {
                        temp[data.data[i].id] = {
                            id: data.data[i].id,
                            text: data.data[i].name,
                            pId: data.data[i].parentId,
                            remark: data.data[i].remark
                        };
                    }
                    for (i = 0; i < data.data.length; i++) {
                        var key = temp[data.data[i].parentId];
                        if (key) {
                            if (key.nodes == null) {
                                key.nodes = [];
                                key.nodes.push(temp[data.data[i].id]);
                            } else {
                                key.nodes.push(temp[data.data[i].id]);
                            }
                        } else {
                            tree.push(temp[data.data[i].id]);
                        }
                    }
                }
            })
            return tree;
        }
        $('#depttree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: deptTree.getTreeList(),
            onNodeChecked: function (event, node) {
                var nodeId = [];
                //如果有子节点
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#depttree").treeview("checkNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    if (pId) {
                        var parentNode = $('#depttree').treeview("getNode", pId);
                        var checkNum = 0;
                        for (var i = 0; i < parentNode.nodes.length; i++) {
                            if (parentNode.nodes[i].state.checked) {
                                checkNum++;
                            }
                        }
                        if (checkNum == parentNode.nodes.length) {
                            $("#depttree").treeview("checkNode", parentNode.nodeId);
                        }
                    }
                }
            },
            onNodeUnchecked: function (event, node) {
                var nodeId = [];
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#depttree").treeview("uncheckNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    if (pId) {
                        var parentNode = $('#depttree').treeview("getNode", pId);
                        var checkNum = 0;
                        for (var i = 0; i < parentNode.nodes.length; i++) {
                            if (!parentNode.nodes[i].state.checked) {
                                checkNum++;
                            }
                        }
                        if (checkNum == parentNode.nodes.length) {
                            $("#depttree").treeview("uncheckNode", parentNode.nodeId);
                        }
                    }
                }
            }
        })
        //管理域树
        var domainTree={};
        domainTree.getTree = function () {
            var tree = [];
            var temp = {};
            domainService.listAllDomain(function (data) {
                if (data.result) {
                    //将节点封装成树形结构
                    for (var i = 0; i < data.data.length; i++) {
                        temp[data.data[i].code] = {
                            code: data.data[i].code,
                            text: data.data[i].name,
                            parentCode: data.data[i].parentCode,
                            createTime: data.data[i].createTime,
                            creatorId: data.data[i].creatorId,
                            description: data.data[i].description,
                            orderNo: data.data[i].orderNo
                        };
                    }
                    for (i = 0; i < data.data.length; i++) {
                        var key = temp[data.data[i].parentCode];
                        if (key) {
                            if (key.nodes == null) {
                                key.nodes = [];
                                key.nodes.push(temp[data.data[i].code]);
                            } else {
                                key.nodes.push(temp[data.data[i].code]);
                            }
                        } else {
                            tree.push(temp[data.data[i].code]);
                        }
                    }
                }
            })
            return tree;
        }
        $('#domaintree').treeview({
            showBorder: false,
            showCheckbox: true,
            data: domainTree.getTree(),
            onNodeChecked: function (event, node) {
                var nodeId = [];
                //如果有子节点
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#domaintree").treeview("checkNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    if (pId) {
                        var parentNode = $('#domaintree').treeview("getNode", pId);
                        var checkNum = 0;
                        for (var i = 0; i < parentNode.nodes.length; i++) {
                            if (parentNode.nodes[i].state.checked) {
                                checkNum++;
                            }
                        }
                        if (checkNum == parentNode.nodes.length) {
                            $("#domaintree").treeview("checkNode", parentNode.nodeId);
                        }
                    }
                }
            },
            onNodeUnchecked: function (event, node) {
                var nodeId = [];
                if (node.nodes) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        nodeId.push(node.nodes[i].nodeId);
                    }
                    $("#domaintree").treeview("uncheckNode", [nodeId, {silent: true}]);
                } else {
                    var pId = node.parentId;
                    if (pId) {
                        var parentNode = $('#domaintree').treeview("getNode", pId);
                        var checkNum = 0;
                        for (var i = 0; i < parentNode.nodes.length; i++) {
                            if (!parentNode.nodes[i].state.checked) {
                                checkNum++;
                            }
                        }
                        if (checkNum == parentNode.nodes.length) {
                            $("#domaintree").treeview("uncheckNode", parentNode.nodeId);
                        }
                    }
                }
            }
        })
        //初始化表格
        RoleService.getRoleList(function (data) {
            if (data.result) {
                //初始化表格
                $('#role_table').bootstrapTable({
                    columns: [{
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
                                $('#menuPerSave').click(function () {
                                    permission.grantMenu(row.id);
                                })
                                $('#orgPerSave').click(function () {
                                    if(permission.ids("menutree").length!=0){
                                        permission.grantMenu(row.id);
                                    }
                                    permission.org(row.id);
                                })
                                $('#domainPerSave').click(function () {
                                    if(permission.ids("menutree").length!=0){
                                        permission.grantMenu(row.id);
                                    }
                                    if(permission.ids("depttree").length!=0){
                                        permission.org(row.id);
                                    }
                                    permission.domain(row.id);
                                })
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
                                                layer.msg('删除成功!')
                                                $('#role_table').bootstrapTable('remove', {
                                                    field: 'id',
                                                    values: [row.id]
                                                })
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
                            var icons = "<div class='btn-group'>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data: data.data
                })
            }
        })
        //添加角色
        roleAdd.init();
        var permission = {};
        permission.ids=function(treeId){
            var checked = $('#'+treeId).treeview('getChecked');
            console.log(checked)
            var ids=new Array();
            for (var i = 0; i < checked.length; i++) {
                ids.push(checked[i].id);
            }
            return ids;
        }
        permission.grantMenu = function (roleId) {
            //得到选择的节点id
            var menuIds=permission.ids("menutree");
            if(menuIds.length==0){
                layer.msg('请选择节点')
            }else{
                //分配权限
                RoleService.grantMenu(roleId, menuIds, function (data) {
                    if (data.result) {
                        layer.msg('分配权限成功!');
                        layer.closeAll();
                    }else{
                        layer.msg(data.description);
                    }
                })
            }
        }
        permission.org=function (roleId) {
            //得到选择的id
            var orgIds=permission.ids("depttree");
            if(orgIds.length==0){
                layer.msg('请选择节点')
            }else {
                //分配权限
                RoleService.grantDepartment(roleId,orgIds,function (data) {
                    if (data.result) {
                        layer.msg('分配权限成功!');
                        layer.closeAll();
                    }else{
                        layer.msg(data.description);
                    }
                })
            }
        }
        permission.domain=function (roleId) {
            //得到选择的id
            var domainIds=permission.ids("domaintree");
            if(domainIds.length==0){
                layer.msg('请选择节点')
            }else {
                //分配权限
                RoleService.grantDomain(roleId,domainIds,function (data) {
                    if(data.result){
                        layer.msg('分配权限成功!');
                        layer.closeAll();
                    }else{
                        layer.msg(data.description);
                    }
                })
            }
        }
    })