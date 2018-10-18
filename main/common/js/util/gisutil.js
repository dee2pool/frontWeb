define(['jquery','turf','common','leaflet'],function ($,turf,common,leaflet) {
    var gisutil = {};

    //设置容器
    gisutil.setParents = function (el, newParent) {
        newParent.appendChild(el);
    };

    //右键菜单 刷新
    gisutil.refresh = function() {
        location.reload();
    };

    //距离测量
    gisutil.distance = function (latlngs) {
        var i = 0;
        var turfArray = [];
        for (i; i < latlngs.length; i++) {
            var temp = [latlngs[i].lng, latlngs[i].lat];
            turfArray[i] = temp;
        }
        var line = turf.lineString(turfArray);
        var length = turf.length(line, {units: 'miles'});
        var num = parseFloat(length);
        return num.toFixed(2);
        //lay.msg('距离是：' + num.toFixed(2) + '公里');
    };

    //面积测量
    gisutil.area = function (latlngs) {
        var polygon = turf.polygon([[[latlngs[0][0].lng, latlngs[0][0].lat], [latlngs[0][1].lng, latlngs[0][1].lat], [latlngs[0][2].lng, latlngs[0][2].lat], [latlngs[0][3].lng, latlngs[0][3].lat], [latlngs[0][0].lng, latlngs[0][0].lat]]]);
        var area = turf.area(polygon);
        //alert(area+"平方米");
        var num = parseFloat(area);
        return num;
    };

    //拼接字符串，为了拼接WMS服务的字符串
    gisutil.splitWMSUrl = function (wmsoption) {
        return common.host+"/geoserver/cite/ows?" + $.param(wmsoption);
    };

    //将layer数据转换为WKT
    gisutil.layerToWKT = function (layer) {
        var lng, lat, coords = [];
        if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                var latlngs1 = latlngs[i];
                if (latlngs1.length){
                    for (var j = 0; j < latlngs1.length; j++) {
                        coords.push(latlngs1[j].lng + " " + latlngs1[j].lat);
                        if (j === 0) {
                            lng = latlngs1[j].lng;
                            lat = latlngs1[j].lat;
                        }
                    }}
                else
                {
                    coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                    if (i === 0) {
                        lng = latlngs[i].lng;
                        lat = latlngs[i].lat;
                    }}
            };
            if (layer instanceof L.Polygon) {
                return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
            } else if (layer instanceof L.Polyline) {
                return "LINESTRING(" + coords.join(",") + ")";
            }
        } else if (layer instanceof L.Marker) {
            return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
        }
    };

    //将latlng转换为lnglat格式
    gisutil.yxToxy = function (coors) {
        return [coors[1],coors[0]];
    };

    gisutil.generateMap = function () {
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



    return gisutil;
});