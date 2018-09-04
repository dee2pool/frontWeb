require.config({
    shim: {
        'echarts': {
            deps: ['jquery'],
            export: 'echarts'
        },
        'ztree':{
            deps:['jquery'],
            export:'ztree'
        },
    },
    paths: {
        "jquery": "../../common/lib/jquery/jquery-3.3.1.min",
        "echarts": "../../common/lib/echarts/echarts",
        "common": "../../common/js/common",
        "depot": "../js/depot",
        "leaflet": "../../common/lib/leaflet/leaflet",
        "ztree":"../lib/ztree/js/jquery.ztree.all.min",
    }
});
require(["jquery", "echarts", "common", "depot", "leaflet","ztree"], function ($, echarts, common, depot, leaflet,ztree) {
    $("#head").html(depot.head);

    $(function () {
        mapActive();
        rightChange();
        char1();
        mapRestList();
        back();
    })
    //全局通用地址
    var host = common.host;
    var map = L.map('map', {
        center: [28.25152980300004, 113.08251277400007],
        maxZoom: 17,
        minZoom: 16,
        zoom: 16,
        crs: L.CRS.EPSG4326,
    });
    //天地图星沙瓦片地图加载
    var xsTileLayer = L.tileLayer(host + '/geoserver/gwc/service/tms/1.0.0/cite:xstd17@EPSG:4326@png/{z}/{x}/{y}.png', {
        tms: true,
        maxZoom: 17,
        minZoom: 15,
        reuseTiles: true
    }).addTo(map);//添加tms




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

        var myChart = echarts.init($("#char1")[0]);

        option = {
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
                data:['客运车','危险品车','网约车','学生校车']
            },

            calculable : false,
            series : [
                {
                    name:'车类型',
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
                        {value:335, name:'客运车'},
                        {value:310, name:'危险品车'},
                        {value:234, name:'网约车'},
                        {value:135, name:'学生校车'}

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

});