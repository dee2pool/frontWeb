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
        'boards':{
            deps:['jquery','zui','bootstrap'],
            export:'boards'
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
        "zui":"../../../common/lib/zui/js/zui",
        "boards":"../../../common/lib/zui/lib/board/zui.board.min",
        "dashboard":"../../../common/lib/zui/lib/dashboard/zui.dashboard"


    }
});
require(['common','jquery','bootstrap','sui','zui','boards','dashboard'],
    function (common,$,bootstrap,sui,zui,boards,dashboard) {

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

        $('#myBoards').boards({
            drop: function(e){
                $.zui.messager.show(e.element.text() + " 拖放到 " + e.target.closest('.board').find('.panel-heading').text());
            }
        });

        $('#dashboard').dashboard({draggable: true});



    });