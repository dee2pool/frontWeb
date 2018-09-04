require.config({
    shim: {
        'echarts':{
            deps:['jquery'],
            export:'echarts'
        },
        'ztree':{
            deps:['jquery'],
            export:'ztree'
        },
    },
    paths : {
        "jquery" : "../../common/lib/jquery/jquery-3.3.1.min",
        "echarts":"../../common/lib/echarts/echarts",
        "common":"../../common/js/common",
        "ztree":"../lib/ztree/js/jquery.ztree.all.min",
        "leaflet":"../../common/lib/leaflet/leaflet",
        "depot":"../js/depot"
    }
});

require(["jquery","echarts","common","ztree","leaflet","depot"],function($,echarts,common,ztree,leaflet,depot){

    $("#head").html(depot.head);

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
    
    function init(){
        $(".dataTabUl li").click(function(){
            var ins=$(this).index();
            $(this).find("a").addClass("dataActive").end().siblings().find("a").removeClass("dataActive");
            $(".dataConBox .dataBoxSub").eq(ins).show().siblings().hide();
        })
    }

    //全局通用地址
    var host = common.host;
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
});