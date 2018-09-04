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
        "dashboard":"../../../common/lib/zui/lib/dashboard/zui.dashboard"


    }
});
require(['common','jquery','bootstrap','sui','zui','dashboard'],
function (common,$,bootstrap,sui,zui,dashboard) {

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


    //var data = $.zui.store.get('data');
    var data = $.zui.store.get('data');


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




});