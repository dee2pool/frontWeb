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
        'colorpicker':{
            deps: ['jquery'],
            exports: "colorpicker"
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        // "jquery17": '../../../common/lib/jquery/jquery-1.7.min',
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
        "layx": "../../../common/lib/layx/layx",
        "colorpicker":"../lib/colorpicker/jquery.colorpicker"

    }
});
require(['jquery', 'frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree','layx','colorpicker'],
    function (jquery, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree,layx,colorpicker) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();

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
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false
            },
        };

        var zNodes =[
            { id:1, pId:0, name:"要素分类", open:true},
            { id:'11', pId:1, name:"点要素", open:true},
            { id:'12', pId:1, name:"线要素", open:true},
            { id:'13', pId:1, name:"面要素", open:true},
            { id:'101', pId:11, name:"建筑"},
            { id:'102', pId:11, name:"摄像头"},
            { id:'103', pId:11, name:"传感器"},
            { id:'104', pId:'12', name:"铁路"},
            { id:'105', pId:'12', name:"国道"},
            { id:'106', pId:'13', name:"区域地图"},
            { id:'107', pId:'13', name:"工厂地图"},
            { id:'108', pId:'13', name:"户型图"},

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
         * 节点增加事件
         * @param e
         */
        var newCount = 1;
        function add(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                isParent = e.data.isParent,
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            //既要保证选择了节点，也要保证选择的节点是点线面要素下的
            if (treeNode && (treeNode.id === '11' ||treeNode.id === '12'||treeNode.id === '13' )) {
                treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"new node" + (newCount++)});
            } else {
                alert("节点选择错误");
                return;
            }

        };

        /**
         * 点击测试事件
         * @param e
         */
        function onClick(e) {


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

            //点要素的显示
            if(treeNode.pId === '11'){
                $("#name").css("display","none");
                $("#icon").css("display","none");
                $("#icon-preview").css("display","none");
                $("#style").css("display","none");

                $("#name").css("display","block");
                $("#icon").css("display","block");
                $("#icon-preview").css("display","block");
            }

            //线要素的显示
            if(treeNode.pId === '12'){
                $("#name").css("display","none");
                $("#icon").css("display","none");
                $("#icon-preview").css("display","none");
                $("#style").css("display","none");
                $("#style-preview").css("display","none");

                $("#name").css("display","block");
                $("#style").css("display","block");

                $("#color").val("");

                $("#color").colorpicker({
                    fillcolor:true
                });

            }
            //面要素的显示
            if(treeNode.pId === '13'){
                $("#name").css("display","none");
                $("#icon").css("display","none");
                $("#icon-preview").css("display","none");
                $("#style").css("display","none");

                $("#name").css("display","block");
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

            //增加
            $("#add").bind("click", {isParent:true}, add);

        });

    });