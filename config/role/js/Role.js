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
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'ztree': {
            deps: ['jquery']
        },
        'ztreeCheck':{
            deps:['ztree','jquery']
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
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../../common/js/service/MenuController",
        "RoleService": "../../../common/js/service/RoleController",
        "domainService": "../../../common/js/service/DomainController",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "departMentService": "../../../common/js/service/DepartmentController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "ztreeCheck":"../../../common/lib/ztree/js/jquery.ztree.excheck"
    }
});
require(['jquery', 'layer', 'frame', 'common', 'bootstrap-table', 'bootstrap-table-zh-CN', 'MenuService', 'RoleService', 'bootstrapValidator', 'bootstrap', 'topBar', 'departMentService', 'domainService','ztree','ztreeCheck'],
    function (jquery, layer, frame, common, bootstrapTable, bootstrapTableZhcN, MenuService, RoleService, bootstrapValidator, bootstrap, topBar, departMentService, domainService,ztree,ztreeCheck) {
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
        /********************************* 权限相关初始化 ***************************************/
            //菜单权限相关初始化:获得所有菜单
        var menuList={};
        menuList.menuIds=new Array();
        menuList.init=function () {
            MenuService.getListAll(function (data) {
                if(data.result){
                    if(data.dataSize>0){
                        for(var i=0;i<data.dataSize;i++){
                            menuList.menuIds.push(data.data[i].id);
                        }
                        menuList.menu=data.data;
                    }
                }else{
                    layer.msg(data.description);
                }
            })
        }
        menuList.init();

        //将菜单封装成树
        menuList.zNode=function (roleMenuList,menu) {
            if(roleMenuList&&roleMenuList.length>0) {
                //将菜单节点封装成树
                var tree=[];
                var temp={};
                //将节点封装成树形结构
                for (var i = 0; i < menu.length; i++) {
                    temp[menu[i].id] = {
                        id: menu[i].id,
                        name: menu[i].name,
                        parentId: menu[i].parentId,
                        icon:'../img/menu.png'
                    };
                    for(var j=0;j<roleMenuList.length;j++){
                        if(menu[i].name===roleMenuList[j].menuName){
                            if(roleMenuList[j].isGranted){
                                temp[menu[i].id].checked=true;
                            }else{
                                temp[menu[i].id].checked=false;
                            }
                        }
                    }
                }
                for (i = 0; i < menu.length; i++) {
                    var key = temp[menu[i].parentId];
                    if (key) {
                        if (key.children == null) {
                            key.children = [];
                            key.children.push(temp[menu[i].id]);
                        } else {
                            key.children.push(temp[menu[i].id]);
                        }
                    } else {
                        tree.push(temp[menu[i].id]);
                    }
                }
                return tree;
            }else{
                layer.msg('菜单接口出现异常')
            }
        }
        /********************************* 初始化角色表格 ***************************************/
        var roleTable = {};
        roleTable.init = function () {
            var queryUrl = common.host + "/auth/role/list/page";
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
                    title: '权限配置',
                    align: 'center',
                    events: {
                        "click #menuPre": function (e, value, row, index) {
                            //得到角色拥有的菜单
                            if(menuList.menuIds.length!=0){
                                var zNodes;
                                MenuService.getMenuByRoleId(row.id,menuList.menuIds,function (data) {
                                    if(data.result&&data.dataSize>0){
                                        zNodes=menuList.zNode(data.data,menuList.menu);
                                        menuTree.init(zNodes);
                                        layer.open({
                                            type: 1,
                                            skin: 'layui-layer-lan',
                                            area: '500px',
                                            resize: false,
                                            scrollbar: false,
                                            offset: '100px',
                                            title: '菜单权限配置',
                                            content: $('#auth_menu')
                                        })
                                    }else{
                                        layer.msg(data.description);
                                    }
                                })
                                menuAuth.init(row.id);
                            }else{
                                layer.msg('菜单接口出现异常')
                            }
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'><button id='menuPre' type='button' class='btn btn-info btn-xs'>" +
                            "<i class='fa fa-edit'></i>菜单</button>" +
                            "</div>"
                        return icons;
                    }
                }, {
                    title: '操作',
                    align: 'center',
                    events: {
                        "click #edit": function (e, value, row, index) {
                            roleEdit.init(row, index);

                        },
                        "click #del": function (e, value, row, index) {
                            roleDel.init(row);
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
                        pageNo: params.pageNumber,
                        pageSize: params.pageSize,
                    }
                    return temp
                }
            })
        }
        roleTable.init();
        //初始化表格高度
        $('#role_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#role_table');
        /********************************* 添加角色 ***************************************/
        var roleAdd={};
        roleAdd.valia=function () {
            $('#add_role').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    name: {
                        validators: {
                            notEmpty: {
                                message: '角色名称不能为空!'
                            }
                        }
                    },
                    remark: {
                        validators: {
                            notEmpty: {
                                message: '描述信息不能为空!'
                            }
                        }
                    }
                }
            })
        }
        roleAdd.submit=function () {
            $('#add_role').on('success.form.bv', function (e) {
                var sub_data={};
                sub_data.name=$("input[name='name']").val();
                sub_data.remark=$("input[name='remark']").val();
                RoleService.addRole(sub_data,function (data) {
                    if(data.result){
                        sub_data.id=data.data;
                        sub_data.inbuiltFlag=0;
                        sub_data.permit=1;
                        layer.closeAll();
                        $('#role_table').bootstrapTable('append',sub_data);
                        //表单清空
                        common.clearForm('add_role');
                        layer.msg('添加角色成功');
                        roleAdd.isClick=false;
                    }else{
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        roleAdd.isClick=false;
        roleAdd.init=function () {
            $('#addRole').click(function () {
                layer.open({
                    type: 1,
                    area: '380px',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    scrollbar: false,
                    title: '添加角色',
                    content: $('#add_role'),
                    cancel: function (index, layero) {
                        common.clearForm('add_role');
                        roleAdd.isClick=false;
                    }
                })
                if(!roleAdd.isClick){
                    roleAdd.valia();
                    roleAdd.submit();
                    roleAdd.isClick=true;
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('add_role');
                roleAdd.isClick=false;
            })
        }
        roleAdd.init();
        /********************************* 修改角色 ***************************************/
        var roleEdit = {};
        roleEdit.valia = function () {
            $('#edit_role').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editname: {
                        validators: {
                            notEmpty: {
                                message: '角色名称不能为空'
                            }
                        }
                    },
                    editremark: {
                        validators: {
                            notEmpty: {
                                message: '角色描述不能为空'
                            }
                        }
                    }
                }
            })
        }
        roleEdit.submit = function (row, index) {
            $('#edit_role').on('success.form.bv', function () {
                var role = {};
                role.id=row.id;
                role.name = $('input[name="editname"]').val();
                role.remark = $('input[name="editremark"]').val();
                RoleService.updateRole(role,row.id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#role_table').bootstrapTable('updateRow', {index: index, row: role});
                        //清空
                        common.clearForm('edit_role');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改角色成功!');
                        roleEdit.isClick=false;
                    }else{
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        //阻止表单重复提交
        roleEdit.isClick=false;
        roleEdit.init = function (row, index) {
            //填充表单
            $("input[name='editname']").val(row.name);
            $("input[name='editremark']").val(row.remark);
            //打开弹窗
            var layerId = layer.open({
                type: 1,
                skin: 'layui-layer-lan',
                area: '500px',
                resize: false,
                scrollbar: false,
                offset: '100px',
                title: '修改角色',
                content: $('#edit_role')
            })
            if(!roleEdit.isClick){
                //启用校验
                roleEdit.valia();
                //表单提交
                roleEdit.submit(row, index);
                roleEdit.isClick=true;
            }
        }
        /********************************* 删除角色 ***************************************/
        var roleDel = {};
        roleDel.init = function (row) {
            //点击删除按钮
            layer.confirm('确定删除角色 ' + row.name + ' ?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
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
                }, function () {
                    layer.closeAll();
                }
            );
        }
        /********************************* 菜单树相关 ***************************************/
        var menuTree={};
        menuTree.setting={
            data: {
                simpleData: {
                    enable: false,
                    idKey: "id",
                },
                key: {
                    name: "name"
                }
            },
            check:{
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "p", "Y": "s" }
            }
        }
        menuTree.init=function (zNodes) {
            menuTree.obj = $.fn.zTree.init($("#menuTree"),menuTree.setting,zNodes);
        }
        /********************************* 菜单权限相关 ***************************************/
        var menuAuth={};
        menuAuth.init=function (roleId){
            $('#menuAuthSub').click(function () {
                if(menuTree.obj){
                    var nodes=menuTree.obj.getCheckedNodes(true);
                    var nodesId=new Array();
                    for(var i=0;i<nodes.length;i++){
                        nodesId.push(nodes[i].id);
                    }
                    RoleService.resetMenu(roleId,nodesId,function (data) {
                        if(data.result){
                            layer.closeAll();
                            layer.msg('分配菜单成功');
                            //角色重复点击 这里不知道为什么会重复点击先这样解决???
                            $('#menuAuthSub').unbind('click');
                        }else{
                            layer.msg(data.description);
                            $("button[type='submit']").removeAttr('disabled');
                        }
                    })
                }
            })
        }

    })