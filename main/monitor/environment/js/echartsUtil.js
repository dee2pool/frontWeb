define('echartsUtil',function () {
    var util = {};

    /**
     * 时间的格式化
     * @param time
     * @returns {string}
     */
    util.formatDate = function  (time){
        var date=new Date(time);
        var hour=date.getHours();
        var minute=date.getMinutes();
        var second= date.getSeconds();
        var timeStr=(hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+":"+(second<10?"0"+second:second);
        return  timeStr;
    }

    /**
     * echarts的空白option创建
     * @param title
     * @param subTitle
     * @param legend
     * @param yFormatter
     * @returns {{title: {text: *, subtext: *}, tooltip: {trigger: string}, legend: {data: *[]}, toolbox: {show: boolean, feature: {mark: {show: boolean}, dataView: {show: boolean, readOnly: boolean}, magicType: {show: boolean, type: string[]}, restore: {show: boolean}, saveAsImage: {show: boolean}}}, calculable: boolean, xAxis: *[], yAxis: *[], series: *[]}}
     */
    util.createEmptyOption =  function(title,subTitle,legend,yFormatter){
        return  {
            grid:{
                backgroundColor:'transparent'
            },

            title : {
                text: title,
                subtext: subTitle,
                textStyle:{
                    color:'#FFFFFF',
                },
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[legend],
                textStyle:{
                    color:'#FFFFFF',
                },
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true,
                        readOnly:
                            false
                    },
                    magicType :
                        {show: true,
                            type: ['line', 'bar']
                        },
                    restore : {show: true},
                    saveAsImage : {show: true}
                },
                iconStyle:{
                    borderColor:'#FFFFFF'
                }
            },
            calculable : true,
            xAxis : {
                    type : 'category',
                    boundaryGap : false,
                    data : [0],
                    nameTextStyle:{
                        color:'#ffffff'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#ffffff',
                            width:1,//这里是为了突出显示加上的
                        }
                    }
                }
            ,
            yAxis : {
                    type : 'value',
                    axisLabel : {
                        formatter: yFormatter
                    },
                    nameTextStyle:{
                        color:'#ffffff'
                    },
                axisLine:{
                    lineStyle:{
                        color:'#ffffff',
                        width:1,//这里是为了突出显示加上的
                    }
                }
                },
            series : [

                {
                    name:legend,
                    type:'line',
                    data:[0],
                }
            ]
        };
    };

    return util;
});