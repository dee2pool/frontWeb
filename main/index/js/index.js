/**
 * Created by lucah on 2018/8/19.
 */
require.config({
    shim:{
        'bootstrap':{
            deps: ['jquery'],
        },
        'sui':{
            deps:['jquery','bootstrap','jquery'],
            export:'sui'
        },
        'layer':{
            export:'lay'
        },
        'zui':{
            deps:['jquery'],
            export:'zui'
        },
        'dashboard':{
            deps:['jquery','zui'],
            export:'dashboard'
        },
        'boards':{
            deps:['jquery','zui','bootstrap'],
            export:'boards'
        },
        'layx': {
            exports: 'layx'
        },
    },

    paths:{
        "jquery":"../../common/lib/jquery/jquery-3.3.1.min",
        "bootstrap": "../../common/lib/bootstrap/js/bootstrap",
        "sui":"../../common/lib/bootstrap/libs/sui/js/sui.nav.min",
        "common":"../../common/js/common",
        "layer":"../../common/lib/layer/layer",
        "zui":"../../common/lib/zui/js/zui",
        "dashboard":"../../common/lib/zui/lib/dashboard/zui.dashboard",
        "boards":"../../common/lib/zui/lib/board/zui.board.min",
        "Mock":"../../common/lib/mock/mock",
        "topBar":"../../../common/component/head/js/topbar",
        "layx": "../../common/lib/layx/layx",

    }

});

require(['jquery','bootstrap','sui','common','layer','zui','dashboard','boards','Mock','topBar', 'layx'],function ($,bootstrap,sui,common,lay,zui,dashboard,boards,Mock,topBar,layx) {

    $('#head').html(topBar.htm);
    topBar.init();

    // var topbar = $('#sui_nav').SuiNav({});
    // var navbar = topbar.create('nav_second', {}, {});
    // $('.MenuToggle').click(function() {
    //     console.log("toggle");
    //     topbar.toggle();
    // });
    // $('.MenuOpen').click(function() {
    //     console.log("open");
    //     topbar.show();
    // });

    var data = null;

    /**
     * 判断首页加载的布局json数据是否是存在的；
     */
    if($.zui.store.get('data') === undefined){
        data = common.dashboard;
        $.zui.store.set('data', data);
    }
    else
    {
        data = $.zui.store.get('data');
    }

    var options = {
        height: 200,
        data:data,
        draggable: true,
        afterOrdered: function(newOrders) {
            var item;
            var temp = [];
            var i=0;
            console.log(newOrders);
            var newdata = [];
            for(item in newOrders){
                // console.log(item)
                // //item当前顺序，newOrders[item]当前顺序所知的内容
                var num =  parseInt(newOrders[item]);
                //console.log(newOrders[item]);
                // if(data[num-1].id != item){
                //     temp[i++] = num-1;
                // }
                var i;
                var id;
                for(i=0;i<data.length;i++)
                {
                    if(data[i].id === item){
                        id=i;
                        newdata[num-1] = data[id];
                    }
                }
            }
            console.log(newdata);
            $.zui.store.set('data', newdata);
        },
        //面板被删除
        afterPanelRemoved: function(id) {
            var i;
            for(i=0;i<data.length;i++){
                if(data[i].id === id){
                    data.splice(i,1);
                }
            }
            console.log(data);
            $.zui.store.set('data', data);
        },
        //大小改变
        onResize: function(e) {
            console.log('当前面板栅格大小被更改为', e);
            var i;
            for(i=0;i<data.length;i++){
                if(data[i].id === e.id){
                    data[i].colWidth = e.grid;
                }
            }
            console.log(data);
            $.zui.store.set('data', data);
        }
    };

    $('#dashboard').dashboard(options);


    $('#droppableBtn').droppable({
        target: '.dashboard',
        start: function() {
            console.log('开始');
        },
        drop: function() {
            console.log('拖');
            var temp = {
                id: 'panel9',   // 面板编号
                colWidth: '4',  // 栅格尺寸
                content:'          <div class="panel-heading">\n' +
                '            <div class="title">实时监测</div>\n' +
                '            <div class="panel-actions">\n' +
                '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
                '            </div>\n' +
                '          </div>\n' +
                '          <div class="panel-body">\n' +
                '            <div class="big todos-thumb" data-page="random-page" onclick="window.location.href=\'/GIS-Front/monitor/environment/views/environment.html\';">\n' +
                '                <span class="fa fa-calendar fa-2x pull-left dashboard-icon-position"></span><p>实时监测</p>\n' +
                '            </div>\n' +
                '          </div>'
            };
            var parentDiv = document.getElementById("main");
            var div2= document.getElementById("main").getElementsByTagName("div")[0];
            parentDiv.removeChild(div2);

            //再造一个新的div，并且一定要赋值class=dashboard dashboard-draggable，不然样式会混乱
            var d2 = document.createElement("div");
            d2.setAttribute("class","dashboard dashboard-draggable");
            var t = Mock.mock('@integer(1, 100)');
            d2.setAttribute("id",t);
            parentDiv.appendChild(d2);

            //加载div即可
            data[data.length] = temp;
            $.zui.store.set('data', data);
            options.data = data;
            $('#'+t).dashboard(options);
            console.log(data);
        },
        drag: function() {
        }
    });

    $(".setting-panel").click(function(){
        $(".add-panel").css("display","block")
    });



    $("#addControl").on("click",function () {
        $("#sidebar").toggleClass("collapsed");
        $("#main").toggleClass("col-md-12 col-md-9");
    });

    var height =$(window).height() - 70;
    var layerHeight = height+'px';


    // layer.open({
    //     type: 2,
    //     title: '置顶窗口',
    //     shadeClose: true,
    //     shade: false,
    //     offset: 'rb',
    //     maxmin: true, //开启最大化最小化按钮
    //     area: ['300px', layerHeight],
    //     content: 'stick.html',
    //     closeBtn: 0
    // });

    layx.html('stick','置顶窗口','置顶内容',{
        stickMenu:true,
        closeMenu:false,
        storeStatus:false,
        position:'lb',
        width:'400',
        height:'90%',
        event:{
            onload:{
                before:function(layxWindow,winform){
                    layx.min('stick');
                    console.log(winform.layxWindowId);
                },
            }
        }

    });
    //




    $(function () {

        $("#open-panel").on("click",function () {
            window.location.href = common.openurl+"/test-panel/view/panel.html";
        });
        $("#open-map").on("click",function () {
            window.location.href = common.openurl+"/core/view/core.html";
        });
        $("#open-environment").on("click",function () {
            window.location.href = common.openurl+"/monitor/environment/views/environment.html";
        });




    })

});