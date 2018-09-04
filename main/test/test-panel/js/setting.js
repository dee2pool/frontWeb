require.config({

    shim:{
        'bootstrap':{
            deps: ['jquery'],
        },
        'sui':{
            deps:['jquery','bootstrap','jquery'],
            export:'sui'
        },
        'zui':{
            deps:['jquery'],
            export:'zui'
        },
        'dashboard':{
            deps:['jquery','zui'],
            export:'dashboard'
        },

    },

    paths:{
        "common":"../../../common/js/common",
        "jquery":"../../../common/lib/jquery/jquery-3.3.1.min",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap",
        "sui":"../../../common/lib/bootstrap/libs/sui/js/sui.nav.min",
        "zui":"../../../common/lib/zui/js/zui.lite",
        "dashboard":"../../../common/lib/zui/lib/dashboard/zui.dashboard",
        "Mock":"../../../common/lib/mock/mock"


    }
});
require(['common','jquery','bootstrap','sui','zui','dashboard','Mock'],
    function (common,$,bootstrap,sui,zui,dashboard,Mock) {

        $("#head").html(common.head);

        var topbar = $('#sui_nav').SuiNav({});
        var navbar = topbar.create('nav_second', {}, {});
        $('.MenuToggle').click(function() {
            topbar.toggle();
        });
        $('.MenuOpen').click(function() {
            topbar.show();
        });


        //var data = common.dashboard;
        var data =$.zui.store.get('data');
        //$.zui.store.set('data', data);

        var options = {
            height: 300,
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
        $('#dashboard2').dashboard({draggable: false});

        $("#add1").on("click",function () {
            var temp = {
                id: 'panel9',   // 面板编号
                colWidth: '6',  // 栅格尺寸
                content:'<div class="panel-heading">'+
                '<i class="icon icon-list"></i>'+
                '<span class="title">添加面板1</span>'+
                '<div class="panel-actions">'+
                '<a href="void:javascript:void(0);" data-toggle="tooltip" title="添加"><i class="fa fa-plus" aria-hidden="true"></i></a>'+
                '</div>'+
                '</div>'+
                '<div class="panel-body">'+
                '<p>添加面板1</p>'+
                '</div>'
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

        });

        $("#add2").on("click",function () {
            var temp = {
                id: 'panel9',   // 面板编号
                colWidth: '6',  // 栅格尺寸
                content:'<div class="panel-heading">'+
                '<i class="icon icon-list"></i>'+
                '<span class="title">添加面板2</span>'+
                '<div class="panel-actions">'+
                '<a href="void:javascript:void(0);" data-toggle="tooltip" title="添加"><i class="fa fa-plus" aria-hidden="true"></i></a>'+
                '</div>'+
                '</div>'+
                '<div class="panel-body">'+
                '<p>添加面板2</p>'+
                '</div>'
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

        });

        $("#add3").on("click",function () {
            var temp = {
                id: 'panel9',   // 面板编号
                colWidth: '6',  // 栅格尺寸
                content:'<div class="panel-heading">'+
                '<i class="icon icon-list"></i>'+
                '<span class="title">添加面板3</span>'+
                '<div class="panel-actions">'+
                '<a href="void:javascript:void(0);" data-toggle="tooltip" title="添加"><i class="fa fa-plus" aria-hidden="true"></i></a>'+
                '</div>'+
                '</div>'+
                '<div class="panel-body">'+
                '<p>添加面板3</p>'+
                '</div>'
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

        });

        $("#add4").on("click",function () {
            var temp = {
                id: 'panel9',   // 面板编号
                colWidth: '6',  // 栅格尺寸
                content:'<div class="panel-heading">'+
                '<i class="icon icon-list"></i>'+
                '<span class="title">添加面板4</span>'+
                '<div class="panel-actions">'+
                '<a href="void:javascript:void(0);" data-toggle="tooltip" title="添加"><i class="fa fa-plus" aria-hidden="true"></i></a>'+
                '</div>'+
                '</div>'+
                '<div class="panel-body">'+
                '<p>添加面板4</p>'+
                '</div>'
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

        });



    });