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
        'draw':{
            deps: ['leaflet'],
            exports: "draw"
        },
        'zui':{
            deps:['jquery'],
            export:'zui'
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

        //本页使用
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "draw": "../../../common/lib/leaflet/lib/draw/Leaflet.Draw",
        "zui":"../../../main/common/lib/zui/js/zui",
    }
});
require(['jquery', 'frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree', 'draw', 'zui'],
    function (jquery, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree,draw,zui) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //全局通用变量，用于所有的绘图图层
        var drawGroup = new L.FeatureGroup();

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
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            }
            if (treeNode) {
                treeNode = zTree.addNodes(treeNode, {
                    id: (100 + newCount),
                    pId: treeNode.id,
                    //控制是否为叶子节点
                    isParent: isParent,
                    name: "new node" + (newCount++),
                    coors:undefined,
                    img:undefined
                });
            }
            if (treeNode) {
                zTree.editName(treeNode[0]);
            } else {
                alert("叶子节点被锁定，无法增加子节点");
            }
        };

        /**
         * 编辑事件，点击位置关联弹出下方
         */
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
                $("#feature-coors").val(treeNode.coors);
                // $("#upload-img").val("");
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

        /**
         * 点击联动事件
         * @type {null}
         */
        var clickTreePoint = L.marker(); //点击树，在地图上生成的点
        var clickTreePolygon = L.polygon([]);
        var clickGroup = new L.FeatureGroup();
        function onClick(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];

            //图层的清除操作
            clickGroup.clearLayers();
            clickGroup.remove();
            clickGroup.addTo(map);

            //点要素
            if(treeNode.category === 'feature-point'){
                //当坐标存在时，才向地图上加点
                //$.zui.store.get('coors');
                var coors = $.zui.store.get(treeNode.id + 'coors');
                if(coors != undefined){
                    // if(clickTreePoint != null){
                    //     map.removeLayer(clickTreePoint);
                    //     clickTreePoint = null;
                    // }
                    var layer = L.marker(coors).addTo(map);
                    clickGroup.addLayer(layer);
                    map.panTo(coors);
                }
                else
                {

                }
            }

            //线要素
            if(treeNode.category === 'feature-line'){

            }

            //面要素
            if(treeNode.category === 'feature-polygon'){
                var coors = $.zui.store.get(treeNode.id + 'coors');
                if(coors != undefined){
                    var coorsSplice = coors.splice(',');
                    var imageBounds = [[coorsSplice[0], coorsSplice[1]], [coorsSplice[2], coorsSplice[3]]];
                    var layer = L.imageOverlay(treeNode.img, imageBounds).addTo(map);
                    map.panTo([coorsSplice[0], coorsSplice[1]]);
                    clickGroup.addLayer(layer);
                }
            }



        };

        /**
         * 位置关联
         */
        var imageoverlay = null;//面要素叠加的临时变量
        $("#setPosition").on("click",function () {
            var category = $('#feature-level1 option:selected').val();

            //如果没有上传图片，需要进行提示的操作

            if(category === 'feature-point' || category === 'feature-polygon'){
                if($("#upload-img").val() == ''){
                    alert('请先上传图像');
                    return ;
                }
            }


            /**
             * 构造线要素
             */
            if(category === 'feature-point'){
                var index = null;
                //用之前先清空一下图层，重新加载一下
                drawGroup.clearLayers();
                drawGroup.remove();
                drawGroup.addTo(map);


                var objUrl = getObjectURL(document.getElementById('upload-img').files[0]) ;
                function getObjectURL(file) {
                    var url = null;
                    if (window.createObjectURL != undefined) { // basic
                        url = window.createObjectURL(file);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        url = window.URL.createObjectURL(file);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        url = window.webkitURL.createObjectURL(file);
                    }
                    return url;
                }

                var drawer = new L.Draw.Marker(map, {
                        icon: L.icon({
                            iconUrl: objUrl,
                        })
                });

                drawer.enable(); //启动工具
                map.on('draw:created',
                    function (e) {
                        var type = e.layerType,
                            drawlayer = e.layer;
                        drawGroup.addLayer(drawlayer);
                        console.log(drawlayer);
                        $("#feature-coors").val(drawlayer._latlng);
                    }
                );
                drawer = null;
            }

            //构造线要素
            if(category === 'feature-line'){
                var index = null;
                //用之前先清空一下图层，重新加载一下
                drawGroup.clearLayers();
                drawGroup.remove();
                drawGroup.addTo(map);

                //构造画图工具
                var drawer = new L.Draw.Polyline(map);
                drawer.enable(); //启动工具

                map.on('draw:created', function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    drawGroup.addLayer(layer);
                    console.log(layer);
                    // var coors = layer._latlngs;
                    // $.zui.store.set('test' + layer._latlngs[0].lat);

                });

                drawer = null;


            }

            /**
             * 构造面要素
             */
            if(category === 'feature-polygon'){
                var index = null;
                //用之前先清空一下图层，重新加载一下
                drawGroup.clearLayers();
                drawGroup.remove();
                drawGroup.addTo(map);

                //图片路径获取
                var imgUrl = getObjectURL(document.getElementById('upload-img').files[0]) ;
                function getObjectURL(file) {
                    var url = null;
                    if (window.createObjectURL != undefined) { // basic
                        url = window.createObjectURL(file);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        url = window.URL.createObjectURL(file);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        url = window.webkitURL.createObjectURL(file);
                    }
                    return url;
                }

                //构造画图工具
                var drawer = new L.Draw.Rectangle(map);
                drawer.enable(); //启动工具

                map.on('draw:created', function (e) {
                    var type = e.layerType,
                        layer = e.layer;

                    var imageBounds = [[layer._bounds._southWest.lat, layer._bounds._southWest.lng], [layer._bounds._northEast.lat, layer._bounds._northEast.lng]];
                    $("#feature-coors").val(imageBounds);

                    imageoverlay = L.imageOverlay(imgUrl, imageBounds).addTo(map);

                    drawGroup.addLayer(imageoverlay);

                });

                drawer = null;
            }


            if(category === 'none'){
                alert('请先选择要素类型');
            }
        });

        //确认提交
        $("#feature-submit").on("click",function () {

            //获取树对象
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];

            //修改treenode的值
            treeNode.name = $("#feature-name").val();

            //获取所属分类
            var category = $('#feature-level1 option:selected').val();

            //点要素提交情况
            if(category === 'feature-point'){
                var coors = $("#feature-coors").val();
                //字符串的截取处理
                coors = coors.slice(7,coors.length-1);
                coors = coors.split(',');
                treeNode.coors = coors;
                treeNode.category = 'feature-point';
                $.zui.store.set(treeNode.id + 'coors', coors);
                zTree.updateNode(treeNode);
            }

            //线要素提交情况
            if(category === 'feature-line'){

            }

            //面要素提交情况
            if(category === 'feature-polygon'){
                var coors = $("#feature-coors").val();
                //字符串的截取处理
                coors = coors.split(',');
                treeNode.coors = coors; //字符存储的顺序是swt，swg，net，neg
                treeNode.img = '../img/polygon_test_map.png';
                treeNode.category = 'feature-polygon';
                zTree.updateNode(treeNode);

                $.zui.store.set(treeNode.id + 'coors', coors);
            }


            //样式恢复
            $(".feature-center").css('height','100%');
            $(".feature-foot").css('display','none');
            alert('关联成功！');

            $("#upload-img").val("");
            $("#feature-name").val("");
            $("#feature-coors").val("");

            //把添加到图上的点进行取消操作
            drawGroup.clearLayers();
            drawGroup.remove();




        });

        $("#feature-cancel").on("click",function () {

            $("#feature-name").val("");
            $("#feature-coors").val("");
            $(".feature-center").css('height','100%');
            $(".feature-foot").css('display','none');

            //把添加到图上的点进行取消操作
            drawGroup.clearLayers();
            drawGroup.remove();
        });



        $(document).ready(function () {
                var zNodes = [
                    {id: 'china', pId: '0', name: "中国", open: true,coors:null,img:null,category:null},
                    {id: 'hunan', pId: 'china', name: "湖南",coors:null,img:null,category:null},
                    {id: 'changsha', pId: 'hunan', name: "长沙市",coors:null,img:null,category:null},
                    {id: 'changde', pId: 'hunan', name: "常德市",coors:null,img:null,category:null},
                    {id: 'xiangtan', pId: 'hunan', name: "湘潭市",coors:null,img:null,category:null},
                    {id: 'csxian', pId: 'changsha', name: "长沙县",coors:null,img:null,category:null},
                    {id: 'kaifu', pId: 'changsha', name: "开福区",coors:null,img:null,category:null},
                    {id: 'tianxin', pId: 'changsha', name: "天心区",coors:null,img:null,category:null},
                    // {id: 'hngd', pId: 'csxian', name: "华南光电",coors:[28.25219321,113.08259818],img:null,category:'feature-point'},
                    // {id: 'fhc', pId: 'csxian', name: "凤凰城",coors:[28.25380815,113.08434188],img:null,category:'feature-point'},
                    // {id: 'wxh', pId: 'csxian', name: "万象汇",coors:[28.25433718,113.08051083],img:null,category:'feature-point'},
                    {id: 'hngd', pId: 'csxian', name: "华南光电",coors:null,img:null,category:'feature-point'},
                    {id: 'fhc', pId: 'csxian', name: "凤凰城",coors:null,img:null,category:'feature-point'},
                    {id: 'wxh', pId: 'csxian', name: "万象汇",coors:null,img:null,category:'feature-point'},
                ];
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            $("#addParent").bind("click", {isParent: true}, add);
            $("#edit").bind("click", edit);
            $("#remove").bind("click", remove);
            console.log($.zui.store.get('test'));
        });







    });