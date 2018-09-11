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
        'jquery-slimScroll':{
            deps:['jquery']
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
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrap-datetimepicker": "../../common/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-switch": "../../common/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrap-datetimepicker.zh-CN": "../../common/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        "ugroupService": "../../../common/js/service/UserGroupController",
        "userService":"../../../common/js/service/UserController",
        "RoleService": "../../common/js/service/RoleController",
        "jquery-slimScroll":"../../common/libs/jquery-slimScroll/jquery.slimscroll.min"
    }
});
require(['jquery','common','frame', 'bootstrap-table','jquery-slimScroll','bootstrap', 'bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'bootstrap-switch', 'topBar', 'ugroupService','userService','RoleService'],
    function (jquery,common,frame, bootstrapTable,slimScroll,bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, bootstrapSwitch, topBar, ugroupService,userService,RoleService) {
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
        //用户组滚动条
        $('.slimscrollleft').slimScroll({
            height:'655px',
            size:'5px',
            opacity:.3
        })
        //获得所有用户组信息
        var tree = [];
        var temp = {};
        ugroupService.listAllUserGroup(function (data) {
            if (data.result) {
                //将节点封装成树形结构
                for (var i = 0; i < data.data.length; i++) {
                    //向下拉框中添加
                    $('select[name="ugroupPre"]').append('<option value="' + data.data[i].id + '">' +
                        data.data[i].name
                        + '</option>')
                    temp[data.data[i].id] = {
                        id: data.data[i].id,
                        text: data.data[i].name,
                        parentId: data.data[i].parentId,
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
        //用户组树
        var isNodeSelected = false;
        var nodeSelected;
        $('#ugrouptree').treeview({
            showBorder: false,
            nodeIcon: 'glyphicon glyphicon-user',
            data: tree,
            onNodeSelected: function (event, data) {
                isNodeSelected = true;
                nodeSelected = data;
                console.log(isNodeSelected)
            },
            onNodeUnselected: function (event, data) {
                isNodeSelected = false;
            }
        })
        //用户表格
        var pageNo=1;
        var pageSize=10;
        var userName;
        userService.getUserList(pageNo,pageSize,userName,function (data) {
            if(data.result){
                $('#user_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'id',
                        title: '序号',
                        align: "center"
                    }, {
                        field: 'uname',
                        title: '用户名',
                        align: "center"
                    }, {
                        field: 'name',
                        title: '姓名',
                        align: "center"
                    }, {
                        field: 'role',
                        title: '角色',
                        align: "center"
                    }, {
                        field: 'date',
                        title: '到期时间',
                        align: "center"
                    }, {
                        field: 'online',
                        title: '在线状态',
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value == 1) {
                                var statusIcon = "<input type='checkbox' name='status' checked>";
                            } else {
                                var statusIcon = "<input type='checkbox' name='status'>";
                            }
                            return statusIcon;
                        }
                    }, {
                        title: '操作',
                        align: "center",
                        events: {
                            "click #edit_role": function (e, value, row, index) {
                                //点击编辑按钮

                            },
                            "click #del_role": function (e, value, row, index) {
                                //点击删除按钮
                                layer.confirm('确定删除 ' + row.uname + ' ?', {
                                    btn: ['确定', '取消'] //按钮
                                }, function () {
                                    //删除操作

                                }, function () {
                                    layer.closeAll();
                                });
                            }
                        },
                        formatter: function () {
                            var icons = "<button type='button' id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button type='button' id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>"
                            return icons;
                        }
                    }],
                    data:data.data,
                    height:655
                })
                common.pageInit(pageNo,pageSize,data.extra)
            }
        })
        //初始化switch开关
        $("[name='status']").bootstrapSwitch({
            size: 'small',
            onText: '在线',
            offText: '离线',
            onColor: 'primary',
            offColor: 'danger',
            labelWidth: 10,
            onSwitchChange: function (event, state) {

            }
        })
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
        //点击取消
        $('.btn-cancel').click(function () {
            layer.closeAll();
        })
        /*--------------------------------添加用户组----------------------------------*/
        $('#addUgroup').click(function () {
            //得到当前时间戳
            var timestamp = new Date().getTime();
            $('input[name="ugroupid"]').val(timestamp);
            layer.open({
                type: 1,
                title: '添加用户组',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#add_ugroup')
            })
        })
        //点击下一步
        $('.btn-next').click(function () {
            $('#ugroup_tab a:last').tab('show')
        })
        //角色表格
        var role_ids = new Array();
        RoleService.getRoleList(function (data) {
            if(data.result){
                $('.role_table').bootstrapTable({
                    columns: [{
                        field: 'id',
                        visible:false
                    },{
                        field: 'name',
                        title: '角色名称',
                        align: 'center'
                    }, {
                        field: 'remark',
                        title: '描述信息',
                        align: 'center'
                    }],
                    data:data.data,
                    onClickRow: function (row, $elem, field) {
                        //判断表单提交是否被禁用
                        if ($("button[type='submit']").attr('disabled') == 'disabled') {
                            $("button[type='submit']").removeAttr('disabled')
                        }
                        //判断元素是否被点击过
                        if ('rgb(211, 211, 211)' == $elem.css('background-color')) {
                            $elem.css('background-color', 'rgb(245, 245, 245)')
                            for (var i = 0; i < role_ids.length; i++) {
                                if (role_ids[i] == row.id) {
                                    role_ids.splice(i, 1);
                                    break;
                                }
                            }
                        } else {
                            $elem.css('background-color', 'lightgrey');
                            role_ids.push(row.id);
                        }
                    }
                })
            }
        })
        //表单提交
        $('#uGroup').bootstrapValidator({
            excluded: [':disabled'],
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
                        },
                        stringLength: {
                            min: 3,
                            max: 14,
                            message: '用户组名称必须3-14个字'
                        }
                    }
                }
            }
        }).on('success.form.bv',function () {
            if (role_ids.length == 0) {
                layer.msg('请选择用户组角色');
                return false;
            } else {
                //添加用户组
                var ug = {};
                ug.id = $("input[name='ugroupid']").val();
                ug.name = $("input[name='ugroupname']").val();
                ug.parentId = $("select[name='ugroupPre']").val();
                ug.remark = $("textarea[name='ugroupRem']").val();
                ugroupService.addUserGroup(ug, function (data) {
                    if (data.result) {
                        //为用户组添加权限
                        ugroupService.assignRoleToUserGroup(ug.id, role_ids, function (data) {
                            if (data.result) {
                                layer.msg('添加成功');
                                layer.closeAll();
                            } else {
                                layer.msg(data.description);
                            }
                        })
                    } else {
                        layer.msg(data.description);
                    }
                })
            }
            $("button[type='submit']").removeAttr('disabled');
            return false;
        })
        //修改用户组
        $('#editUgroup').click(function () {
            if (!isNodeSelected) {
                layer.msg('请选择要修改的用户组')
            } else {
                $('input[name="editugid"]').val(nodeSelected.id)
                $('input[name="editugname"]').val(nodeSelected.text);
                $('textarea[name="editugrem"]').val(nodeSelected.remark);
                layer.open({
                    type: 1,
                    title: '修改用户组',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#edit_ugroup')
                })

            }
        })
        //删除用户组
        $('#delUgroup').click(function () {
            if (!isNodeSelected) {
                layer.msg("请选择要删除的用户组")
            } else {
                if (nodeSelected) {
                    var delIds = new Array();
                    if (nodeSelected.nodes) {
                        for (var i = 0; i < nodeSelected.nodes.length; i++) {
                            delIds.push(nodeSelected.nodes[i].id);
                        }
                    }
                    delIds.push(nodeSelected.id);
                }
                ugroupService.deleteUserGroupByIds(delIds, function (data) {
                    if (data.result) {
                        layer.msg('删除成功')
                    }
                })
            }
        })
        /*----------------------------------------添加用户---------------------------------------*/
        /*密码强度*/
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
        //添加用戶弹窗
        $('#addUser').click(function () {
            $('.form_datetime').datetimepicker('setStartDate', new Date());
            layer.open({
                type: 1,
                title: '添加用户',
                offset: '100px',
                area: '600px',
                resize: false,
                zIndex: 1000,//日期控件的zIndex为1001
                content: $('#add_user')
            })
        })
        //点击下一步
        $('.btn-next').click(function () {
            $('#u_tab a:last').tab('show')
        })
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
                }
            }
        }).on('success.form.bv',function (){
            if (role_ids.length == 0) {
                layer.msg('请选择用户所属角色');
                return false;
            } else {
                //添加用户
                var user = {};
                user.loginName = $("input[name='uname']").val();
                user.loginPassword = hex_md5($("input[name='upwd']").val());
                user.salt='1001';
                user.gender=$("select[name='gender']").val();
                user.employeeNo=$("input[name='employeeNo']").val();
                user.photo=$("input[name='photo']").val();
                user.realName=$("input[name='username']").val();
                user.state='1';
                user.email=$("input[name='email']").val();
                user.domainCode='10010';
                user.inbuiltFlag='0';
                userService.add(user,function (data) {
                    if(data.result){
                        var uid=data.data;
                        //为用户赋予角色
                        userService.grantRole(uid,role_ids,function (data) {
                            if(data.result){
                                layer.msg("添加用户成功")
                            }
                        })
                    }
                })
            }
            $("button[type='submit']").removeAttr('disabled')
            return false
        })
    })
