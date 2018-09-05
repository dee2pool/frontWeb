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

        //本页使用
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
    }
});
require(['jquery', 'frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree'],
    function (jquery, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();

        //用localStorage进行相应的位置信息的处理
        //localStorage.setItem('myCat', 'Tom');
        //console.log(localStorage.getItem('myCat'))

        // var level1 = ["请选择","点类型", "线类型", "面类型"];
        // var level2 = ["请选择","建筑","设备", "道路","轨迹", "房间结构","区域地图"];

        // $(function () {
        //     var f1 = document.getElementById('feature-level1');
        //     f1.length = level1.length;
        //     for (var i = 0; i < level1.length; i++) {
        //         f1.options[i].text = level1[i];
        //         f1.options[i].value = level1[i];
        //     };
        //
        //     var f2 = document.getElementById('feature-level2');
        //     f2.length = level2.length;
        //     for (var j = 0; j < level2.length; j++) {
        //         f2.options[j].text = level2[j];
        //         f2.options[j].value = level2[j];
        //     };
        // });


        //地图的加载
        var host = "http://192.168.0.142:8060"
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
         * 树的加载
         */

        //ztree
        var setting = {
            view: {
                selectedMulti: false
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
                beforeDrag: beforeDrag,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                onRemove: onRemove,
                onClick: onClick
            }
        };

        var zNodes = [
            {id: 'china', pId: 0, name: "中国", open: true},
            {id: 'hunan', pId: 'china', name: "湖南"},
            {id: 'changsha', pId: 'hunan', name: "长沙市"},
            {id: 'changde', pId: 'hunan', name: "常德市"},
            {id: 'xiangtan', pId: 'hunan', name: "湘潭市"},
            {id: 'csxian', pId: 'changsha', name: "长沙县"},
            {id: 'kaifu', pId: 'changsha', name: "开福区"},
            {id: 'tianxin', pId: 'changsha', name: "天心区"},
            {id: 'hngd', pId: 'csxian', name: "华南光电",coors:[28.25219321,113.08259818]},
            {id: 'fhc', pId: 'csxian', name: "凤凰城",coors:[28.25380815,113.08434188]},
            {id: 'wxh', pId: 'csxian', name: "万象汇",coors:[28.25433718,113.08051083]},

        ];
        var log, className = "dark";

        function beforeDrag(treeId, treeNodes) {
            return false;
        }

        function beforeRemove(treeId, treeNode) {
            className = (className === "dark" ? "" : "dark");
            showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
        }

        function onRemove(e, treeId, treeNode) {
            showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }

        function beforeRename(treeId, treeNode, newName) {
            if (newName.length == 0) {
                alert("节点名称不能为空.");
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                setTimeout(function () {
                    zTree.editName(treeNode)
                }, 10);
                return false;
            }
            return true;
        }

        var newCount = 1;

        function add(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                isParent = e.data.isParent,
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (treeNode) {
                treeNode = zTree.addNodes(treeNode, {
                    id: (100 + newCount),
                    pId: treeNode.id,
                    isParent: isParent,
                    name: "new node" + (newCount++)
                });
            } else {
                treeNode = zTree.addNodes(null, {
                    id: (100 + newCount),
                    pId: 0,
                    isParent: isParent,
                    name: "new node" + (newCount++)
                });
            }
            if (treeNode) {
                zTree.editName(treeNode[0]);
            } else {
                alert("叶子节点被锁定，无法增加子节点");
            }
        };

        function edit() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            }else{
                //样式修改
                $(".feature-center").css('height','60%');
                $(".feature-foot").css('display','inline-block');
                console.log(treeNode);
                $("#feature-name").val(treeNode.name);
            }
        };

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

        //联动事件，当点击下拉菜单时，右侧的地图的位置也随之更改
        var clickTreePoint = null; //点击树，在地图上生成的点
        function onClick(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            //当坐标存在时，才向地图上加点
            if(treeNode.coors != undefined){
                if(clickTreePoint != null){
                    map.removeLayer(clickTreePoint);
                    clickTreePoint = null;
                }
                clickTreePoint = L.marker(treeNode.coors).addTo(map);
                map.panTo(treeNode.coors);
            }
        };

        /**
         * 位置关联
         */
        $("#setPosition").on("click",function () {
            var category = $('#feature-level1 option:selected').val();
            console.log(category);
        });

        $(document).ready(function () {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            $("#addParent").bind("click", {isParent: true}, add);
            $("#edit").bind("click", edit);
            $("#remove").bind("click", remove);
        });







    });