require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
        },
        'ztreeCheck':{
            deps:['ztree','jquery']
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
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'bootstrap-datetimepicker': {
            deps: ['bootstrap', 'jquery'],
            exports: "datetimepicker"
        },
        'bootstrap-datetimepicker.zh-CN': {
            deps: ['bootstrap-datetimepicker', 'jquery']
        },
        'ugroupService': {
            deps: ['common'],
            exports: "ugroupService"
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
        "bootstrap-datetimepicker": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-switch": "../../../common/lib/bootstrap/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrap-datetimepicker.zh-CN": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        "ugroupService": "../../../common/js/service/UserGroupController",
        "userService": "../../../common/js/service/UserController",
        "domainService": "../../../common/js/service/DomainController",
        "RoleService": "../../../common/js/service/RoleController",
        "buttons": "../../common/js/buttons",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "ztreeCheck":"../../../common/lib/ztree/js/jquery.ztree.excheck"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'buttons', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'bootstrap-switch', 'topBar', 'ugroupService', 'userService', 'domainService', 'RoleService','ztree','ztreeCheck'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap, buttons, bootstrapValidator, datetimepicker, datetimepickerzhCN, bootstrapSwitch, topBar, ugroupService, userService, domainService, RoleService,ztree,ztreeCheck) {
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
        /********************************* 向下拉框中添加管理域 ***************************************/
        var domain = {};
        domainService.getChildList('-1', function (data) {
            if (data.result) {
                for (var i = 0; i < data.data.length; i++) {
                    $('select[name="domain"]').append('<option value="' + data.data[i].code + '">' + data.data[i].name + '</option>');
                    domain[data.data[i].code] = data.data[i].name;
                }
            }
        })
        /********************************* 管理域树 ***************************************/
        var domainTree = {};
        domainTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
                },
                key: {
                    name: "name"
                },
                check:{
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "p", "Y": "s" }
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {

                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    domainTree.obj.removeChildNodes(treeNode);
                    domainService.getChildList(treeNode.code, function (data) {
                        if (data.result) {
                            if (data.dataSize > 0) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/domain.png";
                                    data.data[i].checked=false;
                                }
                                var newNodes = data.data;
                                //添加节点
                                domainTree.obj.addNodes(treeNode, newNodes);
                            }
                        } else {
                            layer.msg('获得子域节点失败')
                        }
                    })
                }
            }
        };
        domainTree.zNode = function () {
            var treeNode;
            domainService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/domain.png";
                        data.data[i].checked=false;
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        domainTree.init = function () {
            domainTree.obj = $.fn.zTree.init($("#domaintree"), domainTree.setting, domainTree.zNode());
        }
        domainTree.init();
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
        /********************************* 用户表格 ***************************************/
        var userTable = {};
        userTable.init = function () {
            var queryUrl = common.host + "/auth/user/list";
            $('#user_table').bootstrapTable({
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
                    field: 'loginName',
                    title: '账号名',
                    align: "center"
                }, {
                    field: 'realName',
                    title: '姓名',
                    align: "center"
                }, {
                    field: 'gender',
                    title: '性别',
                    align: "center",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return '男'
                        } else {
                            return '女'
                        }
                    }
                }, {
                    field: 'inbuiltFlag',
                    title: '是否是系统内置账号',
                    align: "center",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return '是'
                        } else {
                            return '否'
                        }
                    }
                }, {
                    field: 'expiredTime',
                    title: '账号到期时间',
                    align: "center",
                    formatter: function (value, row, index) {
                        if(value){
                            var data=common.formatDate(value);
                            return data;
                        }else{
                            return '无';
                        }
                    }
                }, {
                    field: 'employeeNo',
                    title: '员工卡号',
                    align: "center"
                }, {
                    field: 'orgName',
                    title: '管理范围',
                    align: "center"
                }, {
                    field: 'email',
                    title: '电子邮件',
                    align: "center"
                }, {
                    field: 'state',
                    title: '账号状态',
                    align: "center",
                    formatter: function (value, row, index) {
                        var status;
                        if (value == 1) {
                            status='启用'
                        } else {
                            status='禁用';
                        }
                        return status;
                    }
                }, {
                    field:'role',
                    title: '角色',
                    align: "center",
                    formatter: function (value, row, index) {
                        //TODO 需要修改
                        var role = $('.role_table').bootstrapTable('getData', {'useCurrentPage': true});
                        var roleIds = new Array();
                        for (var i = 0; i < role.length; i++) {
                            roleIds.push(role[i].id);
                        }
                        var roleName = new Array();
                        userService.getUserRoleById(roleIds, row.id, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        if(data.data[i].isGranted){
                                            roleName.push(data.data[i].roleName);
                                        }
                                    }
                                }
                            }
                        })
                        if (roleName.length > 0) {
                            return roleName;
                        } else {
                            return '无';
                        }
                    }
                }, {
                    title: '操作',
                    align: "center",
                    events: {
                        "click #edit": function (e, value, row, index) {
                            userEdit.init(row, index)
                        },
                        "click #del": function (e, value, row, index) {
                            userDel.init(row)
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
                buttonsAlign: 'left',
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
                        userName: params.searchText
                    }
                    return temp
                }
            })
        }
        //日历控件
        $('.form_datetime').datetimepicker({
            language: 'zh-CN',
            todayBtn: 1,
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            initialDate: new Date(),
            pickerPosition: 'bottom-left'
        });
        userTable.init();
        //初始化表格高度
        $('#user_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#user_table');
        /********************************* 用户状态插件 ***************************************/
        var userState = {};
        userState.switch = function () {
            $("input[name='state']").bootstrapSwitch({
                size: 'small',
                onText: '启用',
                offText: '禁用',
                onColor: 'primary',
                offColor: 'danger',
                labelWidth: 10,
                onSwitchChange: function (event, state) {
                    var userState;
                    if (state) {
                        userState = 1;
                    } else {
                        userState = 0;
                    }
                    userService.updateUserState($(this).attr('id'), userState, function (data) {
                        if (data.result) {
                            layer.msg('修改用户状态成功')
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }
            })
        }
        /********************************* 获得用户组列表 ***************************************/
        var ugroupTable = {};
        ugroupTable.init = function () {
            var queryUrl = common.host + "/auth/userGroup/list";
            $('#ugTable').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'id',
                    visible: false
                }, {
                    field: 'name',
                    title: '用户组名称',
                    align: "center"
                }, {
                    field: 'remark',
                    title: '备注',
                    align: "center"
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
        ugroupTable.init();
        /*----------------------------------------添加用户---------------------------------------*/
        var userAdd = {};
        //密码强度
        userAdd.pwd = function () {
            $('input[name="upwd"]').keyup(function () {
                let len = this.value.length;
                if (len === 0) {
                    $('.progress-bar_item').each(function () {
                        $(this).removeClass('active')
                    });
                } else if (len > 0 && len <= 4) {
                    $('.progress-bar_item-1').addClass('active');
                    $('.progress-bar_item-2').removeClass('active');
                    $('.progress-bar_item-3').removeClass('active');
                } else if (len > 4 && len <= 8) {
                    $('.progress-bar_item-2').addClass('active');
                    $('.progress-bar_item-3').removeClass('active');
                } else {
                    $('.progress-bar_item').each(function () {
                        $(this).addClass('active');
                    });
                }
            });
        }
        //表单验证
        userAdd.valia = function () {
            //添加用户表单提交
            $('#user').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    uname: {
                        validators: {
                            notEmpty: {
                                message: '用户名不能为空'
                            },
                            stringLength: {
                                min: 3,
                                max: 14,
                                message: '用户名必须3-14个字'
                            }
                        }
                    }, upwd: {
                        validators: {
                            notEmpty: {
                                message: '密码不能为空'
                            },
                            stringLength: {
                                min: 5,
                                message: '密码强度太弱'
                            }
                        }
                    }, repwd: {
                        validators: {
                            notEmpty: {
                                message: '请输入确认密码'
                            }
                        }
                    }, username: {
                        validators: {
                            notEmpty: {
                                message: '请输入姓名'
                            }
                        }
                    }, email: {
                        validators: {
                            emailAddress: {
                                message: '邮箱格式不正确'
                            }
                        }
                    }
                }
            })
        }
        //表单提交
        userAdd.submit = function () {
            $('button[type="submit"]').unbind('click');
            $('#user').on('success.form.bv', function () {
                //获得角色id
                var role = $('#roleTable').bootstrapTable('getSelections');
                console.log(role)
                var roleIds = new Array();
                if (role.length > 0) {
                    for (var i = 0; i < role.length; i++) {
                        roleIds.push(role[i].id);
                    }
                }
                //添加用户
                var user = {};
                user.loginName = $("input[name='uname']").val();
                user.loginPassword = hex_md5($("input[name='upwd']").val());
                user.gender = $("select[name='gender']").val();
                user.employeeNo = $("input[name='employeeNo']").val();
                user.realName = $("input[name='username']").val();
                user.state = '1';
                user.email = $("input[name='email']").val();
                user.domainCode = $("input[name='domain']").val();
                user.inbuiltFlag = '0';
                var date=new Date($("input[name='expiredTime']").val()).valueOf();
                user.expiredTime = date/1000;
                userService.add(user, roleIds, function (data) {
                    if (data.result) {
                        common.clearForm('user');
                        layer.closeAll();
                        layer.msg('添加用户成功');
                        //刷新表格
                        $('#user_table').bootstrapTable('refresh', {silent: true});
                        userAdd.isClick=false;
                    } else {
                        layer.msg(data.description);
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false
            })
        }
        //阻止表单重复提交
        userAdd.isClick=false;
        userAdd.init = function () {
            $('#addUser').click(function () {
                //打开弹窗
                layer.open({
                    type: 1,
                    title: '添加用户',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    zIndex: 1000,//日期控件的zIndex为1001
                    content: $('#add_user'),
                    cancel: function (index, layero) {
                        common.clearForm('user');
                        userAdd.isClick=false;
                    }
                })
                if(!userAdd.isClick){
                    //账号到期时间初始化
                    $('.form_datetime').datetimepicker('setStartDate', new Date());
                    //表单验证
                    userAdd.valia();
                    //启用密码验证
                    userAdd.pwd();
                    //表单提交
                    userAdd.submit();
                    userAdd.isClick=true;
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('user');
                userAdd.isClick=false;
            })
        }
        userAdd.init();
        //点击下一步
        $('.btn-next').click(function () {
            $('#u_tab a:last').tab('show')
        })
        /********************************* 刪除用戶 ***************************************/
        var userDel = {};
        userDel.init = function (row) {
            //点击删除按钮
            layer.confirm('确定删除 ' + row.loginName + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                if(row.inbuiltFlag===1){
                    layer.msg('系统内置账号不能删除')
                }else {
                    //删除操作
                    userService.delete(row.id, function (data) {
                        if (data.result) {
                            layer.msg("删除成功!")
                            $('#user_table').bootstrapTable('remove', {field: 'id', values: [row.id]});
                            //初始化状态插件
                            userState.switch();
                        }
                    })
                }
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 修改用户 ***************************************/
        var userEdit = {};
        userEdit.valia = function () {
            $('#editUser').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editName: {
                        validators: {
                            notEmpty: {
                                message: '请输入姓名'
                            }
                        }
                    }, email: {
                        validators: {
                            emailAddress: {
                                message: '邮箱格式不正确'
                            }
                        }
                    }
                }
            })
        }
        userEdit.submit = function (row, index, layerId) {
            $('#editUser').on('success.form.bv', function () {
                var user = {};
                user.id = row.id;
                user.realName = $('input[name="editName"]').val();
                user.gender = $('select[name="editGender"]').val();
                user.email = $('input[name="editEmail"]').val();
                user.employeeNo = $('input[name="editId"]').val();
                var date=new Date($("input[name='editExpiredTime']").val()).valueOf();
                user.expiredTime=date/1000;
                userService.updateUserById(user, row.id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#user_table').bootstrapTable('updateRow', {index: index, row: user});
                        $("button[type='submit']").removeAttr('disabled');
                        //清空验证
                        $("#editUser").data('bootstrapValidator').destroy();
                        //初始化状态组件
                        userState.switch();
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改用户成功');
                        userEdit.isClick=false;
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        userEdit.isClick=false;
        userEdit.init = function (row, index) {
            //填充表单
            $("input[name='editUname']").val(row.loginName);
            $("input[name='editName']").val(row.realName);
            $("select[name='editGender']").val(row.gender);
            $("input[name='editEmail']").val(row.email);
            $("input[name='editId']").val(row.employeeNo);
            $("input[name='editExpiredTime']").val(common.formatDate(row.expiredTime));
            //打开弹窗
            var layerId = layer.open({
                type: 1,
                skin: 'layui-layer-lan',
                area: '600px',
                resize: false,
                zIndex: 1000,//日期控件的zIndex为1001
                scrollbar: false,
                offset: '100px',
                title: '修改用戶',
                content: $('#edit_user_tap')
            })
            if(!userEdit.isClick){
                //启用校验
                userEdit.valia();
                //表单提交
                userEdit.submit(row, index, layerId);
                userEdit.isClick=true;
            }
        }
        /********************************* 为用户分配用户组 ***************************************/
        var grantUgroup = {};
        grantUgroup.submit = function (userIds) {
            $('#grantUgSub').click(function () {
                var ug = $('#ugTable').bootstrapTable('getSelections');
                if (ug.length == 0) {
                    layer.msg('请选择用户组')
                } else if (ug.length > 1) {
                    layer.msg('一次只能选择一个用户组')
                } else {
                    userService.updateGroupIdByUserId(userIds, ug[0].id, function (data) {
                        if (data.result) {
                            layer.closeAll();
                            layer.msg('分配用户组成功');
                            $('#grantUgSub').unbind('click')
                        } else {
                            layer.msg(data.description)
                        }
                    })
                }
            })
        }
        grantUgroup.init = function () {
            $('#grantUg').click(function () {
                var user = $('#user_table').bootstrapTable('getSelections');
                if (user.length == 0) {
                    layer.msg('请选择用户')
                } else {
                    var userIds = new Array();
                    for (var i = 0; i < user.length; i++) {
                        userIds.push(user[i].id);
                    }
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-lan',
                        area: '600px',
                        resize: false,
                        scrollbar: false,
                        offset: '100px',
                        title: '分配用户组',
                        content: $('#grant_ugroup')
                    })
                    grantUgroup.submit(userIds);
                }
            })
        }
        grantUgroup.init();
        /********************************* 修改用户角色 ***************************************/
        var ressignRole = {};
        ressignRole.submit = function (userId) {
            $('#ressignRoleSub').click(function () {
                var roles = $('#roles').bootstrapTable('getSelections');
                var roleIds = new Array();
                var roleNames=new Array();
                for (var i = 0; i < roles.length; i++) {
                    roleIds.push(roles[i].id);
                    roleNames.push(roles[i].name);
                }
                userService.resetRole(userId, roleIds, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        layer.msg('修改角色成功');
                        var index=common.getTableIndex('user_table');
                        $('#user_table').bootstrapTable('updateCell', {
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
                var user = $('#user_table').bootstrapTable('getSelections');
                if (user.length == 0) {
                    layer.msg('请选择用户')
                } else if (user.length > 1) {
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
                    ressignRole.submit(user[0].id);
                }
            })
        }
        ressignRole.init();
        /********************************* 修改账号状态 ***************************************/
        var changeStatus={};
        changeStatus.init=function () {
            $('#status').click(function () {
                var user=$('#user_table').bootstrapTable('getSelections');
                console.log(user.length)
                if(user.length==0){
                    layer.msg('请选择用户')
                }else if(user.length>1){
                    layer.msg('一次只能选择一个用户')
                }else{
                    var state;
                    if(user[0].state==1){
                        state=0;
                    }else{
                        state=1;
                    }
                    userService.updateUserState(user[0].id,state, function (data) {
                        if (data.result) {
                            layer.msg('修改成功 请刷新表格')
                        } else {
                            layer.msg(data.description);
                        }
                    })
                }
            })
        }
        changeStatus.init();
        /********************************* 管理域树 ***************************************/
        var domainTree={};
        domainTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
                },
                key: {
                    name: "name"
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    $('input[name="domainName"]').val(treeNode.name);
                    $('input[name="domain"]').val(treeNode.code);
                    layer.close(domainLayer);
                },
                onExpand: function (event, treeId, treeNode) {
                    domainService.getChildList(treeNode.code, function (data) {
                        if (data.result) {
                            if (data.dataSize > 0) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/domain.png";
                                }
                                var newNodes = data.data;
                                //添加节点
                                treeObj.addNodes(treeNode, newNodes);
                            }
                        } else {
                            layer.msg('获得子域节点失败')
                        }
                    })
                }
            }
        }
        domainService.getChildList('-1',function (data) {
            if(data.result){
                if (data.dataSize > 0) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/domain.png";
                    }
                    domainTree.treeNode = data.data;
                }
            }else{
                layer.msg('获得子域节点失败')
            }
        })
        //选择管理域
        var domainLayer;
        $('#choseDomain').click(function () {
            domainLayer = layer.open({
                type: 1,
                title: '管理域树',
                skin: 'layui-layer-rim',
                offset: '100px',
                area: ['300px', '450px'],
                resize: false,
                content: $('#dTree')
            })
        })
        var treeObj = $.fn.zTree.init($("#dTree"), domainTree.setting, domainTree.treeNode);
        /********************************* 修改用户管理域 ***************************************/
        var altDomain={};
        altDomain.init=function () {
            $('#altDomain').click(function () {
                layer.open({
                    type: 1,
                    skin: 'layui-layer-lan',
                    area: '500px',
                    resize: false,
                    scrollbar: false,
                    offset: '100px',
                    title: '修改管理域',
                    content: $('#domain')
                })
            })
        }
        altDomain.init();
    }
)
