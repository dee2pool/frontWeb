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
        'jqueryui':{
            deps:['jquery'],
            export:'jqueryui'
        },
        'lobiPanel':{
            deps:['jquery','bootstrap','jqueryui'],
            export:'lobiPanel'
        },
        'echarts':{
            exports:'echarts'
        },
    },

    paths:{
        "jquery":"../../../common/lib/jquery/jquery-3.3.1.min",
        "jqueryui":"../../../common/lib/jquery/lib/jqueryui/jquery-ui.min",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap",
        "sui":"../../../common/lib/bootstrap/libs/sui/js/sui.nav.min",
        "common":"../../../common/js/common",
        "lobiPanel":"../../../common/lib/lobipanel/js/lobipanel",
        "echarts":"../../../common/lib/echarts/echarts.min",
    }
});
require(['jquery','jqueryui','bootstrap','sui','common','lobiPanel','echarts'],function ($,jqueryui,bootstrap,sui,common,lobiPanel,echarts) {

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

    //当所有dom都加载完成之后再执行
    $(function(){
    });

    $( ".col-md-12" ).draggable({
        connectToSortable: "#widgets",
        helper: "clone",
        revert: "invalid",
        stop: function (event, ui) {
            console.log(event);
            //$(this).css("width",300);
        }
    });

    $("#widgets").sortable({
        handle: ".panel-heading",
        cursor: "move",
        opacity: 0.5,
        revert: true,
        update: function(event, ui) {
            //$(this).css("width",300);
            console.log($(this));
        },
        stop : function(event, ui){
            $("#json").val(
                JSON.stringify(
                    $("#widgets").sortable(
                        'toArray',
                        {
                            attribute : 'id'
                        }
                    )
                )
            );
        }
    });



});