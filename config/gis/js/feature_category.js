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
            //点要素
            { id:'21', pId:11, name:"业务分类"},
            { id:'22', pId:11, name:"自定义分类"},
            //线要素
            { id:'23', pId:12, name:"业务分类"},
            { id:'24', pId:12, name:"自定义分类"},
            //面要素
            { id:'25', pId:13, name:"业务分类"},
            { id:'26', pId:13, name:"自定义分类"},

            //点要素自定义
            { id:'101', pId:22, name:"建筑"},
            { id:'102', pId:22, name:"摄像头"},
            { id:'103', pId:22, name:"传感器"},
            //点要素业务分类
            { id:'109', pId:21, name:"设备"},
            { id:'110', pId:21, name:"人"},
            { id:'111', pId:109, name:"海康"},
            { id:'112', pId:109, name:"大华"},


            //线要素自定义
            { id:'104', pId:'24', name:"铁路"},
            { id:'105', pId:'24', name:"国道"},
            //面要素自定义
            { id:'106', pId:'26', name:"区域地图"},
            { id:'107', pId:'26', name:"工厂地图"},
            { id:'108', pId:'26', name:"户型图"},

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
            if (treeNode && (treeNode.id != '1' && treeNode.id != '11' && treeNode.id != '13' && treeNode.id != '12' && treeNode.id != '21' && treeNode.id != '23' && treeNode.id != '25' )) {
                treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"新加要素分类"});
            } else {
                alert("元素分类必须属于点线面要素自定义分类下，请重新选择！");
                return;
            }

        };

        /**
         * 点击测试事件
         * @param e
         */
        function onClick(e){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };

            //显示状态的重置
            $("#name").css("display","none");
            $("#e-name").css("display","none");
            $("#e-icon").css("display","none");
            $("#icon-preview").css("display","none");
            $("#style").css("display","none");
            $("#feature-edit").css("display","none");



            $("#name").css("display","block");
            //$("#e-icon").css("display","block");
            $("#icon-preview").css("display","block");
            //$("#style").css("display","block");


            $("#category-name").val(treeNode.name);
            $("#e-category-name").val(treeNode.name);

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
        function edit(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };
            // $(‘input’).attr(“readonly”,true)//将input元素设置为readonly
            // $(‘input’).attr(“readonly”,false)//去除input元素的readonly属性

            // $("#btn").attr({"disabled":"disabled"});
            // $("#btn").attr("disabled","disabled");


            $("#name").css("display","none");
            $("#e-name").css("display","none");
            $("#e-icon").css("display","none");
            $("#icon-preview").css("display","none");
            $("#style").css("display","none");
            $("#feature-edit").css("display","none");

            $("#e-name").css("display","block");
            $("#e-icon").css("display","block");
            $("#icon-preview").css("display","block");
            $("#style").css("display","block");
            $("#feature-edit").css("display","block");

            // //点要素的显示
            // if(treeNode.pId === '11'){
            //     //将所有表单项先全部隐藏
            //     $("#name").css("display","none");
            //     $("#icon").css("display","none");
            //     $("#icon-preview").css("display","none");
            //     $("#style").css("display","none");
            //
            //     //把适当需要的显示出来
            //     $("#name").css("display","block");
            //     $("#icon").css("display","block");
            //     $("#icon-preview").css("display","block");
            //
            //     $("#category-name").val(treeNode.name);
            // }
            //
            // //线要素的显示
            // if(treeNode.pId === '12'){
            //     $("#name").css("display","none");
            //     $("#icon").css("display","none");
            //     $("#icon-preview").css("display","none");
            //     $("#style").css("display","none");
            //     $("#style-preview").css("display","none");
            //
            //     $("#name").css("display","block");
            //     $("#style").css("display","block");
            //
            //     $("#color").val("");
            //
            //     $("#color").colorpicker({
            //         fillcolor:true
            //     });
            //
            //     $("#category-name").val(treeNode.name);
            //
            // }
            // //面要素的显示
            // if(treeNode.pId === '13'){
            //     $("#name").css("display","none");
            //     $("#icon").css("display","none");
            //     $("#icon-preview").css("display","none");
            //     $("#style").css("display","none");
            //     $("#name").css("display","block");
            //     $("#category-name").val(treeNode.name);
            // }
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

            initHeight();

        });

        //通过获取class=content的高度，从而对class=tab中的内容进行高度赋值
        function initHeight() {
            console.log($(".content").height());
            var height = 'height:'+$(".content").height()+'px !important';
            //$("div.test").css("cssText", "width:650px !important;");
            $(".left").css('cssText',height)
            $(".right").css('cssText',height)
        }

    });