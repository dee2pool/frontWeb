require.config({
    shim: {
        'echarts':{
            deps:['jquery'],
            export:'echarts'
        },
    },
    paths : {
        "jquery" : "../../common/lib/jquery/jquery-3.3.1.min",
        "echarts":"../../common/lib/echarts/echarts",
        "leaflet":"../../common/lib/leaflet/leaflet",
        "common":"../../common/js/common",
        "depot":"../js/depot"
    }
});
require(["jquery","echarts","leaflet","common","depot"],function($,echarts,leaflet,common,depot){

    $("#head").html(depot.head);

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



    $(function(){
        char1();
        char2();
        char3();
        char4();
    });


    //统计分析图
    function char1() {
        var dom = document.getElementById("char1");
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
    function char2() {

        var myChart = echarts.init(document.getElementById("char2"));
        option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {show:'true',borderWidth:'0'},
            legend: {
                data:['行驶', '停车','熄火','离线'],
                textStyle : {
                    color : '#ffffff',

                }
            },

            calculable :false,
            xAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            color:['#f2f2f2'],
                            width:0,
                            type:'solid'
                        }
                    }

                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : ['客运车','危险品车','网约车','学生校车'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            width:0,
                            type:'solid'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'行驶',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[320, 302, 301, 334]
                },
                {
                    name:'停车',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[120, 132, 101, 134]
                },
                {
                    name:'熄火',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[220, 182, 191, 234]
                },
                {
                    name:'离线',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[150, 212, 201, 154]
                }

            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', function () {myChart.resize();})

    }
    function char3() {

        var myChart = echarts.init(document.getElementById('char3'));

        option = {
            legend: {
                data:['车辆行驶数量'],
                textStyle : {
                    color : '#ffffff',

                }
            },
            grid: {show:'true',borderWidth:'0'},

            calculable : false,
            tooltip : {
                trigger: 'axis',
                formatter: "Temperature : <br/>{b}km : {c}°C"
            },
            xAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}',
                        textStyle: {
                            color: '#fff'
                        }
                    },

                    splitLine:{
                        lineStyle:{
                            width:0,
                            type:'solid'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisLine : {onZero: false},
                    axisLabel : {
                        formatter: '{value} km',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            width:0,
                            type:'solid'
                        }
                    },
                    boundaryGap : false,
                    data : ['0', '10', '20', '30', '40', '50', '60', '70', '80']
                }
            ],
            series : [
                {
                    name:'车辆行驶数量',
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                shadowColor : 'rgba(0,0,0,0.4)'
                            }
                        }
                    },
                    data:[15, 0, 20, 45, 22.1, 25, 70, 55, 76]
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', function () {myChart.resize();})

    }
    function char4() {

        var myChart = echarts.init(document.getElementById('char4'));

        option = {
            grid: {show:'true',borderWidth:'0'},
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },

                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },

            xAxis : [
                {
                    type : 'category',
                    splitLine: {show:false},
                    data : ['客运车','危险品车','网约车','学生校车'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }

                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitLine: {show:false},
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }
            ],
            series : [

                {
                    name:'报警数量',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                    data:[2900, 1200, 300, 200, 900, 300]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', function () {myChart.resize();})
    }

});