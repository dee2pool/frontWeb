require.config({
    shim:{
        'echarts':{
            exports:'echarts'
        },
        'bootstrap':{
            deps: ['jquery'],
        },
        'sui':{
            deps:['jquery','bootstrap',],
            exports:'sui'
        }
    },
    paths:{
        "jquery":"../../../common/lib/jquery/jquery-3.3.1.min",
        "echarts":"../../../common/lib/Echarts/echarts.min",
        "client":"client",
        "echartsUtil":"echartsUtil",
        "bootstrap": "../../../common/lib/Bootstrap/js/bootstrap",
        "sui":"../../../common/lib/Bootstrap/libs/sui/js/sui.nav.min",
        "common":"../../../common/js/common",
    }
});
require(['jquery','echarts','client','echartsUtil','bootstrap','sui','common'],
function ($,echarts,client,echartsUtil,bootstrap,sui,common) {
    $("#head").html(common.head);
    var topbar = $('#sui_nav').SuiNav({});
    var navbar = topbar.create('nav_second', {}, {});
    $('.MenuToggle').click(function() {
        console.log("toggle");
        topbar.toggle();
    });
    $('.MenuOpen').click(function() {
        console.log("open");
        topbar.show();
    });


    /**
     * ws示例程序-----------------------------------------------------------------------------------------
     */
    var ischartInitialized=false;
    var dustChart;
    var gasChart;
    var humidityChart;
    var temperatureChart;
    var dust_x = [];
    var dust_y = [];
    var gas_x = [];
    var gas_y = [];
    var humidity_x = [];
    var humidity_y = [];
    var temperature_x = [];
    var temperature_y = [];
    /**
     * websocket主函数开始
     */
    //初始化表格
    //appStatContainer
    dustChart= echarts.init(document.getElementById('left-up-content'));
    gasChart= echarts.init(document.getElementById('left-up-middle'));
    humidityChart= echarts.init(document.getElementById('left-up-down'));
    temperatureChart= echarts.init(document.getElementById('right-up-down'));

    ischartInitialized=true;

    //配置初始化
    var dustoption = echartsUtil.createEmptyOption('粉尘变化','子标题','浓度','{value}%');
    var gasOption = echartsUtil.createEmptyOption('气体变化','子标题','浓度','{value}%');
    var humidityOption= echartsUtil.createEmptyOption('湿度变化','子标题','湿度','{value}');
    var temperatureOption= echartsUtil.createEmptyOption('温度变化','子标题','温度','{value} C');

    //set配置
    dustChart.setOption(dustoption);
    gasChart.setOption(gasOption);
    humidityChart.setOption(humidityOption);
    temperatureChart.setOption(temperatureOption);

    var ws= client.messageClient("test",function(msg){
        console.log("on msg:"+msg);
        var env=JSON.parse(msg.content);
        updateChart(env,dustoption,gasOption,dustChart,gasChart);
    });
    ws.connect();
    function updateChart(env,dustoption,gasOption,dustChart,gasChart){
        if(!ischartInitialized){
            return ;
        }

        var timeStr=echartsUtil.formatDate(Number.parseInt(env.time));
        var dust=env.dust;
        var gas=env.gas;
        var humidity=env.humidity;
        var temperature = env.temperature;

        //粉尘更新
        dust_x.push(timeStr);
        dust_y.push(dust);
        dustoption.series[0].data = dust_y;
        dustoption.xAxis.data = dust_x;
        dustChart.setOption(dustoption);

        //气体更新
        gas_x.push(timeStr);
        gas_y.push(gas);
        gasOption.xAxis.data= gas_x;
        gasOption.series[0].data=gas_y;
        gasChart.setOption(gasOption);

        //湿度
        humidity_x.push(timeStr);
        humidity_y.push(humidity);
        humidityOption.xAxis.data= humidity_x;
        humidityOption.series[0].data=humidity_y;
        humidityChart.setOption(humidityOption);

        //温度
        temperature_x.push(timeStr);
        temperature_y.push(temperature);
        temperatureOption.xAxis.data= temperature_x;
        temperatureOption.series[0].data=temperature_y;
        temperatureChart.setOption(temperatureOption);

        if(humidity < 45.5){
            var row = document.createElement('tr'); //创建行
            var time = document.createElement('td'); //创建第一列id
            time.innerHTML = timeStr; //填充数据
            row.appendChild(time); //加入行  ，下面类似

            var nameCell = document.createElement('td');//创建第二列name
            nameCell.innerHTML = '湿度';
            row.appendChild(nameCell);

            var num = document.createElement('td');//创建第三列job
            num.innerHTML = humidity;
            row.appendChild(num);

            var info = document.createElement('td');
            info.innerHTML = '数值异常';
            row.appendChild(info);

            var tbody = document.getElementById('alarmTable');
            tbody.appendChild(row);
        }


    }
});


