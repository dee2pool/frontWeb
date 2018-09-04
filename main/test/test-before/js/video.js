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
    },

    paths:{
        "jquery":"../../../common/lib/jquery/jquery-3.3.1.min",
        "jqueryui":"../../../common/lib/jquery/lib/jqueryui/jquery-ui.min",
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap",
        "sui":"../../../common/lib/bootstrap/libs/sui/js/sui.nav.min",
        "common":"../../../common/js/common",
        "lobiPanel":"../../../common/lib/lobipanel/js/lobipanel",
    }
});
require(['jquery','jqueryui','bootstrap','sui','common','lobiPanel'],function ($,jqueryui,bootstrap,sui,common,lobiPanel) {

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
        //必须放在$(function{})内部来执行
        // $('.panel').lobiPanel({
        //  });


    });

    $( "#draggable" ).draggable({
        connectToSortable: "#widgets",
        helper: "clone",
        revert: "invalid"
    });

    $("#widgets").sortable({
        handle: ".panel-heading",
        cursor: "move",
        opacity: 0.5,
        revert: true,
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