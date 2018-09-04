require.config({
    shim: {
        'echarts': {
            deps: ['jquery'],
            export: 'echarts'
        },
        'ztree': {
            deps: ['jquery'],
            export: 'ztree'
        },
    },
    paths: {
        "jquery": "../../common/lib/jquery/jquery-3.3.1.min",
        "echarts": "../../common/lib/echarts/echarts",
        "common": "../../common/js/common",
        "depot": "../js/depot",
        "ztree": "../lib/ztree/js/jquery.ztree.all.min",
    }
});
require(["jquery", "echarts", "common", "depot", "ztree"], function ($, echarts, common, depot, ztree) {
    $("#head").html(depot.head);

    $(function () {
        // getHt();
    })


    //获取div的高度,给核心div赋予高度
    function getHt() {
        var all_height = $(window).height();
        var div_height = all_height - 80;
        $("#core").css("height", div_height + "px");
    }

    // 右侧的树加载
    var setting = {
        view: {
            dblClickExpand: false
        },
        check: {
            enable: false
        }

    };
    var zNodes = [
        {
            "id": 0, "name": "全国", "open": true, icon: "../img/down1.png", children: [
                {
                    "id": 1, "pid": 0, "name": "长沙", "open": true, icon: "../img/page.png",
                    children: [
                        { "id": 11, "pid": 1, "name": "设备1" },
                        { "id": 12, "pid": 1, "name": "设备2" },
                        { "id": 13, "pid": 1, "name": "设备3" }
                    ]
                },
                {
                    "id": 2, "pid": 0, "name": "北京", icon: "../img/page.png",
                    children: [
                        { "id": 21, "pid": 2, "name": "设备4" },

                        { "id": 23, "pid": 2, "name": "设备5" }
                    ]
                },
                {
                    "id": 3, "pid": 0, "name": "广州", icon: "../img/page.png",
                    children: [
                        { "id": 31, "pid": 3, "name": "设备6" },

                        { "id": 33, "pid": 3, "name": "设备7" }
                    ]
                }
            ]
        }

    ];

    var zTree;
    $(document).ready(function () {
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        $.fn.zTree.init($("#treeDemo1"), setting, zNodes);
        $.fn.zTree.init($("#treeDemo2"), setting, zNodes);
        zTree = $.fn.zTree.getZTreeObj("treeDemo");
    });
});