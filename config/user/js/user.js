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
        'jquery-slimScroll': {
            deps: ['jquery']
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
        "userService": "../../../common/js/service/UserController",
        "domainService": "../../../common/js/service/DomainController",
        "RoleService": "../../../common/js/service/RoleController",
        "jquery-slimScroll": "../../common/libs/jquery-slimScroll/jquery.slimscroll.min"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'jquery-slimScroll', 'bootstrap', 'bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'bootstrap-switch', 'topBar', 'ugroupService', 'userService','domainService','RoleService'],
    function (jquery, common, frame, bootstrapTable, slimScroll, bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, bootstrapSwitch, topBar, ugroupService, userService,domainService,RoleService) {
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
        var ugroupTree = {};
        ugroupTree.getTree = function () {
            var tree = [];
            var temp = {};
            ugroupService.listAllUserGroup(function (data) {
                if (data.result) {
                    //将节点封装成树形结构
                    //清空下拉框
                    $('select[name="ugroupPre"]>option[value!="-1"]').remove();
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
            return tree;
        }
        ugroupTree.isNodeSelected = false;
        ugroupTree.nodeSelected;
        ugroupTree.init = function () {
            $('#ugrouptree').treeview({
                showBorder: false,
                nodeIcon: 'glyphicon glyphicon-user',
                data: ugroupTree.getTree(),
                onhoverColor: 'lightgrey',
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeSelected: function (event, data) {
                    ugroupTree.isNodeSelected = true;
                    ugroupTree.nodeSelected = data;
                },
                onNodeUnselected: function (event, data) {
                    ugroupTree.isNodeSelected = false;
                    ugroupTree.nodeSelected = null;
                }
            })
        }
        ugroupTree.btnNext = function (tabId) {
            $('.btn-next').click(function () {
                $('#' + tabId + ' a:last').tab('show')
            })
        }
        ugroupTree.init();
        //用户状态插件
        var userState = {};
        userState.switch = function () {
            $("[name='state']").bootstrapSwitch({
                size: 'small',
                onText: '启用',
                offText: '禁用',
                onColor: 'primary',
                offColor: 'danger',
                labelWidth: 10,
                onSwitchChange: function (event, state) {
                    var userState;
                    if(state){
                        userState=1;
                    }else{
                        userState=0;
                    }
                    userService.updateUserState($(this).attr('id'),userState,function (data) {
                        if(data.result){
                            layer.msg('修改用户状态成功')
                        }else{
                            layer.msg(data.description);
                        }
                    })
                }
            })
        }
        //向下拉框中添加管理域
        var domain={};
        domainService.listAllDomain(function (data) {
            if(data.result){
                for(var i=0;i<data.data.length;i++){
                    $('select[name="domain"]').append('<option value="'+data.data[i].code+'">'+data.data[i].name+'</option>');
                    domain[data.data[i].code]=data.data[i].name;
                }
            }
        })
        var page={};
        page.pageNo=1;
        page.pageSize=10;
        userService.getUserList(page.pageNo,page.pageSize,page.userName, function (data) {
            if (data.result) {
                $('#user_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'id',
                        visible: false
                    },{
                        title:'序号',
                        align:'center',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    },{
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
                        field: 'employeeNo',
                        title: '员工卡号',
                        align: "center"
                    }, {
                        field: 'email',
                        title: '电子邮件',
                        align: "center"
                    }, {
                        field: 'domainCode',
                        title: '区域',
                        align: "center",
                        formatter:function (value,row,index) {
                            return domain[value]
                        }
                    }, {
                        field: 'state',
                        title: '账号状态',
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value == 1) {
                                var statusIcon = "<input id="+row.id+" type='checkbox' name='state' checked>";
                            } else {
                                var statusIcon = "<input id="+row.id+" type='checkbox' name='state'>";
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
                                layer.confirm('确定删除 ' + row.loginName + ' ?', {
                                    btn: ['确定', '取消'] //按钮
                                }, function () {
                                    //删除操作
                                    userService.delete(row.id, function (data) {
                                        if (data.result) {
                                            layer.msg("删除成功!")
                                            $('#user_table').bootstrapTable('remove', {field: 'id', values: [row.id]});
                                            userState.switch();
                                        }
                                    })
                                }, function () {
                                    layer.closeAll();
                                });
                            }
                        },
                        formatter: function () {
                            var icons = "<button type='button' id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>"
                            return icons;
                        }
                    }],
                    data: data.data
                })
                //初始化switch开关
                userState.switch();
                //初始化分页组件
                common.pageInit(page.pageNo,page.pageSize,data.extra)
            }
        })
        //改变页面展示数据条数
        $('li[role="menuitem"]>a').click(function () {
            page.pageSize=$(this).html();
            $('.page-size').html($(this).html());
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            userService.getUserList(page.pageNo,page.pageSize,page.userName,function (data) {
                if(data.result){
                    $('#user_table').bootstrapTable('load',data.data);
                    //清除
                    $('.pagination>li').each(function () {
                        if($(this).children().html()>1){
                            $(this).remove();
                        }
                    })
                    //初始化分页组件左侧
                    common.pageLeft(page.pageNo,page.pageSize,data.extra)
                }
            })
        })
        //点击上一页
        $('.page-pre>a').click(function () {
            if(page.pageNo>1){
                page.pageNo--;
                userService.getUserList(page.pageNo,page.pageSize,page.userName,function (data) {
                    if(data.result){
                        $('#user_table').bootstrapTable('load',data.data);
                        $.each($('.page-item'),function (i,n) {
                            if($(n).children().html()==page.pageNo){
                                $(n).addClass('active');
                                $(n).siblings().removeClass('active')
                            }
                        })
                        //重新加载switch
                        userState.switch();
                        //初始化分页组件左侧
                        common.pageLeft(page.pageNo,page.pageSize,data.extra)
                    }else {
                        layer.msg(data.description);
                    }
                })
            }
        });
        //点击下一页
        $('.page-next>a').click(function () {
            var pageNum=$('.page-next').prev().children().html();
            if(page.pageNo<pageNum){
                page.pageNo++;
                userService.getUserList(page.pageNo,page.pageSize,page.userName,function (data) {
                    if(data.result){
                        $('#user_table').bootstrapTable('load',data.data);
                        $.each($('.page-item'),function (i,n) {
                            if($(n).children().html()==page.pageNo){
                                $(n).addClass('active');
                                $(n).siblings().removeClass('active')
                            }
                        })
                        //重新加载switch()
                        userState.switch();
                        //初始化分页组件左侧
                        common.pageLeft(page.pageNo,page.pageSize,data.extra)
                    }else {
                        layer.msg(data.description);
                    }
                })
            }
        });
        //点击指定页面
        $('.pagination').on('click','.page-link',function () {
            //跳转到指定页面
            if(common.isRealNum($(this).html())){
                page.pageNo=$(this).html();
                userService.getUserList(page.pageNo,page.pageSize,page.userName,function (data) {
                    if(data.result){
                        $('#user_table').bootstrapTable('load',data.data);
                        $.each($('.page-item'),function (i,n) {
                            if($(n).children().html()==page.pageNo){
                                $(n).addClass('active');
                                $(n).siblings().removeClass('active')
                            }
                        })
                        //重新加载switch()
                        userState.switch();
                        //初始化分页组件左侧
                        common.pageLeft(page.pageNo,page.pageSize,data.extra)
                    }
                })
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
        /*--------------------------------添加用户组----------------------------------*/
        //角色表格
        var role_ids = new Array();
        RoleService.getRoleList(function (data) {
            if (data.result) {
                $('.role_table').bootstrapTable({
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
                    }],
                    data: data.data,
                    onClickRow: function (row, $elem, field) {
                        //判断表单提交是否被禁用
                        if ($("button[type='submit']").attr('disabled') == 'disabled') {
                            $("button[type='submit']").removeAttr('disabled');
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
        var ugroupValia={};
        ugroupValia.addValia=function(){
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
            })
        }
        ugroupValia.altValia=function(){
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
                            },
                            stringLength: {
                                min: 3,
                                max: 14,
                                message: '用户组名称必须3-14个字'
                            }
                        }
                    }
                }
            })
        }
        $('#addUgroup').click(function () {
            //得到当前时间戳
            var timestamp = new Date().getTime();
            //表单验证
            ugroupValia.addValia();
            $('input[name="ugroupid"]').val(timestamp);
            layer.open({
                type: 1,
                title: '添加用户组',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#add_ugroup')
            })
            $('#uGroup').on('success.form.bv', function () {
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
                        console.log("aa")
                        if (data.result) {
                            //为用户组添加权限
                            ugroupService.assignRoleToUserGroup(ug.id, role_ids, function (data) {
                                if (data.result) {
                                    layer.closeAll();
                                    //初始化用户组树
                                    ugroupTree.getTree();
                                    ugroupTree.init();
                                    //初始化表单
                                    $("input[name='res']").click();
                                    //初始化验证规则
                                    $("#uGroup").data('bootstrapValidator').destroy();
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
        })
        //点击下一步
        ugroupTree.btnNext("ugroup_tab");
        //修改用户组
        $('#editUgroup').click(function () {
            if (!ugroupTree.isNodeSelected) {
                layer.msg('请选择要修改的用户组')
            } else {
                //表单校验
                ugroupValia.altValia();
                $('input[name="editugid"]').val(ugroupTree.nodeSelected.id)
                $('input[name="editugname"]').val(ugroupTree.nodeSelected.text);
                $('textarea[name="editugrem"]').val(ugroupTree.nodeSelected.remark);
                layer.open({
                    type: 1,
                    title: '修改用户组',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#edit_ugroup')
                })
                //点击下一步
                ugroupTree.btnNext('edit_ugroup_tab');
                $('#editform').on('success.form.bv',function () {
                    if (role_ids.length == 0) {
                        layer.msg('请选择用户组角色');
                        $("button[type='submit']").removeAttr('disabled');
                        return false;
                    } else {
                        var ug = {};
                        ug.id = $('input[name="editugid"]').val();
                        ug.name = $('input[name="editugname"]').val();
                        ug.remark = $('textarea[name="editugrem"]').val();
                        ugroupService.updateUserGroup(ug.id,ug,function (data) {
                            if (data.result) {
                                console.log("bb")
                                ugroupService.reassignRoleToUserGroup(ug.id,role_ids,function (data) {
                                    if (data.result) {
                                        layer.closeAll();
                                        ugroupTree.getTree();
                                        ugroupTree.init();
                                    }
                                })
                            } else {
                                layer.msg(data.description);
                                $("button[type='submit']").removeAttr('disabled');
                            }
                        })
                    }
                    return false;
                })
            }
        })
        //删除用户组
        $('#delUgroup').click(function () {
            if (!ugroupTree.isNodeSelected) {
                layer.msg("请选择要删除的用户组")
            } else {
                if (ugroupTree.nodeSelected) {
                    layer.confirm('确定删除用户组 ' + ugroupTree.nodeSelected.text + ' ?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        //删除操作
                        ugroupService.deleteUserGroupByIds(ugroupTree.nodeSelected.id, function (data) {
                            if (data.result) {
                                ugroupTree.getTree();
                                ugroupTree.init();
                                layer.closeAll();
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }
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
        var addUser;
        $('#addUser').click(function () {
            $('.form_datetime').datetimepicker('setStartDate', new Date());
            if (ugroupTree.nodeSelected) {
                $('input[name="ugroup"]').val(ugroupTree.nodeSelected.text);
            } else {
                $('input[name="ugroup"]').val('无');
            }
            addUser = layer.open({
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
        }).on('success.form.bv', function () {
            if (role_ids.length == 0) {
                layer.msg('请选择用户所属角色');
                $("button[type='submit']").removeAttr('disabled');
                return false;
            } else {
                //添加用户
                var user = {};
                user.loginName = $("input[name='uname']").val();
                user.loginPassword = hex_md5($("input[name='upwd']").val());
                user.gender = $("select[name='gender']").val();
                user.employeeNo = $("input[name='employeeNo']").val();
                user.realName = $("input[name='username']").val();
                user.state = '1';
                user.email = $("input[name='email']").val();
                user.domainCode = $("select[name='domain']").val();
                user.inbuiltFlag = '0';
                userService.add(user, function (data) {
                    if (data.result) {
                        var uid = data.data;
                        user.id = data.data;
                        //修改用户与用户组关联
                        if (ugroupTree.nodeSelected) {
                            userService.updateGroupIdByUserId(uid, ugroupTree.nodeSelected.id, function (data) {
                                if (data.result) {
                                    layer.msg(data.description);
                                } else {
                                    layer.msg(data.description);
                                }
                            })
                        }
                        //为用户赋予角色
                        userService.grantRole(uid, role_ids, function (data) {
                            if (data.result) {
                                layer.msg("添加用户成功")
                            } else {
                                layer.msg(data.description)
                            }
                        })
                        $('#user_table').bootstrapTable('append', user);
                        userState.switch();
                        layer.close(addUser);
                    }
                })
            }
            $("button[type='submit']").removeAttr('disabled')
            return false
        })
    })
