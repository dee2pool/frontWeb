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
        'ugroupService':{
            deps:['common'],
            exports:"ugroupService"
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
        "ugroupService":"../../../common/js/service/UserGroupController"
    }
});
require(['jquery', 'frame', 'bootstrap-table', 'bootstrap','bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'bootstrap-switch', 'topBar','ugroupService'],
    function (jquery, frame, bootstrapTable, bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, bootstrapSwitch, topBar,ugroupService) {
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
        //获得所有用户组信息
        var tree=[];
        var temp={};
        ugroupService.listAllUserGroup(function (data) {
            if(data.result){
                //将节点封装成树形结构
                for(var i=0;i<data.data.length;i++){
                    //向下拉框中添加
                    $('select[name="ugroupPre"]').append('<option value="'+data.data[i].id+'">'+
                        data.data[i].name
                        +'</option>')
                    temp[data.data[i].id]=data.data[i];
                }
                for(i=0,l=data.data.length;i<l;i++){
                    var key=temp[data.data[i].parentId];
                    if(key){
                        if(!key["nodes"]){
                            key["nodes"]=[];
                            key["nodes"].push({id:data.data[i].id,text:data.data[i].name});
                        }else{
                            key["nodes"].push({id:data.data[i].id,text:data.data[i].name});
                        }
                    }else{
                        tree.push({id:data.data[i].id,text:data.data[i].name});
                    }
                }
            }
        })
        console.log(JSON.stringify(tree))
        var nodeIsSel = false;
        $('#ugrouptree').treeview({
            showBorder: false,
            nodeIcon: 'glyphicon glyphicon-user',
            data: tree,
            onNodeSelected: function (event, data) {
                nodeIsSel = true;
                //TODO 获得节点信息
            }
        })
        //用户表格
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
            data: [{
                id: 1,
                uname: "测试用户1",
                name: "测试",
                role: "系统管理员",
                date: "2018-10-2 15:28",
                online: 1
            }]
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
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            pickerPosition: 'bottom-left'
        });
        //点击取消
        $('.btn-cancel').click(function () {
            layer.closeAll();
        })
        //添加用户组
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
        $('.role_table').bootstrapTable({
            columns: [{
                field: 'name',
                title: '角色名称',
                align: 'center'
            }, {
                field: 'remark',
                title: '描述信息',
                align: 'center'
            }],
            data: [{
                id: '888',
                name: '系统管理员1',
                remark: '系统管理员'
            }, {
                id: '999',
                name: '系统管理员2',
                remark: '系统管理员'
            }],
            onClickRow: function (row, $elem, field) {
                //判断表单提交是否被禁用
                if($("button[type='submit']").attr('disabled')=='disabled'){
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
        //表单提交
        $('#uGroup').submit(function () {
            if (role_ids.length == 0) {
                layer.msg('请选择用户组角色');
                return false;
            }else{
                //添加用户组
                var ug={};
                ug.id=$("input[name='ugroupid']").val();
                ug.name=$("input[name='ugroupname']").val();
                ug.parentId=$("select[name='ugroupPre']").val();
                ug.remark=$("textarea[name='ugroupRem']").val();
                ugroupService.addUserGroup(ug,function (data) {
                    if(data.result){
                        //为用户组添加权限
                        ugroupService.assignRoleToUserGroup(ug.id,role_ids,function (data) {
                            if(data.result){
                                layer.msg('添加成功')
                                layer.closeAll();
                            }else{
                                layer.msg(data.description);
                            }
                        })
                    }else{
                        layer.msg(data.description);
                    }
                })
            }
            $("button[type='submit']").removeAttr('disabled')
            return false
        })
        //区域树
        $('#areatree').treeview({
            showBorder: false,
            nodeIcon: 'glyphicon glyphicon-cloud',
            data: [{
                text: '测试区域1',
                nodes: [
                    {
                        text: '测试区域11'
                    }, {
                        text: '测试区域12'
                    }
                ]
            }],
            onNodeSelected: function (event, data) {

            }
        })
        //添加用户
        $('#addUser').click(function () {
            if (nodeIsSel) {
                layer.open({
                    type: 1,
                    title: '添加用户',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    zIndex: 1000,//日期控件的zIndex为1001
                    content: $('#add_user')
                })
            } else {
                layer.msg('请选择用户组!')
            }
        })
        //点击下一步
        $('.btn-next').click(function () {
            var $actTab;
            $('#add_user li').each(function () {
                if ($(this).hasClass('active')) {
                    $actTab = $(this);
                }
            });
            $actTab.children().tab('show')
        })
        /*密码强度*/
        $('#pwdinput').keyup(function () {
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
    })

/*/!*添加用户选择*!/
$('#user dd').click(function () {
    var id = $(this).attr('id')
    $(".right-content>div[style!='display:none']").hide();
    $("#t_" + id).show();
})
//添加Mac地址
var id = 0;
$('#addMac').click(function () {
    id++;
    $('#add_mac').after('<div><input type="text" style="width: 280px;margin-bottom: 10px;margin-right: 15px;display: inline-block" class="form-control">' +
        '<a id="Mac_' + id + '" name="removeMac" href="#" onclick="removeMac($(this).id)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></a></div>')
})*/