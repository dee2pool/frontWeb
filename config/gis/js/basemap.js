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
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'ztree':{
            deps: ['jquery'],
            exports: "ztree"
        },
        'layx': {
            exports: 'layx'
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrap-switch": "../../common/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",

        //本页使用的js
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "layx": "../../../common/lib/layx/layx"

    }
});
require(['jquery', 'frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree','layx'],
    function (jquery, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree,layx) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //地图的加载
        var host = "http://192.168.0.142:8060"

        //树的加载
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: onClick,
                onRemove: onRemove,
            }
        };

        var zNodes =[
            { id:1, pId:0, name:"中国", open:true},
            { id:11, pId:1, name:"湖南省"},
            { id:'cs', pId:11, name:"长沙市"},
            { id:'cd', pId:11, name:"常德市"},
            { id:'csx', pId:'cs', name:"长沙县"},
            { id:'ylq', pId:'cs', name:"岳麓区"},
            { id:'bd', pId:'csx', name:"百度地图"},
            { id:'tdt', pId:'csx', name:"天地图"},
            { id:12, pId:1, name:"湖北省"},

        ];

        /**
         * 删除节点
         * @param e
         */
        function onRemove(e, treeId, treeNode) {
            showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }
        function remove(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            }
            var callbackFlag = $("#callbackTrigger").attr("checked");
            zTree.removeNode(treeNode, callbackFlag);
        };

        /**
         *
         * @param e
         */
        function onClick(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };

        };

        /**
         * 查看地图
         */
        function showMap() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };
            console.log(treeNode);
            if(treeNode.id === 'tdt'){
                $("#map").css("display","block");
                $("#information").css("display","none");
                /**
                 * 核心地图变量
                 */
                var map = L.map('map', {
                    center: [28.25152980300004, 113.08251277400007],
                    maxZoom: 17,
                    minZoom: 15,
                    zoom: 15,
                    crs: L.CRS.EPSG4326,
                });

                //天地图星沙瓦片地图加载
                var xsTileLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:xstd17@EPSG:4326@png/{z}/{x}/{y}.png', {
                    tms: true,
                    maxZoom: 17,
                    minZoom: 15,
                    reuseTiles: true
                }).addTo(map);//添加tms
            }
        }

        /**
         * 编辑信息
         */
        function edit() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };

            if(treeNode.id === 'tdt'){
                $("#map").css("display","none");
                $("#information").css("display","block");
            }
        }


        $(document).ready(function(){
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);

            //移除节点
            $("#remove").bind("click", remove);

            //查看地图
            $("#show-map").bind("click", showMap);

            //编辑
            $("#edit").bind("click",edit);

        });

        //地图供应商打开设计
        $("#supplier-config").on("click",function () {
            layx.html('str','字符串文本','Hello Layx!');
        })

        // //change事件测试
        // $("#testSelect").bind("change",function (obj) {
        //     console.log(obj.target.value)
        // });

    });