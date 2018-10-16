require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
        },
        'common': {
            deps: ['jquery'],
            exports: "common"
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "common": "../../common/js/util",
        "topBar": "../../../common/component/head/js/topbar",
        "layer": "../../../common/lib/layer/layer",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "domainService": "../../../common/js/service/DomainController",
        "buttons":"../../common/js/buttons"
    }
});
require(['jquery', 'topBar', 'layer', 'bootstrap', 'ztree', 'bootstrap-table', 'domainService','buttons'],
    function (jquery, topBar, layer, bootstrap, ztree, bootstrapTable, domainService,buttons) {
        /*头部*/
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });

        var setting = {};
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [
            {
                name: "默认管理域", open: true, icon: '../../domain/media/domain-img2.png', children: [
                    {
                        name: "研发中心",
                        open:true,
                        icon: '../../org/media/org.png',
                        children: [{name: "编码设备1",open:true,icon: "../../device/img/device.png"},{name: "编码设备2",open:true,icon: "../../device/img/device.png"}]
                    }, {name: "厂区", icon: '../../org/media/org.png'}]
            },
        ]
        $.fn.zTree.init($("#orgTree"), setting, zNodes)
        $('#server_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'deviceName',
                title: '设备名称',
                align: 'center'
            }, {
                field: 'code',
                title: '设备类型',
                align: 'center'
            }, {
                field: 'deviceAddress',
                title: '安装地址',
                align: 'center'
            }, {
                field: 'deviceOnlineStatus',
                title: '在线状态',
                align: 'center'
            }, {
                field: 'deviceIp',
                title: '设备IP地址',
                align: 'center'
            }, {
                field: 'amgPort',
                title: '拉流服务端口',
                align: 'center'
            }, {
                field: 'amgProto',
                title: '拉流协议',
                align: 'center'
            }, {
                field: 'adgPort',
                title: '运维端口',
                align: 'center'
            }, {
                field: 'adgProto',
                title: '运维设备协议',
                align: 'center'
            }, {
                field: 'deviceChaNum',
                title: '设备通道数',
                align: 'center'
            }, {
                field: 'deviceUser',
                title: '登录名',
                align: 'center'
            }, {
                field: 'modelId',
                title: '设备型号',
                align: 'center'
            }, {
                field: 'manuId',
                title: '设备厂商',
                align: 'center'
            }],
            height: 255
        })
    })