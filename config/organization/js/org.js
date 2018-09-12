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
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "ugroupService": "../../../common/js/service/UserGroupController"
    }
});
require(['jquery', 'frame', 'bootstrap', 'bootstrap-treeview','topBar'],
    function (jquery,frame,bootstrap,treeview,topBar) {
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
        /*管理中心树*/
        function getTree() {
            var tree = [{
                text: '默认控制中心',
                nodes: [
                    {
                        text: '动环'
                    }, {
                        text: '门禁'
                    }, {
                        text: '1期',
                        nodes: [{
                            text: '1期01'
                        }, {
                            text: '1期02'
                        }]
                    }
                ]
            }]
            return tree;
        }

        $('#tree').treeview({
            showBorder: false,
            selectedBackColor: 'white',
            selectedColor: 'black',
            data: getTree()
        })
        function addOrg() {
            $('#alt-org').hide();
            $('#add-org').show();
        }
})