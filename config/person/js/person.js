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
        "bootstrap-datetimepicker.zh-CN": "../../common/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap', 'bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'topBar'],
    function (jquery, common, frame, bootstrapTable, bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, topBar) {
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
        //部门树
        $('#depttree').treeview({
            showBorder: false,
            selectedBackColor: 'white',
            selectedColor: 'black',
            data: [{
                text: '默认部门',
                nodes: [
                    {
                        text: '研发部门'
                    }, {
                        text: '测试部门'
                    }
                ]
            }]
        })
        //添加部门
        $('#addDept').click(function () {
            layer.open({
                type: 1,
                title: '添加部门',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('.add_dept')
            })
        })
        //添加人员弹窗
        $('#addPerson').click(function () {
            layer.open({
                type: 1,
                title: '添加人员',
                offset: '100px',
                area: '650px',
                resize: false,
                zIndex: 1000,
                content: $('.add_person')
            })
        })
        //日历控件
        $('.form_datetime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            pickerPosition: 'bottom-left'
        });
        //点击下一步
        $('.btn-next').click(function () {
            $('#per_tab a:last').tab('show')
        })
        //点击取消
        $('.btn-cancel').click(function () {
            layer.closeAll();
        })
        //人员表格
        $('#person_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: '序号',
                align: "center"
            },{
                field: 'name',
                title: '姓名',
                align: "center"
            }, {
                field: 'gender',
                title: '性别',
                align: "center"
            }, {
                field: 'perImg',
                title: '图像',
                align: "center"
            }, {
                field: 'dept',
                title: '所属部门',
                align: "center"
            }, {
                field: 'cardType',
                title: '证件类型',
                align: "center"
            }, {
                field: 'cardNo',
                title: '证件号',
                align: "center"
            }, {
                field: 'birdate',
                title: '出生日期',
                align: "center"
            }, {
                field: 'education',
                title: '学历',
                align: "center"
            }, {
                field: 'phone',
                title: '联系电话',
                align: "center"
            }, {
                field: 'address',
                title: '联系地址',
                align: "center"
            }, {
                field: 'email',
                title: '邮箱',
                align: "center"
            }, {
                field: 'indate',
                title: '到职日期',
                align: "center"
            }, {
                field: 'outdate',
                title: '离职日期',
                align: "center"
            }, {
                field: 'remark',
                title: '备注',
                align: "center"
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
            data:[{
                id:1,
                name:'张三',
                gender:'男',
                perImg:'<img src="../img/pimg.jpg" width="30px" height="30px">',
                dept:'研发中心',
                cardType:"身份证",
                cardNo:"11111111111",
                birdate:'1999-1-1',
                education:'本科',
                phone:'',
                address:'',
                email:'',
                indate:'',
                outdate:'',
                remark:''
            }]
        })
        //迁移人员
        $('#movePerson').click(function () {
            var selecte=$('#person_table').bootstrapTable('getSelections');
            if(selecte.length==0){
                layer.msg("请选择要迁移的人员");
            }else{
                layer.open({
                    type: 1,
                    title: '迁移人员',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('.changeDept')
                })
            }
        })
    })