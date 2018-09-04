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
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrap-datetimepicker": "../../common/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-switch": "../../common/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrap-datetimepicker.zh-CN": "../../common/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN"
    }
});
require(['jquery','frame','bootstrap-table','bootstrap','bootstrap-treeview','bootstrap-datetimepicker','bootstrap-datetimepicker.zh-CN','bootstrap-switch','topBar'],
    function (jquery, frame, bootstrapTable, bootstrap, treeview, datetimepicker,datetimepickerzhCN,bootstrapSwitch,topBar) {
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

        //组织树
        function getTree() {
            var tree = [{
                text: '默认用户组',
                nodes: [
                    {
                        text: '用户组1'
                    }, {
                        text: '用户组2'
                    }
                ]
            }]
            return tree;
        }
        var nodeIsSel = false;
        $('#ugrouptree').treeview({
            showBorder: false,
            nodeIcon: 'glyphicon glyphicon-user',
            data: getTree(),
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
        //添加用户组
        $('#addUgroup').click(function () {
            layer.open({
                type: 1,
                title: '添加用户组',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#add_ugroup')
            })
        })
        //角色表格
        $('.role_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '角色名称',
                align: 'center'
            }, {
                field: 'remark',
                title: '描述信息',
                align: 'center'
            }],
            data: [{
                name: '系统管理员',
                remark: '系统管理员'
            }],
            onClickRow: function (row, $element, field) {
                console.log("row" + row)
                console.log("$element" + $element)
                console.log("field" + field)
            }
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