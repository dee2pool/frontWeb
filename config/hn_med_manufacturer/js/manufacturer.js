require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery', 'bootstrap-table'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: "bootstrap"
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'manufacturerService':{
            deps:['common'],
            exports:"manufacturerService"
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
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "manufacturerService":"../../../common/js/service/DeviceManufacturerController"
    }
});
require(['jquery','layer','frame', 'bootstrap-table', 'bootstrapValidator','common','topBar','manufacturerService'],
    function (jquery,layer,frame, bootstrapTable, bootstrapValidator, common,topBar,manufacturerService) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //初始化表格
        var init_page = {
            pageNumber: 1,
            pageSize: 50,
            parameter: {}
        }
        manufacturerService.getManuList(init_page,function (data) {
            if(data.result){
                $('#manufacturer_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    },{
                        field: 'manuName',
                        title: '厂商名称',
                        align: 'center'
                    }, {
                        field: 'manuIdentity',
                        title: '厂商标识',
                        align: 'center'
                    }, {
                        field: 'manuDesc',
                        title: '描述',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        formatter: function () {
                            var icons = "<div class='btn-group-sm'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data:data.data,
                    pagnation:true,
                    pageList:[10,15,20]
                })
            }
        })
})