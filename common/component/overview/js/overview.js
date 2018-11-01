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
    },
    paths: {
        "jquery": '../../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../../../config/common/js/util",
        "layer": "../../../../common/lib/layer/layer",
        "frame": "../../../../config/sidebar/js/wframe",
        "topBar": "../../../../common/component/head/js/topbar",
        "bootstrap-table": "../../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "bootstrapValidator": "../../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../../../configsidebar/js/menu",
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap','bootstrapValidator','bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'bootstrap-switch', 'topBar'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap,bootstrapValidator, datetimepicker, datetimepickerzhCN, bootstrapSwitch, topBar) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
    }
);
