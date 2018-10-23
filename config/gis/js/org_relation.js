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
            exports: "lay"
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
        'draw':{
            deps: ['leaflet'],
            exports: "draw"
        },
        'zui':{
            deps:['jquery'],
            export:'zui'
        },
        'layx': {
            exports: 'layx'
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../../common/lib/bootstrap/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",


        //本页使用
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "draw": "../../../common/lib/leaflet/lib/draw/Leaflet.Draw",
        "layx": "../../../common/lib/layx/layx",

    }
});
require(['jquery','common','bootstrap','bootstrap-table', 'frame','bootstrapValidator','bootstrap-treeview','topBar','leaflet','ztree', 'draw', 'layx','layer'],
    function ($,common,bootstrap,bootstrapTable,  frame, bootstrapValidator,treeview,topBar,leaflet,ztree,draw,layx,lay) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //全局通用变量，用于所有的绘图图层
        var drawGroup = new L.FeatureGroup();

        //地图的加载
        var host = "http://192.168.0.142:8060";

        //后台地址
        var end = common.end;

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


        /**
         * 组织关联按钮触发
         */
        $("#relation").on("click",function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if(treeNode === undefined){
                alert("请先选择一个组织节点");
                return;
            }
            else{
                //用之前先清空一下图层，重新加载一下
                drawGroup.clearLayers();
                drawGroup.remove();
                drawGroup.addTo(map);
                var drawer = new L.Draw.Marker(map);
                drawer.enable(); //启动工具
                map.on('draw:created',
                    function (e) {
                        var type = e.layerType,
                            drawlayer = e.layer;
                        drawGroup.addLayer(drawlayer);
                        //弹出layx对话框，是否确定这个位置，如果确认，执行异步操作，如果不确定，当前点移除
                        // console.log(1);
                        // lay.confirm('确定当前位置吗？', {
                        //     btn: ['确定','取消'] //按钮
                        // }, function(){
                        //     lay.msg('保存成功');
                        //     treeNode.font.color = "red";
                        //     zTree.updateNode(nodes[0]);
                        //     drawer.disable();
                        // }, function(){
                        //     drawGroup.removeLayer(drawlayer);
                        // });
                    }
                );


                map.on("draw:drawstop",function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    // Do whatever else you need to. (save to db; add to map etc)
                    console.log(layer);
                });
                //drawer = null;
            }

        });



        $(document).ready(function () {
            var setting = {
                view: {
                    selectedMulti: false,
                    fontCss: getFont,
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                data: {
                    keep: {
                        parent: true,
                        leaf: true
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: onClick

                }
            };
            //左侧默认区域树
            var zNodes = [
                {id: 'china', pId: '0', name: "中国", open: true,font:{'color':'black'}},
                {id: 'hunan', pId: 'china', name: "湖南",open: true,font:{'color':'black'}},
                {id: 'changsha', pId: 'hunan', name: "长沙市",font:{'color':'black'}},
                {id: 'csxian', pId: 'changsha', name: "长沙县",font:{'color':'black'}},
                {id: 'hngd', pId: 'csxian', name: "华南光电",font:{'color':'black'}},
                {id: 'syh', pId: 'csxian', name: "松雅湖",font:{'color':'black'}},
                {id: 'qcz', pId: 'csxian', name: "汽车站",font:{'color':'black'}},
            ];
            function getFont(treeId, node) {
                return node.font ? node.font : {};
            };
            function onClick(event, treeId, treeNode, clickFlag) {
                console.log('执行ajax查询的事件');
            };
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);

        });



    });