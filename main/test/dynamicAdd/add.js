require.config({
    paths:{
        "jquery":"../../../common/lib/jquery/jquery-3.3.1.min"
    }
});

require(['jquery'], function ($) {
    $(document).ready(function () {

    });

    $("#add").on("click",function () {
        var div = $("#test");
        div.append("<button id='test2' onclick='tt()'>btn</button>");
    });

    $(document).on('click','#test2',function(){
        showMakeAndHold();
    });

    function showMakeAndHold() {
        alert("hello");
    }

});
