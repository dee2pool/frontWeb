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

        //本页使用
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "draw": "../../../common/lib/leaflet/lib/draw/Leaflet.Draw",
        "zui":"../../../main/common/lib/zui/js/zui",
        "layx": "../../../common/lib/layx/layx",
        "table":"table"
    }
});
require(['jquery', 'frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree', 'draw', 'zui', 'layx','table'],
    function (jquery, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree,draw,zui,layx,table) {
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
                // beforeDrag: beforeDrag,
                // beforeRemove: beforeRemove,
                // beforeRename: beforeRename,
                // onRemove: onRemove,
                // onClick: onClick
            }
        };

        var setting_category = {
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
                //隐藏和显示的设置
                $(".showTreeData").css("display","none");
                $(".editTreeData").css("display","block");
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

            //隐藏和显示的设置
            $(".showTreeData").css("display","block");
            $(".editTreeData").css("display","none");

            //图层的清除操作
            clickGroup.clearLayers();
            clickGroup.remove();
            clickGroup.addTo(map);

            console.log(treeNode);
            $("#name").html(treeNode.name);

            //点要素
            if(treeNode.category === 'feature-point'){
                //当坐标存在时，才向地图上加点
                //$.zui.store.get('coors');
                var coors =  treeNode.coors;
                if(coors != undefined){
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
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            var category = treeNode.cate;
            console.log(treeNode);

            var mapcss = $("#map").css("display");
            //var imgmapcss = "";

            if(mapcss === 'none'){
                //如果没有上传图片，需要进行提示的操作

                if(category === 'feature-point' || category === 'feature-polygon'){
                    if($("#upload-img").val() == ''){
                        alert('请先上传图像');
                        return ;
                    }
                }

                if(treeNode.name === '建筑'){
                    $("#add-building-btn").css("display","block");
                }else{
                    $("#add-building-btn").css("display","none");
                }


                /**
                 * 构造线要素
                 */
                if(category === 'feature-point'){
                    var index = null;
                    //用之前先清空一下图层，重新加载一下
                    drawGroup.clearLayers();
                    drawGroup.remove();
                    drawGroup.addTo(buildMapTest);


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

                    var drawer = new L.Draw.Marker(buildMapTest, {
                        icon: L.icon({
                            iconUrl: objUrl,
                        })
                    });

                    drawer.enable(); //启动工具
                    buildMapTest.on('draw:created',
                        function (e) {
                            var type = e.layerType,
                                drawlayer = e.layer;
                            drawGroup.addLayer(drawlayer);
                            console.log(drawlayer._map);
                            $("#feature-zoom").val(drawlayer._map._zoom);
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
                    drawGroup.addTo(buildMapTest);

                    //构造画图工具
                    var drawer = new L.Draw.Polyline(buildMapTest);
                    drawer.enable(); //启动工具

                    buildMapTest.on('draw:created', function (e) {
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
                    drawGroup.addTo(buildMapTest);

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
                    var drawer = new L.Draw.Rectangle(buildMapTest);
                    drawer.enable(); //启动工具
                    buildMapTest.on('draw:created', function (e) {
                        var type = e.layerType,
                            layer = e.layer;
                        var imageBounds = [[layer._bounds._southWest.lat, layer._bounds._southWest.lng], [layer._bounds._northEast.lat, layer._bounds._northEast.lng]];
                        $("#feature-coors").val(imageBounds);
                        imageoverlay = L.imageOverlay(imgUrl, imageBounds).addTo(buildMapTest);
                        drawGroup.addLayer(imageoverlay);
                    });
                    drawer = null;
                }


                if(category === 'none'){
                    alert('请先选择要素类型');
                }
            }
            //buildMapTest
            else{
                loadIndoorMap();
                function loadIndoorMap() {
                    buildMapTest = L.map('map', {
                        minZoom: 0,
                        maxZoom: 4,
                        center: [0, 0],
                        zoom: 4,
                        crs: L.CRS.Simple
                    });

                    // 隐藏map，显示img-map
                    $("#map").css('display', 'none');
                    $(".img-map").css('display', 'block');

                    //室内地图初始化 这里实际上是核心图片算法的处理
                    var w = 1024,
                        h = 650;
                    //url = imageUrl;
                    var southWest = buildMapTest.unproject([0, h], buildMapTest.getMaxZoom() - 1);
                    var northEast = buildMapTest.unproject([w, 0], buildMapTest.getMaxZoom() - 1);
                    var bounds = new L.LatLngBounds(southWest, northEast);

                    var indoor1 = L.imageOverlay('../asset/img/indoor1.jpg', bounds).addTo(buildMapTest);
                    var indoor2 = L.imageOverlay('../asset/img/indoor2.jpg', bounds);
                    var indoor3 = L.imageOverlay('../asset/img/indoor3.jpg', bounds);

                    /**
                     * 图层控制器
                     */
                    var baseMaps = {
                        "1楼": indoor1,
                        "2楼": indoor2,
                        "3楼": indoor3
                    };
                    var overlayMaps = {

                    };

                    //设置图层控制器
                    var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false,position:'bottomright' }).addTo(buildMapTest);

                    var markerGroup = new L.FeatureGroup();
                    indoor2.on("add",function () {
                        //unproject是将像素点向坐标点进行转换，然后再添加到地图上
                        var marker1 = L.marker(buildMapTest.unproject([90, 600], buildMapTest.getMaxZoom() - 1));
                        marker1.on("click", function () {
                            lay.open({
                                type: 1,
                                shade: false,
                                title: '<i class="fa fa-history"></i>信息查看',
                                skin: 'layui-layer-lan',
                                area:['400px','400px'],
                                content: '信息查看',
                            });
                        });
                        var marker2 = L.marker(buildMapTest.unproject([400, 400], buildMapTest.getMaxZoom() - 1));
                        marker2.on("click", function () {
                            lay.open({
                                type: 1,
                                area:['400px','400px'],
                                shade: false,
                                title: '<i class="fa fa-history"></i>信息查看',
                                skin: 'layui-layer-lan',
                                content: '信息查看',
                            });
                        });
                        var marker3 = L.marker(buildMapTest.unproject([300, 500], buildMapTest.getMaxZoom() - 1));
                        marker3.on("click", function () {
                            lay.open({
                                type: 1,
                                area:['400px','400px'],
                                shade: false,
                                title: '<i class="fa fa-history"></i>信息查看',
                                skin: 'layui-layer-lan',
                                content: '信息查看',
                            });
                        });
                        var marker4 = L.marker(buildMapTest.unproject([100, 380], buildMapTest.getMaxZoom() - 1));
                        marker4.on("click", function(){
                            lay.open({
                                type: 1,
                                area:['400px','400px'],
                                shade: false,
                                title: '<i class="fa fa-history"></i>信息查看',
                                skin: 'layui-layer-lan',
                                content: '信息查看',
                            });
                        });
                        markerGroup.addLayer(marker1);
                        markerGroup.addLayer(marker2);
                        markerGroup.addLayer(marker3);
                        markerGroup.addLayer(marker4);
                        markerGroup.addTo(buildMapTest);
                    });

                    indoor2.on("remove",function () {
                        buildMapTest.removeLayer(markerGroup);
                    });


                    buildMapTest.on("zoom", function (evt) {
                        //console.log(typeof  evt.target._animateToZoom);
                        if (evt.target._animateToZoom == 1) {
                            $("#map").css('display', 'block');
                            $(".img-map").css('display', 'none');
                            buildMapTest.remove();
                            buildMapTest = null;
                        }
                    });
                }
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
            // $(".feature-center").css('height','100%');
            // $(".feature-foot").css('display','none');
            $("#add-building-btn").css("display","none");

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

        /**
         * 楼层操作相关
         */
        //楼层点击按钮事件
        $("#add-building").on("click",function () {
            layx.html('indoor', '添加楼层', document.getElementById('indoor'), {
                //取用模式，而不是拷贝模式，不然的话拿不到值
                cloneElementContent: false,
                //上边中间打开
                //position: 'c',
                maxMenu: false,
                minMenu: false,
                closeMenu: false,
                minMenu:false,
                maxMenu:false,
                controlStyle:'background-color: #1070e2; color:#fff;',
                border:false,
                style:layx.multiLine(function(){/*
                        #layx-purple-control-style .layx-inlay-menus .layx-icon:hover {
                            background-color: #9953c0;
                        }
                    */}),
                width: 750,
                height: 500,
                statusBar: true,
                storeStatus:false,
                icon: '<i class="fa fa-plus-circle"></i>',
                event: {

                },
                buttons: [
                    {
                        label: '保存',
                        callback: function (id, button, event) {
                            // // 获取 iframe 页面 window对象
                            // var name = $("#device-name").val();
                            // var geom = $("#device-coors").val();
                            // //执行添加的方法
                            // device.addDevice(name, geom, id);
                        }
                    },
                    {
                        label: '关闭',
                        callback: function (id, button, event) {
                            // drawGroup.clearLayers();
                            // // $("#add-device-form").css('display','none');
                            layx.destroy(id);
                        }
                    }
                ]
            });
        });

        //根据楼层数，动态生成表格
        $("#export-building").on("click",function () {
            var total = parseInt($("#indoor-total").val());
            var start = parseInt($("#indoor-start").val());
            console.log(typeof  $("#indoor-total").val());
            if(total === null||start === null || total < start){
                alert('楼层信息输入有误！请重新输入');
                return;
            }

            for( var i = start; i < total; i++ ) {
                var t=i;
                if(t>=0){
                    t+=1;
                }
                //动态创建一个tr行标签,并且转换成jQuery对象
                var $trTemp = $("<tr></tr>");
                //往行里面追加 td单元格
                $trTemp.append("<td>"+ t +"</td>");
                $trTemp.append("<td>"+ t+"楼" +"</td>");
                $trTemp.append("<td>"+ "<input class='form-control' type='file'></input>" +"</td>");
                $trTemp.appendTo("#indoor-table");
            }
        });
        var coors = [28.25433718,113.08051083];
        var build = L.marker(coors);
        $("#showBuild").on("click",function () {
            build.addTo(map);
        });

        //双击进入楼层内部
        var buildMapTest = null;//进入建筑结构内部的map对象
        buildMapTest = L.map('img-map', {
            minZoom: 0,
            maxZoom: 4,
            center: [0, 0],
            zoom: 4,
            crs: L.CRS.Simple
        });
        build.on("dblclick",function () {
            loadIndoorMap();
            function loadIndoorMap() {
                // 隐藏map，显示img-map
                $("#map").css('display', 'none');
                $("#img-map").css('display', 'block');

                //室内地图初始化 这里实际上是核心图片算法的处理
                var w = 1024,
                    h = 650;
                //url = imageUrl;
                var southWest = buildMapTest.unproject([0, h], buildMapTest.getMaxZoom() - 1);
                var northEast = buildMapTest.unproject([w, 0], buildMapTest.getMaxZoom() - 1);
                var bounds = new L.LatLngBounds(southWest, northEast);

                var indoor1 = L.imageOverlay('../img/indoor1.jpg', bounds).addTo(buildMapTest);
                var indoor2 = L.imageOverlay('../img/indoor2.jpg', bounds);
                var indoor3 = L.imageOverlay('../img/indoor3.jpg', bounds);

                /**
                 * 图层控制器
                 */
                var baseMaps = {
                    "1楼": indoor1,
                    "2楼": indoor2,
                    "3楼": indoor3
                };
                var overlayMaps = {

                };

                //设置图层控制器
                var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false,position:'bottomright' }).addTo(buildMapTest);

                var markerGroup = new L.FeatureGroup();
                indoor2.on("add",function () {
                    //unproject是将像素点向坐标点进行转换，然后再添加到地图上
                    var marker1 = L.marker(buildMapTest.unproject([90, 600], buildMapTest.getMaxZoom() - 1));
                    marker1.on("click", function () {
                        lay.open({
                            type: 1,
                            shade: false,
                            title: '<i class="fa fa-history"></i>信息查看',
                            skin: 'layui-layer-lan',
                            area:['400px','400px'],
                            content: '信息查看',
                        });
                    });
                    var marker2 = L.marker(buildMapTest.unproject([400, 400], buildMapTest.getMaxZoom() - 1));
                    marker2.on("click", function () {
                        lay.open({
                            type: 1,
                            area:['400px','400px'],
                            shade: false,
                            title: '<i class="fa fa-history"></i>信息查看',
                            skin: 'layui-layer-lan',
                            content: '信息查看',
                        });
                    });
                    var marker3 = L.marker(buildMapTest.unproject([300, 500], buildMapTest.getMaxZoom() - 1));
                    marker3.on("click", function () {
                        lay.open({
                            type: 1,
                            area:['400px','400px'],
                            shade: false,
                            title: '<i class="fa fa-history"></i>信息查看',
                            skin: 'layui-layer-lan',
                            content: '信息查看',
                        });
                    });
                    var marker4 = L.marker(buildMapTest.unproject([100, 380], buildMapTest.getMaxZoom() - 1));
                    marker4.on("click", function () {
                        lay.open({
                            type: 1,
                            area:['400px','400px'],
                            shade: false,
                            title: '<i class="fa fa-history"></i>信息查看',
                            skin: 'layui-layer-lan',
                            content: '信息查看',
                        });
                    });
                    markerGroup.addLayer(marker1);
                    markerGroup.addLayer(marker2);
                    markerGroup.addLayer(marker3);
                    markerGroup.addLayer(marker4);
                    markerGroup.addTo(buildMapTest);
                });

                indoor2.on("remove",function () {
                    buildMapTest.removeLayer(markerGroup);
                });


                buildMapTest.on("zoom", function (evt) {
                    //console.log(typeof  evt.target._animateToZoom);
                    if (evt.target._animateToZoom == 1) {
                        $("#map").css('display', 'block');
                        $("#img-map").css('display', 'none');
                        buildMapTest.remove();
                        buildMapTest = null;
                    }
                });
            }
        });


        $(document).ready(function () {
            var zNodes = [
                    {id: 'china', pId: '0', name: "中国", open: true,coors:null,img:null,category:null},
                    {id: 'hunan', pId: 'china', name: "湖南",open: true,coors:null,img:null,category:null},
                    {id: 'changsha', pId: 'hunan', name: "长沙市",coors:null,img:null,category:null},
                    {id: 'changde', pId: 'hunan', name: "常德市",coors:null,img:null,category:null},
                    {id: 'xiangtan', pId: 'hunan', name: "湘潭市",coors:null,img:null,category:null},
                    {id: 'csxian', pId: 'changsha', name: "长沙县",coors:null,img:null,category:null},
                    {id: 'kaifu', pId: 'changsha', name: "开福区",coors:null,img:null,category:null},
                    {id: 'tianxin', pId: 'changsha', name: "天心区",coors:null,img:null,category:null},
                    {id: 'hngd', pId: 'csxian', name: "华南光电",coors:[28.25219321,113.08259818],img:null,category:'feature-point'},
                    {id: 'fhc', pId: 'csxian', name: "凤凰城",coors:[28.25380815,113.08434188],img:null,category:'feature-point'},
                    {id: 'wxh', pId: 'csxian', name: "万象汇",coors:[28.25433718,113.08051083],img:null,category:'feature-point'},
                ];

            var zNodes_category =[
                { id:1, pId:0, name:"业务层资源", open:true},
                { id:'11', pId:'1', name:"组织"},
                { id:'12', pId:'1', name:"设备", open:true},
                { id:'13', pId:'1', name:"人员"},
                { id:'14', pId:'1', name:"建筑"},
                { id:'15', pId:'1', name:"道路"},

                { id:'16', pId:'12', name:"摄像机"},
                { id:'17', pId:'12', name:"照相机"},
                { id:'18', pId:'12', name:"传感器"},

                { id:'19', pId:'16', name:"海康"},
                { id:'20', pId:'16', name:"大华"}
            ];

            var zNodes_chooseCategory =[
                { id:1, pId:0, name:"要素分类", open:true},
                { id:'11', pId:1, name:"点要素", open:true},
                { id:'12', pId:1, name:"线要素", open:true},
                { id:'13', pId:1, name:"面要素", open:true},
                //点要素
                { id:'21', pId:11, name:"业务分类",cate:"feature-point"},
                { id:'22', pId:11, name:"自定义分类",cate:"feature-point"},
                //线要素
                { id:'23', pId:12, name:"业务分类",cate:"feature-line"},
                { id:'24', pId:12, name:"自定义分类",cate:"feature-line"},
                //面要素
                { id:'25', pId:13, name:"业务分类",cate:"feature-polygon"},
                { id:'26', pId:13, name:"自定义分类",cate:"feature-polygon"},

                //点要素自定义
                { id:'101', pId:22, name:"建筑",cate:"feature-point"},
                { id:'102', pId:22, name:"摄像头",cate:"feature-point"},
                { id:'103', pId:22, name:"传感器",cate:"feature-point"},
                //点要素业务分类
                { id:'109', pId:21, name:"设备",cate:"feature-point"},
                { id:'110', pId:21, name:"人",cate:"feature-point"},
                { id:'111', pId:109, name:"海康",cate:"feature-point"},
                { id:'112', pId:109, name:"大华",cate:"feature-point"},


                //线要素自定义
                { id:'104', pId:'24', name:"铁路",cate:"feature-line"},
                { id:'105', pId:'24', name:"国道",cate:"feature-line"},
                //面要素自定义
                { id:'106', pId:'26', name:"区域地图",cate:"feature-polygon"},
                { id:'107', pId:'26', name:"工厂地图",cate:"feature-polygon"},
                { id:'108', pId:'26', name:"户型图",cate:"feature-polygon"},

            ];


            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            $.fn.zTree.init($("#treeDemo2"), setting_category, zNodes_category);
            $.fn.zTree.init($("#treeDemo3"), setting_category, zNodes_chooseCategory);


            $("#addParent").bind("click", {isParent: true}, add);
            $("#edit").bind("click", edit);
            $("#remove").bind("click", remove);

            //一级下拉菜单联动
            $("#feature-level1").bind("change",function (obj) {
                //目标value，根据不同的目标value，显示不同的子分类
                //点要素的二级联动
                if(obj.target.value === 'feature-point'){
                    //$("#add-building-btn").css("display","block");
                    //清空option
                    $("#feature-level2").find("option").remove();
                    var dataList = [
                        "请选择","建筑", "摄像头", "传感器"
                    ];
                    for (var i = 0; i < dataList.length; i++) {
                        //先创建好select里面的option元素
                        var option = document.createElement("option");
                        //转换DOM对象为JQ对象,好用JQ里面提供的方法 给option的value赋值
                        $(option).val(dataList[i]);
                        //给option的text赋值,这就是你点开下拉框能够看到的东西
                        $(option).text(dataList[i]);
                        //获取select 下拉框对象,并将option添加进select
                        $('#feature-level2').append(option);
                    }
                }

                if(obj.target.value === 'feature-line'){
                    $("#add-building-btn").css("display","none");
                    //清空option
                    $("#feature-level2").find("option").remove();
                    var dataList = [
                        "请选择","铁路", "国道", "高速公路"
                    ];
                    for (var i = 0; i < dataList.length; i++) {
                        //先创建好select里面的option元素
                        var option = document.createElement("option");
                        //转换DOM对象为JQ对象,好用JQ里面提供的方法 给option的value赋值
                        $(option).val(dataList[i]);
                        //给option的text赋值,这就是你点开下拉框能够看到的东西
                        $(option).text(dataList[i]);
                        //获取select 下拉框对象,并将option添加进select
                        $('#feature-level2').append(option);
                    }
                }

                if(obj.target.value === 'feature-polygon'){
                    $("#add-building-btn").css("display","none");
                    //清空option
                    $("#feature-level2").find("option").remove();
                    var dataList = [
                        "请选择","区域地图", "工厂地图", "房间地图"
                    ];
                    for (var i = 0; i < dataList.length; i++) {
                        //先创建好select里面的option元素
                        var option = document.createElement("option");
                        //转换DOM对象为JQ对象,好用JQ里面提供的方法 给option的value赋值
                        $(option).val(dataList[i]);
                        //给option的text赋值,这就是你点开下拉框能够看到的东西
                        $(option).text(dataList[i]);
                        //获取select 下拉框对象,并将option添加进select
                        $('#feature-level2').append(option);
                    }
                }
            });

            //二级下拉菜单联动
            $("#feature-level2").bind("change",function (obj) {
                //对于是否显示楼层的控制显示
                if(obj.target.value === '建筑'){
                    $("#add-building-btn").css("display","block");
                }

                if(obj.target.value != '建筑'){
                    $("#add-building-btn").css("display","none");
                }

            });

            //要素分类input输入框的change事件联动
            $("#input-category").on("onchange",function (obj) {
                //对于是否显示楼层的控制显示
                console.log($("#input-category").val());
            });

            //动态高度设置
            // var height = $("#pan").height() - $("#pan-head").height() - 15;
            // $("#pan-body").css('height',height+'px');


            //打开要素分类选择界面
            $("#category").on("click",function () {
                layx.group('group-nomerge', [
                    {
                        id: 'map-edit',
                        title: '要素分类选择',
                        content: document.getElementById('chooseCategory'),
                        cloneElementContent: false,
                    }
                ],0, {
                    id: 'info',
                    mergeTitle: false,
                    title: '选择加载要素',
                    icon:false,
                    minMenu:false,
                    maxMenu:false,
                    controlStyle:'background-color: #1070e2; color:#fff;',
                    border:false,
                    style:layx.multiLine(function(){/*
                        #layx-purple-control-style .layx-inlay-menus .layx-icon:hover {
                            background-color: #9953c0;
                        }
                    */})
                });
            });

            //确认要素分类选择
            $("#chooseCategory-btn").on("click",function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    alert("请先选择一个节点");
                    return;
                }else{
                    $("#feature-content").css("display","none");
                    $("#device").css("display","none");
                    $("#build").css("display","none");
                    $("#other").css("display","none");

                    $("#feature-content").css("display","block");
                    if(treeNode.id === '12'){
                        //$("#feature-content").html(table.device);
                        $("#device").css("display","block")
                    }else if(treeNode.id === '14'){
                        //$("#feature-content").html(table.build);
                        $("#build").css("display","block");
                    }else{
                        //$("#feature-content").html(table.other);

                        $("#other").css("display","block");
                    }



                   //关闭窗口
                    layx.destroyAll();
                }
            });


            //启动要素关联的界面
            $(".btn-success").on("click",function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    alert("请先选择一个区域节点才能进行要素关联!");
                    return;
                }else{
                    //将位置关联的css打开
                        $(".showTreeData").css("display","none");
                        $(".editTreeData").css("display","block");
                        $("#feature-name").val($(this).closest('tr').find('td')[0].innerText);
                }
            });

            //要素关联界面中，打开选择要素分类的窗口
            $("#open-category-win").on("click",function () {
                layx.html('dom-get','要素分类选择',document.getElementById('category-win'),{
                    cloneElementContent:false,
                    //样式配置
                    icon:false,
                    minMenu:false,
                    maxMenu:false,
                    controlStyle:'background-color: #1070e2; color:#fff;',
                    border:false,
                    style:layx.multiLine(function(){/*
                        #layx-purple-control-style .layx-inlay-menus .layx-icon:hover {
                            background-color: #9953c0;
                        }
                    */}),
                });
            });

            //在要素分类所属的窗口中，选择所属的要素分类
            $("#category-win-commit").on("click",function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo3"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    alert("请先选择一个区域节点才能进行要素关联!");
                    return;
                }else{
                    $("#input-category").val(treeNode.name);
                    //console.log(zTree);

                    //关闭窗口
                    layx.destroyAll();
                }
            });


            $("#showNoBuild").on("click",function () {
                //console.log(456);
                var coors = [28.25219321,113.08259818];
                var marker = L.marker(coors).addTo(map);

            });


            $("#back-to-map").on("click",function () {
                $("#map").css('display','block');
                $("#img-map").css('display','none');
            });



        });






    });