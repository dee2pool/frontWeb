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
        'iclient': {
            deps: ['leaflet'],
            exports: 'iclient'
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
        "iclient": "../../common/lib/leaflet-lib/iclient/iclient9-leaflet",
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
        "topBar":"../../../common/component/head/js/topbar"

    }
});
require(['jquery', 'common', 'bootstrap', 'leaflet', 'contextmenu', 'history', 'gisutil', 'layer', 'draw', 'turf', 'zoomhome', 'jqueryPrint', 'minimap', 'search', 'providers', 'sui', 'device', 'layx', 'echarts', 'jqueryui', 'lobipanel', 'bootstrap-table', 'mock', 'indoor', 'snogylop','topBar'],
    function ($, common, bootstrap, leaflet, contextmenu, history, gisutil, lay, draw, turf, zoomhome, jqueryPrint, minimap, search, providers, sui, device, layx, echarts, jqueryui, lobipanel, bootstrapTable, Mock, indoor, snogylop,topBar) {

        //加载公用头部导航栏标签
        //$("#head").html(common.head);
        $('#head').html(topBar.htm);
        topBar.init();

        //全局通用地址
        var host = common.host;
        //全局通用变量，用于所有的绘图图层
        var drawGroup = new L.FeatureGroup();

        /**
         * 核心地图变量
         */
        var map = L.map('map', {
            center: [28.25152980300004, 113.08251277400007],
            maxZoom: 17,
            minZoom: 15,
            zoom: 15,
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
            minZoom: 15,
            reuseTiles: true
        }).addTo(map);//添加tms

        //测试工厂地图加载
        var testSanYiLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:sanyi@EPSG:4326@png/{z}/{x}/{y}.png', {
            tms: true,
            maxZoom: 17,
            minZoom: 15,
            reuseTiles: true
        });//添加tms

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
        L.control.minimap(xsTileLayer2, { mapOptions: { logoControl: true }, toggleDisplay: true, minimized: true }).addTo(map);

        //比例尺
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
                offset: ['120px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#history'),
            });
        });


        /**
         * 测量工具相关
         */
        //打开测量窗口
        $("#measure-open").on("click", function () {
            lay.open({
                type: 1,
                shade: false,
                title: '<i class="fa fa-calculator"></i>&nbsp测量',
                skin: 'layui-layer-lan',
                area: ['325px', '100px'],
                offset: ['120px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#measure'),
            });
        });
        //距离测量
        $("#measure-length").on("click", function () {
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
        //距离测量
        $("#measure-area").on("click", function () {
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
        $("#measure-clear").on("click", function () {
            removeDrawGroup();
        });

        /**
         * 打印工具相关
         */

        $("#print-open").on("click", function () {
            //调用jquery工具实现打印机打印
            $("#map").print(/*options*/);
        });

        /**
         * 设备点相关
         */
        //点测试图层
        var xsLayerGroup = L.layerGroup();
        //xsLayerGroup.addTo(map);

        var pointOption = common.wmsDefaultOption;
        pointOption.typeName = 'cite:xspoint';

        //对象拼接转换为字符串
        //var xsUrl = host + "/geoserver/cite/ows?" + jQuery.param(pointOption);

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
                //这里的逻辑应该是每次打开之前都要进行一下清空
                // $("#pointContent").modal('show');
                // $("#point-modal-name").val(feature.properties.name);
                // $("#point-modal-coors").val(feature.geometry.coordinates);
                //$("#pointModalId").val(feature.id);
                $("#device-info-name").val("");
                $("#device-info-desc").val("");
                $("#device-info-coors").val("");
                // $("#c1").html("");
                // $("#c2").html("");

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
                            // ondestroy:{
                            //     before:function(layxWindow,winform,inside,escKey){
                            //         //alert("关闭之前");
                            //         drawGroup.clearLayers();
                            //     },
                            //     after: function () {
                            //         //alert("关闭之后");
                            //     }
                            // }
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
                offset: ['120px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#query'),
            });
        });
        //精确模糊查询容器更改
        var query = document.getElementById('queryControl');
        query.appendChild(queryControl.getContainer());

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
         * 图层控制器
         */
        var baseMaps = {
            "星沙瓦片地图": xsTileLayer,
        };
        var overlayMaps = {
            "轨迹": routeLayerGroup,
            "设备点": xsLayerGroup,

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
                offset: ['120px', '10px'],
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
                offset: ['120px', '10px'],
                //title: false, //不显示标题
                //.layer-open-content
                content: $('#coordinate'),
            });
        });

        //layx.html('str','字符串文本','Hello Layx!');

        $("#add-test").on("click", function () {
            layx.group('group-nomerge', [
                {
                    id: 'group1',
                    title: '文本窗口',
                    content: document.getElementById('add-device-div')
                },
                {
                    id: 'group2',
                    title: '网页窗口',
                    type: 'url',
                    url: './iframe.html'
                },
                {
                    id: 'taobao',
                    title: '百度官网',
                    type: 'url',
                    url: 'https://www.baidu.com'
                }
            ], 1, {
                    id: '1',
                    mergeTitle: false,
                    title: '我是不合并的标题'
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
         * 初始化加载工厂楼内地图和相关的右侧控件 内部 室内
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
        //mask所用到的geojson
        // var a = {
        //         "type": "FeatureCollection",
        //     "features": [
        //         {
        //             "id":"1",
        //             "type": "Feature",
        //             "geometry": {
        //                 "type": "Polygon",
        //                 "coordinates":[
        //                     [
        //                         [28.25219321,113.08259818],
        //                         [28.25380815,113.08434188],
        //                         [28.25433718,113.08051083],
        //                         [28.25219321,113.08259818],
        //                     ]
        //                 ]
        //             }
        //         }
        //     ]
        // };
        //
        // $(function () {
        //     L.geoJson(a, {invert: true}).addTo(map);
        // });

        map.on("zoomend", function (evt) {
            //对于楼层的操作
            if (evt.sourceTarget._animateToZoom === 17) {
                // $.getJSON("../asset/json/indoor.json", function(geoJSON) {
                indoorLayer.addTo(map);
                levelControl.addTo(map);
                // });
            }
            else {
                map.removeLayer(indoorLayer);
                map.removeControl(levelControl);
            }

            //三一工厂是否应该出现的判断
            if (evt.sourceTarget._animateToZoom >= 16) {
                var center=[113.09898555278778,28.24381649494171];
                console.log(map.getBounds());

                if(center[0] < map.getBounds()._northEast.lng && center[0] > map.getBounds()._southWest.lng && center[1] > map.getBounds()._southWest.lat && center[1] < map.getBounds()._northEast.lat){
                    if (map.hasLayer(testSanYiLayer)) {

                    }
                    else {
                        testSanYiLayer.addTo(map);
                    }
                }

            }
            else {
                if (map.hasLayer(testSanYiLayer)) {
                    map.removeLayer(testSanYiLayer);
                }
                else {
                }

            }

        });

        /**
         * 用于对建筑内部结构图的初始化
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
            })
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
         *导航条初始化
         */
        var topbar = $('#sui_nav').SuiNav({});
        var navbar = topbar.create('nav_second', {}, {});
        $('.MenuToggle').click(function () {
            console.log("toggle");
            topbar.toggle();
        });
        $('.MenuOpen').click(function () {
            console.log("open");
            topbar.show();
        });
        /**
         * index-panel初始化
         */

        // mock 模拟 添加
        Mock.mock('http://123.123.123.123:8080/mock/alarm', {
            "data|20": [
                {
                    'id': '@integer(1, 100)',
                    'name': '@name',
                    'age': '@integer(1, 100)',
                    'time': '@datetime',
                    'email': '@email',
                    'ip': '@ip'

                }
            ]
        });

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
            {
                id: 'device-current',
                title: '告警信息',
                content: document.getElementById('alarm-panel'),
                cloneElementContent: false,
            },
            {
                id: 'device-history',
                title: '实时监测',
                content: '3',
                // cloneElementContent:false,
                statusBar: true,
                buttons: [
                    {
                        label: '确定',
                        callback: function (id, button, event) {
                            layx.destroy(id);
                        },
                        style: 'color:#f00;font-size:16px;'
                    }
                ]

            }
        ], 0, {
                id: 'layx-group',
                position: 'lb',
                minHeight: '250',
                height: '250',
                width: '100%',
                storeStatus: 'true',

                closeMenu: false,
                closable: false,
                shadow: true,
                icon: '<i class="fa fa-tasks"></i>',

                // 加载事件
                onload: {
                    after: function (layxWindow, winform) {
                        layx.min('layx-group');
                    }
                },
            });



    });