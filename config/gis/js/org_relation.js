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
        var host = common.geoserver;

        var serviceHost = common.host;

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
            //console.log(treeNode);
            var orgCode = treeNode.code;
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
                        var coors = drawlayer.getLatLng();
                        var zoom = map.getZoom();
                        var hasIndoor = null;
                        //弹出layx对话框，是否确定这个位置，如果确认，执行异步操作，如果不确定，当前点移除
                        lay.confirm('是否添加内部地图？', {
                            btn: ['添加内部地图','直接保存','取消'] //按钮
                        }, function(){
                            hasIndoor = true;
                            openIndoorWin(orgCode,coors,hasIndoor);
                            drawer.disable();
                            lay.closeAll();
                        }, function(){
                            hasIndoor = false;
                            console.log('直接保存');
                            saveOrgPoint(orgCode,coors,hasIndoor);
                            //关闭所有的layer弹出层
                            lay.closeAll();
                        },function(){
                            drawGroup.removeLayer(drawlayer);
                        });
                    }
                );
            }

        });

        /**
         * 删除关联关系
         */
        $("#delete").on("click",function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            console.log(treeNode);
            var orgCode = treeNode.code;
            if(treeNode === undefined){
                alert("请先选择一个组织节点");
                return;
            }
            else{
                lay.confirm('确定删除关联关系？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    deleteOrgGeo(orgCode,function (resp) {
                        if(resp === 'success'){
                            lay.confirm('删除成功！', {
                                btn: ['确定'] //按钮
                            }, function(){
                                location.reload();
                            });
                        }
                    });
                },function () {
                    lay.closeAll();
                });

            }
            //deleteOrgGeo
        });

        /**
         *打开添加楼层内部信息的窗口
         */
        function openIndoorWin(orgCode,coors,hasIndoor) {
            layx.html('indoor', '添加楼层', document.getElementById('indoor'), {
                //取用模式，而不是拷贝模式，不然的话拿不到值
                cloneElementContent: false,
                //上边中间打开
                //position: 'c',
                maxMenu: false,
                minMenu: false,
                closeMenu: false,
                minMenu: false,
                maxMenu: false,
                controlStyle: 'background-color: #1070e2; color:#fff;',
                border: false,
                style: layx.multiLine(function () {/*
                        #layx-purple-control-style .layx-inlay-menus .layx-icon:hover {
                            background-color: #9953c0;
                        }
                    */
                }),
                width: 750,
                height: 500,
                statusBar: true,
                storeStatus: false,
                icon: '<i class="fa fa-plus-circle"></i>',
                event: {},
                buttons: [
                    {
                        label: '保存',
                        callback: function (id, button, event) {
                            console.log('保存');
                            saveOrgPoint(orgCode,coors,hasIndoor);
                        }
                    },
                    {
                        label: '关闭',
                        callback: function (id, button, event) {
                            console.log('关闭');
                            layx.destroy(id);
                        }
                    }
                ]
            });
        };

        /**
         * export-building
         * 添加楼层的内部信息
         */
        $("#export-building").on("click",function () {
            var total = parseInt($("#indoor-total").val());
            var start = parseInt($("#indoor-start").val());
            console.log(typeof  $("#indoor-total").val());
            if (total === null || start === null || total < start) {
                alert('楼层信息输入有误！请重新输入');
                return;
            }

            for (var i = start; i < total; i++) {
                var t = i;
                if (t >= 0) {
                    t += 1;
                }
                //动态创建一个tr行标签,并且转换成jQuery对象
                var $trTemp = $("<tr></tr>");
                //往行里面追加 td单元格
                $trTemp.append("<td" + " " + "id=indoorId" + i + ">" + t + "</td>");
                $trTemp.append("<td>" + t + "楼" + "</td>");
                $trTemp.append("<td>" + "<input class='form-control'" + "id=indoorImg" + i + " type='file'/>" + "<div style='display: none'" + "id=indoorDiv" + i + "></div>" + "</td>");
                $trTemp.appendTo("#indoor-table");
            }
        });

        /**
         * 一键上传所有内部楼层的照片upload-all-level-img
         */
        $("#upload-all-level-img").on("click", function () {
            //获取楼层表格行数，获取的表格行数包括了题头，所以实际数值应该减一
            var level = $("#indoor-table").find("tr").length;
            //由于楼层的起点是不一定的，所有获取表格除题头外的第一行的楼层号从而来确定楼层号的起点位置
            var startNum = $("#indoor-table tr:eq(1) td:eq(0)").text();
            level = parseInt(level);
            level = level - 1;
            startNum = parseInt(startNum);
            var total = level + startNum;
            //遍历上传图片
            for (var i = startNum; i < total; i++) {
                var levelNum = $("#indoorId" + i).text();
                var levelImg = $("#indoorImg" + i).val();
                //console.log(levelNum,levelImg);
                var imgId = "#indoorImg" + i;
                //赋值保存
                uploadImage(imgId, levelNum, i);
            }
        });

        /**
         * 图片上传的分离方法
         */
        function uploadImage(id, levelNum, flag) {
            var type = "file";          //后台接收时需要的参数名称，自定义即可
            var formData = new FormData();
            formData.append(type, $(id)[0].files[0]);    //生成一对表单属性
            $.ajax({
                type: "POST",           //因为是传输文件，所以必须是post
                url: end + '/feature/upload',         //对应的后台处理类的地址
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    //console.log(data,levelNum,flag);
                    $("#indoorDiv" + flag).html(data);
                    alert(levelNum + '楼上传成功！');
                }
            });
        };

        function saveOrgPoint(orgCode,latlng,hasIndoor) {
            var code =orgCode;
            var zoom = parseInt(map.getZoom());
            var hasIndoor = hasIndoor;
            //坐标字符串的处理
            var t = [latlng.lat,latlng.lng];
            var coor = t;

            //楼层号数组和楼层图片的数组
            var levelNumArray = [0];
            var levelImgArray = [0];

            //如果在室内，那么需要保存内部图片
            if(hasIndoor){
                //构造楼层号数组和图片数组
                var level = $("#indoor-table").find("tr").length;
                //由于楼层的起点是不一定的，所有获取表格除题头外的第一行的楼层号从而来确定楼层号的起点位置
                var startNum = $("#indoor-table tr:eq(1) td:eq(0)").text();
                level = parseInt(level);
                level = level - 1;
                startNum = parseInt(startNum);
                var total = level + startNum;
                var j = 0;
                for (var i = startNum; i < total; i++) {
                    var levelNum = $("#indoorId" + i).text();
                    //上传之后的图片，缓存在表格中的隐藏div中
                    var levelImg = $("#indoorDiv" + i).html();
                    levelNumArray[j] = levelNum;
                    levelImgArray[j] = levelImg;
                    j++;
                }
            }
            else{

            }

            var data = {
                orgId:code,
                zoomNum: zoom,
                hasIndoor: hasIndoor,
                coors:coor,
                levelNum: levelNumArray,
                levelImg: levelImgArray,

            };
            $.ajax({
                url: end + '/orggeo/addOrgPoint',
                type: 'GET',
                contentType: "application/json",
                data: data,
                cache: false,
                success: function (resp) {
                    if(resp === 'success'){
                        layer.confirm('添加成功！', {
                            btn: ['确定'] //按钮
                        }, function(){
                            location.reload();
                        });
                    }
                },
                error: function () {
                    alert(resp);
                }
            });
        };
        
        function listByOrgId(orgCode,onSuccess) {
            $.ajax({
                url: end + '/orggeo/listByOrgId',
                type: 'GET',
                contentType: "application/json",
                data: {
                    code:orgCode
                },
                cache: false,
                success: onSuccess,
                error: function () {
                    alert(resp);
                }
            });
        };

        /**
         * 删除关联关系
         * @param orgCode
         * @param onSuccess
         */
        function deleteOrgGeo(areaCode,onSuccess) {
            $.ajax({
                url: end + '/orggeo/deleteOrgGeo',
                type: 'GET',
                contentType: "application/json",
                data: {
                    areaCode:areaCode
                },
                cache: false,
                success: onSuccess,
                error: function () {
                    //alert(resp);
                }
            });
        }

        $(document).ready(function () {
            //根据分类异步加载相关要素设计
            var setting_chooseCategory = {
                async: {
                    enable: true,
                    url: getAsyncUrl,
                    //提交的参数
                    autoParam: ["code=parentTypeCode"],//异步加载时需要自动提交父节点属性的参数，提交parentTypeCode为当前节点的code值
                    type: "get",
                    dataFilter: ajaxchooseCategoryFilter //用来将ajax异步返回的json数据处理成为ztree能用的json数据
                },
                data: {},
                callback: {
                    onClick: ajaxchooseCategoryOnClick
                }
            };

            //动态构造url
            function getAsyncUrl(treeId, treeNode) {
                //https://192.168.0.144:8080/base-data/org/-1/chidlren
                var code = treeNode.code;
                var url = serviceHost+"/base-data/org/"+treeNode.code+"/chidlren";
                return url;
            };

            //处理返回的数据格式
            function ajaxchooseCategoryFilter(treeId, parentNode, responseData) {
                var d = []; //构造数组，用于存在改造后的数据，并且返回
                for (var i = 0; i < responseData.dataSize; i++) {
                    var temp = responseData.data[i];
                    //加isParent主要是为了使得数组可以下拉打开查询
                    //如果此节点下有节点，那么会加载相应的节点，如果没有，则不会添加相应的节点
                    temp.isParent = 'true';
                    d[i] = temp
                }

                return d;
            };
            var group = L.featureGroup().addTo(map);
            function ajaxchooseCategoryOnClick(event, treeId, treeNode) {
                console.log(treeNode);
                var code = treeNode.code;
                //异步查询，展点
                group.clearLayers();
                listByOrgId(code,function (repo) {
                    var marker ;
                    if(repo.length>0){
                        console.log(repo);
                        if(repo[0].hasIndoor === true){
                            var configId = repo[0].orgId;
                            //异步查询内部代码
                            $.ajax({
                                url:end+'/orggeo/listByOrgId',
                                type:'GET',
                                contentType:"application/json",
                                data:{
                                    code:configId
                                },
                                cache:false,
                                success:function (resp) {
                                    //console.log(data);
                                    var data = resp[0];
                                    var coor = data.geom.coordinates;
                                    var oId = data.oid;
                                    var marker = L.marker([coor[1],coor[0]]).addTo(map);
                                    map.panTo([coor[1],coor[0]]);
                                    group.addLayer(marker)
                                    marker.on("dblclick",function () {
                                        console.log('显示内部地图');
                                        //将原有地图注销
                                        map.remove();
                                        //重新注册新的地图事件
                                        map = L.map('map', {
                                            minZoom: 0,
                                            maxZoom: 4,
                                            center: [0, 0],
                                            zoom: 4,
                                            crs: L.CRS.Simple
                                        });
                                        map.on("baselayerchange",function (layer) {
                                            var url = layer.layer._url;
                                            console.log(url,typeof url);
                                            var id = url.split("/");
                                            $("#indoorLevelId").val("");
                                            $("#indoorLevelId").val(id[id.length-1]);
                                        });
                                        var w = 1024,
                                            h = 650;
                                        //url = imageUrl;
                                        var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
                                        var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
                                        var bounds = new L.LatLngBounds(southWest, northEast);

                                        //异步加载内部的图片
                                        $.ajax({
                                            url:end+'/orggeo/listByOidToIndoor',
                                            type:'GET',
                                            contentType:"application/json",
                                            data:{
                                                "oId":oId
                                            },
                                            cache:false,
                                            success:function (data) {
                                                /**
                                                 * 图层控制器
                                                 */
                                                function generateMap() {
                                                    this.keys = new Array();
                                                    this.values= new Array();
                                                    this.set = function (key, value) {
                                                        if (this.values[key] == null) {//如键不存在则身【键】数组添加键名
                                                            this.keys.push(value);
                                                        }
                                                        this.values[key] = value;//给键赋值
                                                    };
                                                    this.get = function (key) {
                                                        return this.values[key];
                                                    };
                                                    this.remove = function (key) {
                                                        this.keys.remove(key);
                                                        this.values[key] = null;
                                                    };
                                                    this.isEmpty = function () {
                                                        return this.keys.length == 0;
                                                    };
                                                    this.size = function () {
                                                        return this.keys.length;
                                                    };
                                                };
                                                var t=new generateMap();
                                                var baseMap = new Object();
                                                for(var i=0;i<data.length;i++){

                                                    var num = data[i].indoorNum;
                                                    var level = L.imageOverlay("../../../main/common/asset/img/upload/"+data[i].indoorImg, bounds);

                                                    baseMap[num]=level;
                                                }
                                                var overlayMaps = {};
                                                //设置图层控制器
                                                var layerControl = L.control.layers(baseMap, overlayMaps, { collapsed: false,position:'bottomright' }).addTo(map);
                                            },
                                            error:function () {
                                                //console.log(0)
                                            }
                                        });

                                    });
                                },
                                error:function () {
                                    alert("添加失败");
                                }
                            });
                        }else {
                            map.panTo([repo[0].geom.coordinates[1], repo[0].geom.coordinates[0]]);
                            marker = L.marker([repo[0].geom.coordinates[1], repo[0].geom.coordinates[0]]).addTo(map);
                            group.addLayer(marker);
                        }

                    }else{
                        layer.msg('当前节点未关联！');
                    }

                });
            };

            $.ajax({
                url: serviceHost + '/base-data/org/-1/chidlren',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    var d = data.data[0];
                    d.isParent = 'true';
                    $.fn.zTree.init($("#treeDemo"), setting_chooseCategory, data.data[0]);
                }
            });

        });



    });