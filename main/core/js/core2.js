require.config({
    //存在依赖的js模块，需要使用shim
    //deps是需要使用的依赖
    //exports是模块的输出名称
    //shim中的export是参数名
    shim: {
        'bootstrap': {
            deps: ['jquery'],
        },
        'contextmenu': {
            deps: ['leaflet'],
            exports: 'contextmenu'
        },
        'history': {
            deps: ['leaflet'],
            exports: 'history'
        },
        'layer': {
            deps: ['jquery'],
            exports: 'lay'
        },
        'draw': {
            deps: ['leaflet'],
            exports: 'draw'
        },
        'gisutil': {
            deps: ['leaflet', 'turf'],
            exports: 'gisutil'
        },
        'zoomhome': {
            deps: ['leaflet'],
            exports: 'zoomhome'
        },
        'jqueryPrint': {
            deps: ['jquery'],
            exports: 'jqueryPrint'
        },
        'minimap': {
            deps: ['leaflet'],
            exports: 'minimap'
        },
        'search': {
            deps: ['leaflet'],
            exports: 'search'
        },
        'providers': {
            deps: ['leaflet'],
            exports: 'providers'
        },
        'sui': {
            deps: ['jquery', 'bootstrap'],
            exports: 'sui'
        },
        'layx': {
            exports: 'layx'
        },
        'echarts': {
            exports: 'echarts'
        },
        'jqueryui': {
            exports: 'jqueryui',
            deps: ['jquery'],
        },
        'lobipanel': {
            exports: 'lobipanel',
            deps: ['jquery', 'jqueryui', 'bootstrap'],
        },
        'bootstrap-table': {
            deps: ['jquery', 'bootstrap'],
            exports: 'bootstrapTable'
        },
        'indoor': {
            deps: ['leaflet'],
            exports: 'indoor'
        },
        'snogylop': {
            deps: ['leaflet'],
            exports: 'snogylop'
        },
        "BetterWMS":{
            deps: ['leaflet'],
            exports: 'BetterWMS'
        },
        'ztree':{
            deps:['jquery'],
            export:'ztree'
        },


    },
    paths: {
        "jquery": "../../common/lib/jquery/jquery-3.3.1.min",
        //全局通用变量
        "common": "../../common/js/common",
        "gisutil": "../../common/js/util/gisutil",
        "bootstrap": "../../common/lib/bootstrap/js/bootstrap",
        "leaflet": "../../common/lib/leaflet/leaflet",
        // "corenav":"../../common/lib/corenav/coreNavigation-1.1.3.min",
        "contextmenu": "../../common/lib/leaflet-lib/contextmenu/leaflet.contextmenu.min",
        "history": "../../common/lib/leaflet-lib/history/leaflet-history",
        "layer": "../../common/lib/layer/layer",
        "draw": "../../common/lib/leaflet-lib/draw/Leaflet.Draw",
        "turf": "../../common/lib/turf/turf",
        "zoomhome": "../../common/lib/leaflet-lib/zoomhome/leaflet.zoomhome",
        "jqueryPrint": "../../common/lib/jquery/lib/jQuery.print",
        "minimap": "../../common/lib/leaflet-lib/minimap/Control.MiniMap",
        "search": "../../common/lib/leaflet-lib/search/leaflet-search",
        "providers": "../../common/lib/leaflet-lib/providers/leaflet.ChineseTmsProviders",
        "sui": "../../common/lib/bootstrap/libs/sui/js/sui.nav.min",
        "device": "../../common/js/util/device",
        "layx": "../../common/lib/layx/layx",
        "echarts": "../../common/lib/echarts/echarts.min",
        "jqueryui": "../../common/lib/jquery/lib/jqueryui/jquery-ui.min",
        "lobipanel": "../../common/lib/lobipanel/js/lobipanel",
        "bootstrap-table": "../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table.min",
        "mock": "../../common/lib/mock/mock",
        "indoor": "../../common/lib/leaflet-lib/indoor/leaflet-indoor",
        "snogylop":"../../common/lib/leaflet-lib/mask/leaflet.snogylop",
        "topBar":"../../../common/component/head/js/topbar",
        "BetterWMS":"../../common/lib/leaflet-lib/BetterWMS/BetterWMS",
        "ztree":"../../common/lib/ztree/js/jquery.ztree.all.min",

    }
});
require(['jquery', 'common', 'bootstrap', 'leaflet', 'contextmenu', 'history', 'gisutil', 'layer', 'draw', 'turf', 'zoomhome', 'jqueryPrint', 'minimap', 'search', 'providers', 'sui', 'device', 'layx', 'echarts', 'jqueryui', 'lobipanel', 'bootstrap-table', 'mock', 'indoor', 'snogylop','topBar','BetterWMS','ztree'],
    function ($, common, bootstrap, leaflet, contextmenu, history, gisutil, lay, draw, turf, zoomhome, jqueryPrint, minimap, search, providers, sui, device, layx, echarts, jqueryui, lobipanel, bootstrapTable, Mock, indoor, snogylop,topBar,BetterWMS,ztree) {

        //加载公用头部导航栏标签
        //$("#head").html(common.head);
        $('#head').html(topBar.htm);
        topBar.init();
        initHeight();


        //全局通用地址
        var host = common.host;
        var end = common.end;
        //全局通用变量，用于所有的绘图图层
        var drawGroup = new L.FeatureGroup();
        //3+2.5+2.5+2+8+8
        /**
         * 核心地图变量
         */
        var map = L.map('map', {
            center: [28.25152980300004, 113.08251277400007],
            maxZoom: 17,
            minZoom: 14,
            zoom: 15,
            maxBounds:[[28.230743408203125,113.06167602539062],[28.271942138671875,113.11935424804688]],
            crs: L.CRS.EPSG4326,
            attributionControl: false,//版权控件
            zoomControl: false,//放大缩小的控件,关闭这个是为了打开zoomhome
            //右键菜单
            contextmenu: true,
            contextmenuWidth: 140,
            contextmenuItems: [{
                text: '显示坐标',
                callback: showCoordinates
            }, {
                text: '以此为中心',
                callback: centerMap
            }, '-', {
                text: '放大',
                icon: '',
                callback: zoomIn
            }, {
                text: '缩小',
                icon: '',
                callback: zoomOut
            }, '-', {
                text: '刷新',
                icon: '',
                callback: refresh
            }, '-', {
                text: '清除绘制图形',
                icon: '',
                callback: removeDrawGroup
            }
            ]
        });


        //天地图星沙瓦片地图加载
        var xsTileLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:xstd17@EPSG:4326@png/{z}/{x}/{y}.png', {
            tms: true,
            maxZoom: 17,
            minZoom: 14,
            reuseTiles: true,
            bounds:[[28.230743408203125,113.06167602539062],[28.271942138671875,113.11935424804688]]
        }).addTo(map);//添加tms

        //测试工厂地图加载
        var testSanYiLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:sanyi@EPSG:4326@png/{z}/{x}/{y}.png', {
            tms: true,
            maxZoom: 17,
            minZoom: 15,
            reuseTiles: true
        });//添加tms

        /**
         * 对于模糊层的制作
         */
        var modalGroup = new L.FeatureGroup();

        //模糊态工厂地图图层加载
        var modalFactoryLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:xs_factory@EPSG:4326@png/{z}/{x}/{y}.png', {
            tms: true,
            maxZoom: 17,
            minZoom: 17,
            reuseTiles: true,
            bounds:[[28.24859619140625,113.07952880859375],[28.25408935546875,113.08502197265625]]
        });//添加tms

        //模糊层图层
        var smallModal = null,bigModal = null;//这两项分别指大地图和工厂图的边界，用于生成模糊层
        smallModal = [[113.07952880859375,28.24859619140625],[113.07952880859375,28.25408935546875],[113.08502197265625,28.25408935546875],[113.08502197265625,28.24859619140625],[113.07952880859375,28.24859619140625]];
        bigModal = [[113.06167602539062,28.230743408203125],[113.06167602539062,28.271942138671875],[113.11935424804688,28.271942138671875],[113.11935424804688,28.230743408203125],[113.06167602539062,28.230743408203125]];
        var multiGeometry = turf.multiPolygon([
            [smallModal,bigModal]
        ]);
        var modalData = turf.flatten(multiGeometry);
        var modal = L.geoJSON(modalData, {
            //"color": "#5d6ca3",
        });

        //用turf来计算中心点
        //modalCenter.geometry.coordinates
        var modalCenter = turf.center( turf.featureCollection([
            turf.point([28.24859619140625,113.07952880859375]),
            turf.point([28.25408935546875,113.08502197265625]),
        ]));
        //console.log(modalCenter);

        //把上面的两个图层添加到modalgroup中
        modalGroup.addLayer(modal);
        modalGroup.addLayer(modalFactoryLayer);

        /**
         * 鹰眼控件
         */
        var xsTileLayer2 = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:xstd17@EPSG:4326@png/{z}/{x}/{y}.png', {
            tms: true,
            maxZoom: 14,
            minZoom: 14,
            reuseTiles: true,
            noWrap: true
        });
        L.control.minimap(xsTileLayer2, { mapOptions: { logoControl: true }, toggleDisplay: true, minimized: false }).addTo(map);

        /**
         * 比例尺
         */
        L.control.scale({ imperial: false }).addTo(map);




        /**
         *右键菜单的相关功能
         */
        function showCoordinates(e) {
            //alert(e.latlng);
            var y = e.latlng.lat;
            var x = e.latlng.lng;
            lay.msg("当前坐标为：" + x + "," + y);
        }

        function centerMap(e) {
            map.panTo(e.latlng);
        }

        function zoomIn(e) {
            map.zoomIn();
        }

        function zoomOut(e) {
            map.zoomOut();
        }

        function refresh() {
            location.reload();
        }

        function removeDrawGroup() {
            drawGroup.clearLayers();
            drawGroup.remove();
        }

        /**
         * zoomhome 返回主视图插件
         */
        var zoomHome = L.Control.zoomHome();
        zoomHome.addTo(map);

        /**
         *历史视图容器相关
         */
        var historyControl = new L.HistoryControl();
        historyControl.addTo(map);
        //历史视图容器更改
        var history = document.getElementById('historyControl');
        history.appendChild(historyControl.getContainer());

        $("#history-open").on("click", function () {
            //layer.closeAll();
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-history"></i>历史视图',
                skin: 'layui-layer-lan',
                area: ['200px', '80px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#history'),
            });
        });


        /**
         * 设备点相关
         */
            //点测试图层
        var xsLayerGroup = L.layerGroup();

        var pointOption = common.wmsDefaultOption;
        pointOption.typeName = 'cite:xspoint';

        $.getJSON(gisutil.splitWMSUrl(pointOption), function (json) {
            L.geoJSON(json, {
                onEachFeature: addPoint,
                pointToLayer: xsCircles,
            })
        });
        //geojson的点生成和popup事件
        function addPoint(feature, layer) {
            xsLayerGroup.addLayer(layer);
            //设备点 点击事件
            layer.on("click", function () {
                $("#device-info-name").val("");
                $("#device-info-desc").val("");
                $("#device-info-coors").val("");

                layx.group('group-nomerge', [
                    {
                        id: 'device-info',
                        title: '设备信息',
                        content: '<div class="layx-div"><h3>设备信息</h3>\n' +
                        '        <div class="input-group">\n' +
                        '            <span class="input-group-addon">设备名称</span>\n' +
                        '            <input id="device-info-name" type="text" class="form-control" value=" ' + feature.properties.name + ' " name="device-name" readonly>\n' +
                        '        </div>\n' +
                        '        <br>\n' +
                        '        <div class="input-group">\n' +
                        '            <span class="input-group-addon">坐标信息</span>\n' +
                        '            <input id="device-info-coors" type="text" class="form-control" value=" ' + feature.geometry.coordinates + ' " name="device-coors" readonly>\n' +
                        '        </div>\n' +
                        '        <br>\n' +
                        '        <div class="input-group">\n' +
                        '            <span class="input-group-addon">设备类型</span>\n' +
                        '            <select class="form-control" id="device-info-type" readonly>\n' +
                        '                <option>A</option>\n' +
                        '                <option>B</option>\n' +
                        '                <option>C</option>\n' +
                        '                <option>D</option>\n' +
                        '            </select>\n' +
                        '        </div>\n' +
                        '        <br>\n' +
                        '        <div class="input-group">\n' +
                        '            <span class="input-group-addon">设备描述</span>\n' +
                        '            <input id="device-info-desc" type="text" class="form-control" name="device-desc" readonly>\n' +
                        '        </div> </div>',
                        //cloneElementContent:false,
                    },
                    {
                        id: 'device-current',
                        title: '实时监测',
                        content: document.getElementById('device-chart'),
                        cloneElementContent: false,
                    },
                    {
                        id: 'device-history',
                        title: '历史记录',
                        content: document.getElementById('device-history'),
                        cloneElementContent: false,
                    }
                ], 0, {
                    id: 'info',
                    mergeTitle: false,
                    title: '设备详情',
                });
                $("#device-info-name").val(feature.properties.name);
                $("#device-info-desc").val("");
                $("#device-info-coors").val(feature.geometry.coordinates);
            });
        }

        //geojson更改生成点样式
        function xsCircles(feature, latlng) {
            var icon = L.icon({
                iconUrl: '../../common/asset/img/point/men1.png',
            });
            return L.marker(latlng, { icon: icon });
        }

        //Search插件的加载，有了这个就不用在写WFS查询调用了，主要是json数据已经拿到了，没必要在去查了
        var queryControl = new L.Control.Search({
            layer: xsLayerGroup,
            propertyName: 'name'
            // collapsed:false
        });
        map.addControl(queryControl);

        /**
         * 添加设备相关
         */
        var flag = 0;
        //添加设备,启动画图工具，打开弹窗，将坐标赋值给弹窗里的表单
        $("#add-device").on("click", function () {
            var index = null;
            //用之前先清空一下图层，重新加载一下
            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            var drawer = new L.Draw.Marker(map, {
                icon: L.icon({
                    iconUrl: '../asset/img/camera_48px.png',
                })
            });
            drawer.enable();
            //画图监控
            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        drawlayer = e.layer;

                    drawGroup.addLayer(drawlayer);
                    $("#device-coors").val("");
                    $("#device-coors").val(gisutil.layerToWKT(drawlayer));
                    // $("#add-device-form").css('display','block');
                    layx.html('device-add', '设备添加', document.getElementById('add-device-div'), {
                        //取用模式，而不是拷贝模式，不然的话拿不到值
                        cloneElementContent: false,
                        //上边中间打开
                        position: 'tc',
                        maxMenu: false,
                        minMenu: false,
                        closeMenu: false,
                        width: 520,
                        height: 380,
                        statusBar: true,
                        icon: '<i class="fa fa-search"></i>',
                        event: {

                        },
                        buttons: [
                            {
                                label: '保存',
                                callback: function (id, button, event) {
                                    // 获取 iframe 页面 window对象
                                    var name = $("#device-name").val();
                                    var geom = $("#device-coors").val();
                                    //执行添加的方法
                                    device.addDevice(name, geom, id);
                                }
                            },
                            {
                                label: '关闭',
                                callback: function (id, button, event) {
                                    drawGroup.clearLayers();
                                    // $("#add-device-form").css('display','none');
                                    layx.destroy(id);
                                }
                            }
                        ]
                    });
                });
            //释放内存
            drawer = null;
        });
        $("#sub-device-form").click(function () {
            console.log(123456);
            var name = $("#device-name").val();
            var geom = $("#device-coors").val();
            //执行添加的方法
            device.addDevice(name, geom);
        });

        /**
         * 查询相关，精确模糊查询，缓冲区查询，范围查询
         */
        //打开查询面板,精确模糊查询
        $("#query-open").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-search"></i>&nbsp查询',
                skin: 'layui-layer-lan',
                area: ['280px', '250px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#query'),
            });
        });
        //精确模糊查询容器更改
        // var query = document.getElementById('queryControl');
        // query.appendChild(queryControl.getContainer());

        //范围查询
        $("#open-query-range").on("click", function () {
            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            //设置画线变量
            var drawer = new L.Draw.Rectangle(map);
            drawer.enable();

            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    if (type === 'rectangle') {
                        console.log('范围查询');
                        pointRangeSearch(layer.getLatLngs());
                    }
                    //drawGroup.addLayer(layer);
                });
            //释放内存
            drawer = null;
        });
        //范围查询具体方法
        //之前采用的是wfs查询，但是既然已经查到了geojson切保存到layergroup中，就没必要再查询了
        function pointRangeSearch(latlngs) {
            //将画线区域显示出来，但是感觉没有必要
            //var range = L.rectangle(latlngs[0], {color: "#ff7800"}).addTo(map);

            //构建一个turf区域
            var turfLine = turf.lineString([[latlngs[0][0].lng, latlngs[0][0].lat], [latlngs[0][1].lng, latlngs[0][1].lat], [latlngs[0][2].lng, latlngs[0][2].lat], [latlngs[0][3].lng, latlngs[0][3].lat]]);
            var buffered = turf.lineToPolygon(turfLine);

            //将layergroup转换为geojson，方便处理
            var features = xsLayerGroup.toGeoJSON().features;

            //使用foreach对数据进行遍历
            features.forEach(function (value) {
                //console.log(value.geometry);
                var point = turf.point(value.geometry.coordinates);
                if (turf.booleanContains(buffered, point)) {
                    L.geoJSON(value, {
                        onEachFeature: function onEachFeature(feature, layer) {
                            layer.bindPopup(feature.properties.name);
                        },
                        pointToLayer: function (feature, latlng) {
                            return L.circleMarker(latlng);
                        }
                    }).addTo(map);
                }
            });

            //内存释放
            features = null;
            turfLine = null;
            buffered = null;
        }



        /**
         * 轨迹相关
         */
        var routeLayerGroup = L.layerGroup();
        //routeLayerGroup.addTo(map);
        var routeOption = common.wmsDefaultOption;
        routeOption.typeName = 'cite:route';

        $.getJSON(gisutil.splitWMSUrl(routeOption), function (json) {
            L.geoJSON(json, {
                onEachFeature: function (feature, layer) {
                    routeLayerGroup.addLayer(layer);
                },
                //线和面的样式控制
                style: {
                    "color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
                }
            })
        });

        /**
         * 大楼测试点 双击大楼，进入建筑内部
         * 双击事件进入大楼内部
         */
        var build = L.marker([28.250715136528015,113.08228611946106]).addTo(map);
        build.on("dblclick",function () {
            //mapTestInit('../asset/img/indoor.jpg');
            var buildMapTest = null;//进入建筑结构内部的map对象
            loadIndoorMap();
            function loadIndoorMap() {
                buildMapTest = L.map('img-map', {
                    minZoom: 0,
                    maxZoom: 4,
                    center: [0, 0],
                    zoom: 4,
                    crs: L.CRS.Simple
                });

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
                        $(".img-map").css('display', 'none');
                        buildMapTest.remove();
                        buildMapTest = null;
                    }
                });
            }


        });

        //用于专题图的测试行政区域
        var chinaWMS=L.tileLayer.betterWms('http://192.168.0.142:8060/geoserver/cite/wms', {
            layers: 'cite:chartmap',
            transparent: true,
            format: 'image/png'
        });
        //饼状图测试
        var pie = L.marker([28.239986815235163,113.06989024028218], {
            icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [160, 160],
                html: '<div id="marker' + 1 + '" style="width: 160px; height: 160px; position: relative; background-color: transparent;">asd</div>'
            })
        }).addTo(map);
        //柱状图测试
        var chart = L.marker([28.238828360437484,113.08478097085977], {
            icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [160, 160],
                html: '<div id="marker' + 2 + '" style="width: 160px; height: 160px; position: relative; background-color: transparent;">asd</div>'
            })
        }).addTo(map);

        //GIS配置-要素关联 配置的要素
        //http://localhost:8060/geoserver/cite/wms?service=WMS&version=1.1.0&request=GetMap&layers=cite:feature&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&format=application/openlayers
        var featureConnection=L.tileLayer.betterWms('http://192.168.0.142:8060/geoserver/cite/wms', {
            layers: 'cite:feature',
            transparent: true,
            format: 'image/png'
        });

        /**
         * 异步方式 加载要素关联的要素 主要是通过后台查找来完成
         */
        //异步点的加载
        var featurePointGroup = L.layerGroup();
        $.ajax({
            url:end+'/feature/listPolygon',
            type:'GET',
            contentType:"application/json",
            data:{
                "feature_id":"feature-point"
            },
            cache:false,
            success:function (data) {
                //console.log(data);
                for(var i=0;i<data.length;i++){
                    var temp = data[i];

                    var Icon = L.icon({
                        iconUrl: "../../common/asset/img/upload/"+temp.featureIcon,
                    });
                    var marker = L.marker([temp.geo.coordinates[1], temp.geo.coordinates[0]],{icon: Icon});
                    var configId = temp.configId;
                    //如果存在室内点，那么触发相应的室内楼层事件
                    if(temp.hasIndoor == true){
                        marker.on("dblclick",function () {
                            //查询相应的所属的楼层图片
                            //console.log(true);
                            var buildMapTest = null;
                            buildMapTest = L.map('img-map', {
                                minZoom: 0,
                                maxZoom: 4,
                                center: [0, 0],
                                zoom: 4,
                                crs: L.CRS.Simple
                            });
                            // 隐藏map，显示img-map
                            $("#map").css('display', 'none');
                            $("#img-map").css('display', 'block');

                            var w = 1024,
                                h = 650;
                            //url = imageUrl;
                            var southWest = buildMapTest.unproject([0, h], buildMapTest.getMaxZoom() - 1);
                            var northEast = buildMapTest.unproject([w, 0], buildMapTest.getMaxZoom() - 1);
                            var bounds = new L.LatLngBounds(southWest, northEast);



                            //切换事件，当不同的layer添加到图上
                            buildMapTest.on("layeradd",function (layer) {
                                var bounds = layer.layer._bounds;

                                //如果是undefined，说明添加进来的是点要素，那么什么也不做
                                //只有添加面要素的时候，才调用后台接口进行加点的操作
                                if(bounds === undefined){

                                }else{
                                    var url = layer.layer._url;
                                    url = url.split("/");
                                    var imgId = url[url.length-1];

                                    //当面要素切换的时候，清除所有的marker
                                    buildMapTest.eachLayer(function(layer){
                                        console.log(layer);
                                        //对layer的类型进行判断，如果是marker，那么直接进行remove操作
                                        //仍然通过bound来判断，如果bound是undefined，那么说明是点layer，则将此layer进行清除操作；
                                        if(layer._bounds === undefined){
                                            buildMapTest.removeLayer(layer);
                                        }

                                    });

                                    $.ajax({
                                        type: "GET",           //因为是传输文件，所以必须是post
                                        url: end+'/feature/listIndoorPointByImgId',         //对应的后台处理类的地址
                                        data: {
                                            imgId:imgId
                                        },
                                        contentType:"application/json",
                                        cache:false,
                                        success: function (data) {
                                            if(data.length != 0){
                                                for(var i=0;i<data.length;i++){
                                                    L.marker([data[i].geo.coordinates[1], data[i].geo.coordinates[0]]).addTo(buildMapTest);
                                                }

                                            }
                                        }
                                    });
                                }
                            });




                            var indoorGroup = new L.FeatureGroup();
                            //异步加载楼层内部的图片
                            $.ajax({
                                url:end+'/feature/listIndoorByConfigId',
                                type:'GET',
                                contentType:"application/json",
                                data:{
                                    "configId":configId
                                },
                                cache:false,
                                success:function (data) {
                                    /**
                                     * 图层控制器
                                     */
                                    var baseMap = new Object();
                                    for(var i=0;i<data.length;i++){
                                        //console.log(data[i]);
                                        var num = data[i].indoorNum;
                                        var level = L.imageOverlay("../../common/asset/img/upload/"+data[i].indoorImg, bounds);
                                        if(i === 0){
                                            level.addTo(buildMapTest);
                                        }
                                        baseMap[num]=level;
                                    }
                                    var overlayMaps = {};
                                    //设置图层控制器
                                    var layerControl = L.control.layers(baseMap, overlayMaps, { collapsed: false,position:'bottomright' }).addTo(buildMapTest);
                                },
                                error:function () {
                                    //console.log(0)
                                }
                            });
                            console.log(indoorGroup);



                            buildMapTest.on("zoom", function (evt) {
                                //console.log(typeof  evt.target._animateToZoom);
                                if (evt.target._animateToZoom == 1) {
                                    $("#map").css('display', 'block');
                                    $(".img-map").css('display', 'none');
                                    buildMapTest.remove();
                                    buildMapTest = null;
                                }
                            });
                        });
                    }
                    else{

                    }
                    featurePointGroup.addLayer(marker);
                }
            },
            error:function () {
                console.log(0)
            }
        });
        //异步线的加载
        var featureLineGroup = L.layerGroup();
        $.ajax({
            url:end+'/feature/listPolygon',
            type:'GET',
            contentType:"application/json",
            data:{
                "feature_id":"feature-line"
            },
            cache:false,
            success:function (data) {
                //console.log(data);
                for(var i=0;i<data.length;i++){
                    var temp = data[i];
                    //console.log(temp);

                    var latlngs = [];
                    for(var j=0;j<temp.geo.coordinates.length;j++){
                        var array = [temp.geo.coordinates[j][1],temp.geo.coordinates[j][0]];
                        latlngs.push(array);
                    };

                    var polyline = L.polyline(latlngs, {color: 'black'});
                    featureLineGroup.addLayer(polyline);
                }
            },
            error:function () {
                //console.log(0)
            }
        });

        //异步面的加载
        var featurePolygonGroup = L.layerGroup();
        $.ajax({
            url:end+'/feature/listPolygon',
            type:'GET',
            contentType:"application/json",
            data:{
                "feature_id":"feature-polygon"
            },
            cache:false,
            success:function (data) {
                //console.log(data);
                for(var i=0;i<data.length;i++){
                    var temp = data[i];
                    console.log(temp);

                    var imageUrl = "../../common/asset/img/upload/"+temp.imgPolygon,
                        imageBounds = [[temp.geo.coordinates[0][0][1], temp.geo.coordinates[0][0][0]], [[temp.geo.coordinates[0][2][1], temp.geo.coordinates[0][2][0]]]];
                    var overlay = L.imageOverlay(imageUrl, imageBounds);

                    // var latlngs = [];
                    // for(var j=0;j<temp.geo.coordinates.length;j++){
                    //     var array = [temp.geo.coordinates[j][1],temp.geo.coordinates[j][0]];
                    //     latlngs.push(array);
                    // };
                    //
                    // var polyline = L.polyline(latlngs, {color: 'black'});
                    featurePolygonGroup.addLayer(overlay);
                }
            },
            error:function () {
                //console.log(0)
            }
        });

        /**
         * 图层控制器
         */
        var baseMaps = {
            "星沙瓦片地图": xsTileLayer,
        };
        var overlayMaps = {
            "轨迹": routeLayerGroup,
            "要素点":featurePointGroup,
            "要素线":featureLineGroup,
            "要素面":featurePolygonGroup,
            "设备点": xsLayerGroup,
            "建筑": build,
            "行政区":chinaWMS,
            "饼状图":pie,
            "柱状图":chart,
            "要素":featureConnection
        };

        //设置图层控制器
        var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
        //更改控制器容器
        document.getElementById('layerControl').appendChild(layerControl.getContainer());
        //打开图层控制器的修改后的容器
        $("#layer-open").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-search"></i>&nbsp查询',
                skin: 'layui-layer-lan',
                //area: ['280px', '250px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#layerControlContainer'),
            });
        });

        /**
         * 鼠标移动获得坐标
         */
        map.on('mousemove', function (ev) {
            lat = ev.latlng.lat;
            lng = ev.latlng.lng;
            //console.log(lat,lng);

            $("#coordinateControl").html(lat + "，" + lng);
        });

        $("#coor-open").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-map-pin"></i>&nbsp坐标查看',
                skin: 'layui-layer-lan',
                //area: ['280px', '250px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#coordinate'),
            });
        });

        //先执行生成，作为测试
        createC1();
        createC2();

        function createC1() {
            var dom = document.getElementById("c1");
            var myChart = echarts.init(dom);
            var app = {};
            option = null;
            option = {
                title: {
                    text: '统计图一'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: { normal: {} },
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
            myChart.setOption(option, true);
        }

        function createC2() {
            var dom = document.getElementById("c2");
            var myChart = echarts.init(dom);
            var app = {};
            option = null;

            option = {
                title: {
                    text: '统计图二'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    data: ['蒸发量', '降水量', '平均温度']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '水量',
                        min: 0,
                        max: 250,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} ml'
                        }
                    },
                    {
                        type: 'value',
                        name: '温度',
                        min: 0,
                        max: 25,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series: [
                    {
                        name: '蒸发量',
                        type: 'bar',
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name: '降水量',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '平均温度',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            };
            ;
            myChart.setOption(option, true);
        }

        /**
         * img-map的初始化 室内结构地图 另一个视图
         */
        var maptest = null;

        /**
         * 使用indoor 进行内部地图的加载
         */
        var indoorLayer = new L.Indoor(common.indoorJson, {
            getLevel: function (feature) {
                return feature.properties.level;
            },
            onEachFeature: function (feature, layer) {
                layer.on("click", function (params) {
                    if (feature.id === '2') {
                        mapTestInit('../asset/img/indoor.jpg');
                    }
                    if (feature.id === '3') {
                        mapTestInit('../asset/img/indoor2.jpg');
                    }
                })
            },
            style: function (feature) {
                return {
                    fillColor: '#169EC6',
                    weight: 1,
                    color: 'black',
                    fillOpacity: 1
                };
            }
        });
        indoorLayer.setLevel("1");
        //控制地图的控件
        var levelControl = new L.Control.Level({
            level: "1",
            levels: indoorLayer.getLevels(),
            indoorLayer: indoorLayer
        });

        // 从img-map返回到map的按钮
        $("#test-map").on("click", function (params) {

            maptest.remove();
            maptest = null;
            // 显示map，隐藏img-map
            $("#map").css('display', 'block');
            $(".img-map").css('display', 'none');

        });


        /**
         * 地图分级
         */
        map.on("zoomend", function (evt) {
            //对于楼层的操作
            // if (evt.sourceTarget._animateToZoom === 17) {
            //     // $.getJSON("../asset/json/indoor.json", function(geoJSON) {
            //     indoorLayer.addTo(map);
            //     levelControl.addTo(map);
            //     // });
            // }
            // else {
            //     map.removeLayer(indoorLayer);
            //     map.removeControl(levelControl);
            // }
            //
            // //三一工厂是否应该出现的判断
            // if (evt.sourceTarget._animateToZoom >= 16) {
            //     var center=[113.10121178627014,28.24112355709076];
            //     if(center[0] < map.getBounds()._northEast.lng && center[0] > map.getBounds()._southWest.lng && center[1] > map.getBounds()._southWest.lat && center[1] < map.getBounds()._northEast.lat){
            //         if (map.hasLayer(testSanYiLayer)) {
            //         }
            //         else {
            //             //模糊态的处理
            //             var boundCoord = [[[-90,-180], [-90,180], [90,180], [90,-180], [-90,-180]]];
            //             testSanYiLayer.addTo(map);
            //         }
            //     }
            // }
            // else {
            //     if (map.hasLayer(testSanYiLayer)) {
            //         map.removeLayer(testSanYiLayer);
            //     }
            //     else {
            //     }
            // }

            //对于测试工程图和模糊层的设置
            if (evt.sourceTarget._animateToZoom == 17) {
                // console.log(map.getBounds());
                //使用turf来判断中心点是否处于当前缩放视图内部
                var pt = turf.point([modalCenter.geometry.coordinates[1], modalCenter.geometry.coordinates[0]]);
                var poly = turf.polygon([[
                    [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat],
                    [map.getBounds()._northEast.lng, map.getBounds()._southWest.lat],
                    [map.getBounds()._southWest.lng,  map.getBounds()._southWest.lat],
                    [map.getBounds()._southWest.lng, map.getBounds()._northEast.lat],
                    [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat]
                ]]);

                var result = turf.booleanPointInPolygon(pt, poly);
                if(result){
                    if(map.hasLayer(modalGroup)){

                    }else{
                        modalGroup.addTo(map);
                    }
                }
                else{
                    if(map.hasLayer(modalGroup)){
                        map.removeLayer(modalGroup)
                    }else{

                    }
                }

                //当缩放到17级的时候，对移动状态进行相应的判断
                map.on("move",function (evt) {
                    var pt1 = turf.point([modalCenter.geometry.coordinates[1], modalCenter.geometry.coordinates[0]]);
                    var poly1 = turf.polygon([[
                        [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat],
                        [map.getBounds()._northEast.lng, map.getBounds()._southWest.lat],
                        [map.getBounds()._southWest.lng,  map.getBounds()._southWest.lat],
                        [map.getBounds()._southWest.lng, map.getBounds()._northEast.lat],
                        [map.getBounds()._northEast.lng, map.getBounds()._northEast.lat]
                    ]]);

                    var result1 = turf.booleanPointInPolygon(pt1, poly1);
                    //如果中心点在范围内，而且没有加载图层，那么对图层进行加载
                    if(result1){
                        if(map.hasLayer(modalGroup)){

                        }else{
                            if(map.getZoom() == 17){
                                modalGroup.addTo(map);
                            }
                        }
                    }
                    //如果不在范围内，而且加载了图层，那么对图层进行移除
                    else{
                        if(map.hasLayer(modalGroup)){
                            map.removeLayer(modalGroup)
                        }else{

                        }
                    }
                });
            }else{
                if(map.hasLayer(modalGroup)){
                    map.removeLayer(modalGroup);
                }
            }
        });

        /**
         * 进入建筑内部结构的方法
         * @param {*} imageUrl
         */
        function mapTestInit(imageUrl) {
            maptest = L.map('img-map', {
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
                h = 650,
                url = imageUrl;
            var southWest = maptest.unproject([0, h], maptest.getMaxZoom() - 1);
            var northEast = maptest.unproject([w, 0], maptest.getMaxZoom() - 1);
            var bounds = new L.LatLngBounds(southWest, northEast);

            L.imageOverlay(url, bounds).addTo(maptest);

            //unproject是将像素点向坐标点进行转换，然后再添加到地图上
            var marker1 = L.marker(maptest.unproject([90, 600], maptest.getMaxZoom() - 1)).addTo(maptest);
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
            var marker2 = L.marker(maptest.unproject([400, 400], maptest.getMaxZoom() - 1)).addTo(maptest);
            marker2.on("click", function () {
                lay.open({
                    type: 1,
                    area:['400px','400px'],
                    shade: false,
                    title: '<i class="fa fa-history"></i>信息查看',
                    skin: 'layui-layer-lan',
                    content: '信息查看',
                });
            })
            var marker3 = L.marker(maptest.unproject([300, 500], maptest.getMaxZoom() - 1)).addTo(maptest);
            marker3.on("click", function () {
                lay.open({
                    type: 1,
                    area:['400px','400px'],
                    shade: false,
                    title: '<i class="fa fa-history"></i>信息查看',
                    skin: 'layui-layer-lan',
                    content: '信息查看',
                });
            })
            var marker4 = L.marker(maptest.unproject([100, 380], maptest.getMaxZoom() - 1)).addTo(maptest);
            marker4.on("click", function () {
                lay.open({
                    type: 1,
                    area:['400px','400px'],
                    shade: false,
                    title: '<i class="fa fa-history"></i>信息查看',
                    skin: 'layui-layer-lan',
                    content: '信息查看',
                });
            })

            maptest.on("zoomend", function (evt) {
                //回到map视角
                if (evt.sourceTarget._animateToZoom === 1) {
                    $("#map").css('display', 'block');
                    $(".img-map").css('display', 'none');
                    maptest.remove();
                    maptest = null;
                }
            });
        }

        /**
         * start-对于topbar的相关操作
         */
        //打开图层控制器
        $("#topbar-control").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-tasks"></i>&nbsp图层选择',
                skin: 'layui-layer-lan',
                //area: ['280px', '250px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#layerControlContainer'),
            });
        });

        //地图放大——改为拉框放大
        $("#topbar-zoomin").on("click", function () {
            //map.zoomIn();

            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            //设置画线变量
            var drawer = new L.Draw.Rectangle(map);
            drawer.enable();

            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    if (type === 'rectangle') {
                        //1.判断当前缩放等级，如果达到最大级别，提示不能放大了；
                        //2.若不是最大级别，获取当前rectangle的中心点，以此点为中心，放大一个级别

                        var curZoom = map.getZoom();
                        if(curZoom != map.getMaxZoom()){
                            console.log(layer);
                            //layer._bounds._northEast
                            //layer._bounds._southWest
                            var features = turf.featureCollection([
                                turf.point( [layer._bounds._northEast.lng, layer._bounds._northEast.lat]),
                                turf.point( [layer._bounds._southWest.lng, layer._bounds._southWest.lat]),
                            ]);
                            var center = turf.center(features);
                            //center.geometry.coordinates[0]
                            map.setZoomAround([center.geometry.coordinates[1],center.geometry.coordinates[0]],curZoom+1);

                        }
                        else{
                            lay.msg('已经缩放到最大等级，无法继续放大了！')
                        }

                    }
                });
            //释放内存
            drawer = null;
        });

        //地图缩小
        $("#topbar-zoomout").on("click", function () {
            // map.zoomOut();

            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            //设置画线变量
            var drawer = new L.Draw.Rectangle(map);
            drawer.enable();

            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    if (type === 'rectangle') {
                        //1.判断当前缩放等级，如果达到最大级别，提示不能放大了；
                        //2.若不是最大级别，获取当前rectangle的中心点，以此点为中心，放大一个级别

                        var curZoom = map.getZoom();
                        if(curZoom != map.getMinZoom()){
                            console.log(layer);
                            //layer._bounds._northEast
                            //layer._bounds._southWest
                            var features = turf.featureCollection([
                                turf.point( [layer._bounds._northEast.lng, layer._bounds._northEast.lat]),
                                turf.point( [layer._bounds._southWest.lng, layer._bounds._southWest.lat]),
                            ]);
                            var center = turf.center(features);
                            //center.geometry.coordinates[0]
                            map.setZoomAround([center.geometry.coordinates[1],center.geometry.coordinates[0]],curZoom-1);
                        }
                        else{
                            lay.msg('已经缩放到最小等级，无法继续缩小了！')
                        }

                    }
                });
            //释放内存
            drawer = null;
        });

        //地图模糊搜索
        $("#topbar-search").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-search"></i>&nbsp查询',
                skin: 'layui-layer-lan',
                area: ['280px', '250px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#query'),
            });
        });

        //地图历史视图
        $("#topbar-history").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-history"></i>历史视图',
                skin: 'layui-layer-lan',
                area: ['200px', '80px'],
                offset: ['150px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#history'),
            });
        });

        //距离测量
        $("#topbar-measure-length").on("click",function () {
            //用之前先清空一下图层，重新加载一下
            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            //设置画线变量
            var lineDrawer = new L.Draw.Polyline(map);
            lineDrawer.enable();
            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    if (type === 'polyline') {
                        var res = gisutil.distance(layer.getLatLngs());
                        //layer.alert(res)
                        lay.msg('距离是：' + res + '公里');
                    }
                    drawGroup.addLayer(layer);
                    //释放内存
                    lineDrawer = null;
                });
        });

        //面积测量
        $("#topbar-measure-area").on("click",function () {
            //用之前先清空一下图层，重新加载一下
            drawGroup.clearLayers();
            drawGroup.remove();
            drawGroup.addTo(map);

            //设置画线变量
            var drawer = new L.Draw.Rectangle(map);
            drawer.enable();

            map.on('draw:created',
                function (e) {
                    var type = e.layerType,
                        layer = e.layer;
                    if (type === 'rectangle') {
                        var res = gisutil.area(layer.getLatLngs());
                        //layer.alert(res)
                        lay.msg('面积是：' + res + '平方米');
                    }
                    drawGroup.addLayer(layer);
                });
            //释放内存
            drawer = null;
        });

        //测量工具图层清除
        $("#topbar-measure-clear").on("click", function () {
            removeDrawGroup();
        });


        //打印工具
        $("#topbar-print").on("click", function () {
            //调用jquery工具实现打印机打印
            $("#map").print(/*options*/);
        });



        /**
         * end-对于topbar的相关操作
         */


        /**
         * start-专题图的配置
         * 专题图目前只能以动态的方式进行添加，无法进行图层控制
         */

        // var wmsLayer = L.tileLayer.wms('http://192.168.0.144:8060/geoserver/cite/wms', {layers:'cite:chartmap'});
        // //添加图层到地图
        //饼状图测试
        // var myChart = echarts.init(document.getElementById('marker' + 1));
        // // 指定图表的配置项和数据
        // option = {
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b}: {c} ({d}%)"
        //     },
        //     series: [{
        //         name: '访问来源',
        //         type: 'pie',
        //         radius: ['20', '50'],
        //         avoidLabelOverlap: false,
        //         label: {
        //             normal: {
        //                 show: false,
        //                 position: 'center'
        //             },
        //             emphasis: {
        //                 show: true,
        //                 textStyle: {
        //                     fontSize: '18',
        //                     fontWeight: 'bold'
        //                 }
        //             }
        //         },
        //         labelLine: {
        //             normal: {
        //                 show: false
        //             }
        //         },
        //         data: [{
        //             value: 50,
        //             name: '直接访问'
        //         }, {
        //             value: 100,
        //             name: '邮件营销'
        //         }, {
        //             value: 200,
        //             name: '联盟广告'
        //         }, {
        //             value: 300,
        //             name: '视频广告'
        //         }, {
        //             value: 20,
        //             name: '搜索引擎'
        //         }]
        //     }]
        // };
        // // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
        //
        // //柱状图测试
        // // 基于准备好的dom，初始化echarts实例
        // var myChart2 = echarts.init(document.getElementById('marker' + 2));
        // // 指定图表的配置项和数据
        // var option2 ={
        //     tooltip: {
        //         trigger: 'axis'
        //     },
        //     xAxis: [{
        //         type: 'category',
        //         data: ['1月', '2月', '3月', '4月']
        //     }],
        //     yAxis: [{
        //         type: 'value',
        //         name: '水量',
        //         min: 0,
        //         max: 50,
        //         interval: 50,
        //         axisLabel: {
        //             formatter: '{value} ml'
        //         }
        //     }, {
        //         type: 'value',
        //         name: '温度',
        //         min: 0,
        //         max: 10,
        //         interval: 5,
        //         axisLabel: {
        //             formatter: '{value} °C'
        //         }
        //     }],
        //     series: [{
        //         name: '蒸发量',
        //         type: 'bar',
        //         data: [2.0, 4.9, 7.0, 23.2]
        //     }, {
        //         name: '降水量',
        //         type: 'bar',
        //         data: [2.6, 5.9, 9.0, 26.4]
        //     }, {
        //         name: '平均温度',
        //         type: 'line',
        //         yAxisIndex: 1,
        //         data: [2.0, 2.2, 3.3, 4.5]
        //     }]
        // };
        // // 使用刚指定的配置项和数据显示图表。
        // myChart2.setOption(option2);
        //

        /**
         * end-专题图的配置
         */
































































































































        //初始 加载 默认 函数
        $(function () {
            mapBarActive();
            //样式存在问题，所以地图导航条延后加载
            $(".map-top").css("display","block");

            rightChange();
            //char1();
            mapRestList();
            back();

            //给main高度

        });

        /**
         * main的初始化高度设定
         */
        function initHeight() {
            var height = $("body").height() - 60 + 'px !important';
            $("#core").css('cssText',height);
            console.log(height);
        }

        /**
         *地图工具栏导航条
         */
        //工具条点击效果
        function mapBarActive() {
            $(".map-top>ul>li").click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                $(this).find("a").addClass("active");
                $(this).find("a").parents("li").siblings().find("a").removeClass("active");
            })
        };

        //工具条点击效果
        function mapActive() {
            $(".map-top>ul>li").click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                $(this).find("a").addClass("active");
                $(this).find("a").parents("li").siblings().find("a").removeClass("active");
            })
        }

        //右侧功能界面切换
        function rightChange(){
            $(".map-right-top>ul>li").click(function(){
                var ins=$(this).index();
                $(this).addClass("li-active").siblings().removeClass("li-active");
                $(".map-core .map-core-content").eq(ins).show().siblings().hide();
            })
        }

        //服务点击查询
        function mapRestList(){
            $(".map-work>ul>li").click(function(){
                $(".map-work>ul").hide();
                $(".map-reslist").show();
            })
        }
        //服务点击 查询结果返回
        function back(){
            $("#back").on("click",function(){
                $(".map-work>ul").show();
                $(".map-reslist").hide();
            })
        }

        //统计分析图
        function char1() {

            var myChart = echarts.init(document.getElementById('char1'));

            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : 'right',
                    textStyle : {
                        color : '#ffffff',

                    },
                    data:['A','B','C','D']
                },

                calculable : false,
                series : [
                    {
                        name:'类型',
                        type:'pie',
                        radius : ['40%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '20',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:[
                            {value:335, name:'A'},
                            {value:310, name:'B'},
                            {value:234, name:'C'},
                            {value:135, name:'D'}

                        ]
                    }
                ]
            };

            myChart.setOption(option);
            window.addEventListener('resize', function () {myChart.resize();})
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
        var zNodes =[
            {"id":0,"name":"全国","open":true,icon:"../img/down1.png",children:[
                    { "id":1,"pid":0, "name":"长沙","open":true, icon:"../img/page.png",
                        children: [
                            { "id":11,"pid":1, "name":"设备1"},
                            { "id":12, "pid":1,"name":"设备2"},
                            { "id":13,"pid":1, "name":"设备3"}
                        ]
                    },
                    {"id":2,"pid":0,"name":"北京",icon:"../img/page.png",
                        children: [
                            { "id":21,"pid":2, "name":"设备4"},

                            { "id":23,"pid":2, "name":"设备5"}
                        ]
                    },
                    {"id":3,"pid":0,"name":"广州", icon:"../img/page.png",
                        children: [
                            { "id":31,"pid":3, "name":"设备6"},

                            { "id":33,"pid":3, "name":"设备7"}
                        ]}
                ]}

        ];

        var zTree;
        $(document).ready(function(){
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            $.fn.zTree.init($("#treeDemo1"), setting, zNodes);
            $.fn.zTree.init($("#treeDemo2"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("treeDemo");
        });

        /**
         * index-panel初始化
         */

        // mock 模拟 添加
        // Mock.mock('http://123.123.123.123:8080/mock/alarm', {
        //     "data|20": [
        //         {
        //             'id': '@integer(1, 100)',
        //             'name': '@name',
        //             'age': '@integer(1, 100)',
        //             'time': '@datetime',
        //             'email': '@email',
        //             'ip': '@ip'
        //
        //         }
        //     ]
        // });

        $('#workOrder-table').bootstrapTable({
            method: 'get',
            contentType: "application/x-www-form-urlencoded",//一种编码。好像在post请求的时候需要用到。这里用的get请求，注释掉这句话也能拿到数据
            url: "http://123.123.123.123:8080/mock/alarm",//要请求数据的文件路径
            dataField: "data",//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
            pageNumber: 1, //初始化加载第一页，默认第一页
            pagination: true,//是否分页
            // queryParams:queryParams,//请求服务器时所传的参数
            sidePagination: 'client',//指定服务器端分页
            pageSize: 10,//单页记录数
            pageList: [10, 20, 30, 40],//分页步进值
            responseHandler: responseHandler,//请求数据成功后，渲染表格前的方法
            colums: [{//列参数
                field: "id",
                title: "id",
            }, {
                field: "name",
                title: "名称",
            }, {
                field: "price",
                title: "价格"
            }]
        });
        // //请求服务数据时所传参数
        // function queryParams(params){
        //     return {
        //         pageSize : params.limit, //每一页的数据行数，默认是上面设置的10(pageSize)
        //         pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
        //     }
        // };

        function responseHandler(result) {
            console.log(result);
            return {
                total: result.dataLength, //总页数,前面的key必须为"total"
                data: result.rowDatas //行数据，前面的key要与之前设置的dataField的值一致.
            };
        };

        // // $.ajax({
        // //
        // //     dataType: 'json',
        // //     success: function (e) {
        // //
        // //     }
        // // });
        //
        // $('#workOrder-table').bootstrapTable({
        //     url: '123.123.123.123:8080/mock/alarm',
        //     method:'get',
        //     striped:true,
        //     clickToSelect:true,
        //     pagination:true,
        //     sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        //     pageNumber: 1,                       //初始化加载第一页，默认第一页
        //     pageSize: 10,                       //每页的记录行数（*）
        //     pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        //     total:20,
        //     // queryParamsType:'',
        //     // queryParams: function queryParams(params) {   //设置查询参数
        //     //     var param = {
        //     //         pageNumber: params.pageNumber,
        //     //         pageSize: params.pageSize,
        //     //     };
        //     //     return param;
        //     // },
        //     columns: [{
        //         radio:true
        //     },{
        //         field: 'id',
        //         title: 'guid'
        //     }, {
        //         field: 'name',
        //         title: '姓名'
        //     },
        //         {
        //             field: 'age',
        //             title: '年龄'
        //         }
        //     ],
        //     //data:e.data
        // });


        //使用layx作为工单和告警中心的弹窗
        layx.group('group-nomerge', [
            {
                id: 'device-info',
                title: '工单管理',
                content: document.getElementById('workOrder-panel'),
                cloneElementContent: false,
            },
            // {
            //     id: 'device-current',
            //     title: '告警信息',
            //     content: document.getElementById('alarm-panel'),
            //     cloneElementContent: false,
            // },
            // {
            //     id: 'device-history',
            //     title: '实时监测',
            //     content: '3',
            //     // cloneElementContent:false,
            //     statusBar: true,
            //     buttons: [
            //         {
            //             label: '确定',
            //             callback: function (id, button, event) {
            //                 layx.destroy(id);
            //             },
            //             style: 'color:#f00;font-size:16px;'
            //         }
            //     ]
            //
            // }
        ], 0, {
            id: 'alarm-order-group',
            position: 'lb',
            minHeight: '250',
            height: '250',
            width: '100%',
            storeStatus: 'true',
            closeMenu: false,
            closable: false,
            shadow: true,
            icon: '<i class="fa fa-tasks"></i>',
            //样式配置
            // icon:false,
            // minMenu:false,
            // maxMenu:false,
            // controlStyle:'background-color: #1070e2; color:#fff;',
            // border:false,
            // style:layx.multiLine(function(){/*
            //             #layx-purple-control-style .layx-inlay-menus .layx-icon:hover {
            //                 background-color: #9953c0;
            //             }
            //         */}),
            event:{
                onload: {
                    before: function (layxWindow, winform) {
                        layx.min('alarm-order-group');
                    }
                },
            }

        });



    });