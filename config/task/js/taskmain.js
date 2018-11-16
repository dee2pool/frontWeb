require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
        },
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
        'bootstrap-table-zh-CN': {
            deps: ['bootstrap-table', 'jquery'],
            exports: "bootstrapTableZhcN"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "frame": "../../sidebar/js/wframe",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "topBar": "../../../common/component/head/js/topbar",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "ztreeCheck": "../../../common/lib/ztree/js/jquery.ztree.excheck"
    }
});
require(['jquery', 'common', 'layer','bootstrap','frame','bootstrapValidator', 'bootstrap-table', 'bootstrap-table-zh-CN','topBar', 'ztree'],
    function (jquery, common, layer,bootstrap,frame,bootstrapValidator, bootstrapTable, bootstrapTableZhcN,topBar,ztree) {
        //初始化frame
        $('#sidebar').html(frame.taskHtm);
        frame.showLeave();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 任务表格 ***************************************/
        var taskTable={};
        taskTable.init=function () {
            $('#task_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'taskId',
                    title: '任务编号',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '任务类型',
                    align: 'center'
                }, {
                    field: 'triggerTime',
                    title: '优先级',
                    align: 'center'
                }, {
                    field: 'triggerTime',
                    title: '开始时间',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '周期模板',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '执行操作',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '提交状态',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '备注',
                    align: 'center'
                }, {
                    title: '操作',
                    align: 'center',
                    events: {
                        "click #edit": function (e, value, row, index) {

                        },
                        "click #del": function (e, value, row, index) {

                        }
                    },
                    formatter: function () {
                        var icons = "<button id='edit' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>修改</button>" +
                            "<button id='del' class='btn btn-danger btn-xs'><i class='fa fa-remove'></i>删除</button>"
                        return icons;
                    }
                }]
            })
        }
        taskTable.init();
        //初始化表格高度
        $('#domain_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#domain_table');
        /********************************* 添加任务 ***************************************/
        var addTask={};

        addTask.init=function () {
            $('#addTask').click(function () {
                layer.open({
                    type: 1,
                    title: '添加任务',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '800px',
                    resize: false,
                    content: $('#add_task'),
                    cancel: function (index, layero) {

                    }
                })
            })    
        }
        addTask.init();

    })