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
        "ugroupService": "../../../common/js/service/UserGroupController",
        "userService": "../../../common/js/service/UserController",
        "RoleService": "../../../common/js/service/RoleController"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'bootstrapValidator', 'topBar', 'ugroupService', 'userService', 'RoleService'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap, bootstrapValidator, topBar, ugroupService, userService, RoleService) {
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
        /********************************* 获得角色列表 ***************************************/
        var roleTable = {};
        roleTable.init = function () {
            var queryUrl = common.host + "/auth/role/list/page";
            $('.role_table').bootstrapTable({
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
                }],
                url: queryUrl,
                method: 'GET',
                cache: false,
                pagination: true,
                sidePagination: 'server',
                pageNumber: 1,
                pageSize: 5,
                pageList: [10, 20, 30],
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
                        pageSize: params.pageSize
                    }
                    return temp
                }

            })
        }
        roleTable.init();
        /********************************* 用户组表格 ***************************************/
        var ugroupTable = {};
        ugroupTable.init = function () {
            var queryUrl = common.host + "/auth/userGroup/list";
            $('#usergroup_table').bootstrapTable({
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
                    field: 'name',
                    title: '用户组名称',
                    align: "center"
                }, {
                    field: 'remark',
                    title: '备注',
                    align: "center"
                }, {
                    field: 'role',
                    title: '角色',
                    align: "center",
                    formatter: function (value, row, index) {
                        var role = $('.role_table').bootstrapTable('getData', {'useCurrentPage': true});
                        var roleIds = new Array();
                        for (var i = 0; i < role.length; i++) {
                            roleIds.push(role[i].id);
                        }
                        var roleName = new Array();
                        ugroupService.getUserGroupRoleById(row.id, roleIds, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        if (data.data[i].isGranted) {
                                            roleName.push(data.data[i].roleName);
                                        }
                                    }
                                }
                            } else {
                                layer.msg('获得角色信息失败');
                            }
                        })
                        return roleName;
                    }
                }, {
                    title: '操作',
                    align: "center",
                    events: {
                        "click #edit": function (e, value, row, index) {
                            ugroupEdit.init(row, index);
                        },
                        "click #del": function (e, value, row, index) {
                            ugroupDel.init(row)
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
                pageSize: 5,
                pageList: [10, 20, 30],
                smartDisplay: false,
                search: true,
                trimOnSearch: true,
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
                        name: params.searchText
                    }
                    return temp
                }
            })
        }
        ugroupTable.init();
        //初始化表格高度
        $('#usergroup_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#usergroup_table');
        /********************************* 添加用户组弹窗点击下一步 ***************************************/
        var ugroup = {};
        ugroup.nextBtn = function (tabId) {
            $('.btn-next').click(function () {
                $('#' + tabId + ' a:last').tab('show')
            })
        }
        /********************************* 添加用户组 ***************************************/
        var ugroupAdd = {};
        ugroupAdd.valia = function () {
            $('#ugroupForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    ugroupname: {
                        validators: {
                            notEmpty: {
                                message: '用户组名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        ugroupAdd.submit = function () {
            $('#ugroupForm').on('success.form.bv', function () {
                var roleSelected = $('#addUgRoleTable').bootstrapTable('getSelections');
                console.log(roleSelected)
                if (roleSelected.length == 0) {
                    layer.msg('请选择用户组角色')
                    $("button[type='submit']").removeAttr('disabled');
                } else {
                    //获得所选角色id
                    var roleIds = new Array();
                    for (var i = 0; i < roleSelected.length; i++) {
                        roleIds.push(roleSelected[i].id);
                    }
                    //添加用户组
                    var ug = {};
                    ug.name = $("input[name='ugroupname']").val();
                    ug.remark = $("textarea[name='ugroupRem']").val();
                    ugroupService.addUserGroup(ug, roleIds, function (data) {
                        if (data.result) {
                            common.clearForm('ugroupForm');
                            layer.closeAll();
                            //刷新表格
                            $('#usergroup_table').bootstrapTable('refresh', {silent: true});
                            layer.msg('添加用户成功');
                            ugroupAdd.isClick=false;
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }
                return false;
            })
        }
        //阻止表单重复提交
        ugroupAdd.isClick=false;
        ugroupAdd.init = function () {
            $('#addUgroup').click(function () {
                //打开弹窗
                layer.open({
                    type: 1,
                    title: '添加用户组',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_ugroup'),
                    cancel: function (index, layero) {
                        common.clearForm('ugroupForm');
                        ugroupAdd.isClick=false;
                    }
                })
                //点击下一步
                ugroup.nextBtn('ugroup_tab');
                if(!ugroupAdd.isClick){
                    //表单验证
                    ugroupAdd.valia();
                    //表单提交
                    ugroupAdd.submit();
                    ugroupAdd.isClick=true;
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('ugroupForm');
                ugroupAdd.isClick=false;
            })
        }
        ugroupAdd.init();
        /********************************* 修改用户组 ***************************************/
        var ugroupEdit = {};
        ugroupEdit.valia = function () {
            $('#editform').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editugname: {
                        validators: {
                            notEmpty: {
                                message: '用户组名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        ugroupEdit.submit = function (row, index, layerId) {
            $('#editform').on('success.form.bv', function () {
                var ug = {};
                ug.name = $("input[name='editugname']").val();
                ug.remark = $("textarea[name='editRemark']").val();
                ugroupService.updateUserGroup(row.id, ug, function (data) {
                    if (data.result) {
                        //修改表格
                        $('#usergroup_table').bootstrapTable('updateRow', {index: index, row: ug});
                        //清空表格
                        $("input[name='res']").click();
                        //初始化验证规则
                        $("#editform").data('bootstrapValidator').destroy();
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改用户组成功');
                        ugroupEdit.isClick=false;
                    } else {
                        layer.msg('修改用户组失败')
                    }
                })
                return false;
            })
        }
        ugroupEdit.isClick=false;
        ugroupEdit.init = function (row, index) {
            //填充表单
            $("input[name='editugname']").val(row.name);
            $("textarea[name='editRemark']").val(row.remark);
            //打开弹窗
            layer.open({
                type: 1,
                title: '修改用户组',
                skin: 'layui-layer-lan',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#edit_ugroup')
            })
            if(!ugroupEdit.isClick){
                //启用验证
                ugroupEdit.valia();
                //表单提交
                ugroupEdit.submit(row, index);
                ugroupEdit.isClick=true;
            }
        }
        /********************************* 删除用户组 ***************************************/
        var ugroupDel = {};
        ugroupDel.init = function (row) {
            //点击删除按钮
            layer.confirm('确定删除 ' + row.name + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                //删除操作
                ugroupService.deleteUserGroupByIds(row.id, function (data) {
                    if (data.result) {
                        $('#usergroup_table').bootstrapTable('remove', {field: 'id', values: [row.id]});
                        layer.msg("删除成功!")
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 重新分配用户组角色 ***************************************/
        var ressignRole = {};
        ressignRole.submit = function (ugId) {
            $('#ressignRoleSub').click(function () {
                var roles = $('#roles').bootstrapTable('getSelections');
                var roleIds = new Array();
                var roleNames=new Array();
                for (var i = 0; i < roles.length; i++) {
                    roleIds.push(roles[i].id);
                    roleNames.push(roles[i].name);
                }
                ugroupService.reassignRoleToUserGroup(ugId, roleIds, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        layer.msg('修改角色成功');
                        var index = common.getTableIndex('usergroup_table');
                        $('#usergroup_table').bootstrapTable('updateCell', {
                            index: index[0],
                            field: 'role',
                            value: roleNames
                        });
                        $('#ressignRoleSub').unbind('click')
                    } else {
                        layer.msg(data.description)
                    }
                })
            })
        }
        ressignRole.init = function () {
            $('#reassign').click(function () {
                var ug = $('#usergroup_table').bootstrapTable('getSelections');
                if (ug.length == 0) {
                    layer.msg('请选择用户组')
                } else if (ug.length > 1) {
                    layer.msg('一次只能修改一个')
                } else {
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-lan',
                        area: '600px',
                        resize: false,
                        scrollbar: false,
                        offset: '100px',
                        title: '修改角色',
                        content: $('#role')
                    })
                    ressignRole.submit(ug[0].id);
                }
            })
        }
        ressignRole.init();
        /********************************* 剥夺用户组角色 ***************************************/
        var deprive = {};
        deprive.init = function () {
            $('#deprive').click(function () {
                var ug = $('#usergroup_table').bootstrapTable('getSelections');
                if (ug.length == 0) {
                    layer.msg('请选择用户组')
                } else if (ug.length > 1) {
                    layer.msg('一次只能选择一个用户组')
                } else {

                }
            })
        }
        var roleId = new Array();
        RoleService.getRoleList('1', '10', function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    roleId.push(data.data[i].id);
                }
            }
        })
        /********************************* 查询用户组所拥有的角色 ***************************************/
        var getUgRole = {};
        getUgRole.getRole = function (row) {
            ugroupService.getUserGroupRoleById(row.id, roleId, function (data) {
                if (data.result) {
                    console.log(data.data);
                }
            })
        }
    })