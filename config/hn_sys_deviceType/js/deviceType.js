require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery','bootstrap-table'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap':{
            deps:['jquery'],
            exports:"bootstrap"
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'deviceTypeService': {
            deps: ['common'],
            exports: 'deviceTypeService'
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../../../index/js/wframe",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../../../index/js/menu",
        "MenuService": "../../../../common/js/MenuController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-treeview": "../../../common/libs/bootstrap/js/bootstrap-treeview",
        "deviceTypeService": "../../../../common/js/DeviceTypeController"
    }
});
require(['jquery', 'frame', 'bootstrap-table', 'bootstrapValidator','deviceTypeService','common'],
    function (jquery, frame, bootstrapTable, bootstrapValidator, deviceTypeService,common) {
        frame.init();
        deviceTypeService.getTypeList("device_type_table")
    })