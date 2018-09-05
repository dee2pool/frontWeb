define(['layer'],function (layer) {
    var common = {};
    common.host = "https://192.168.0.144:8080";
    common.wsHost = 'https:' == document.location.protocol ? "wss://" + document.location.host + "/web" : "ws://" + document.location.host + "/web";
    //解决跨域
    $.ajaxSetup({
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            try {
                var resp = data.responseText;
                var msg = JSON.parse(resp);
                var httpStatus = data.status;
                if (httpStatus == 403) {
                    window.parent.location.href = loginPageUrl;
                } else if (httpStatus == 404) {
                    layer.msg('网络异常，请稍后再试')
                }
            } catch (e) {
                layer.msg('网络异常，请稍后再试')
                console.log(data.responseText);
            } finally {

            }
        }
    })
    //数据表格
    common.loadTableData=function(init_page,data,tableId){
        var pageFrom=(init_page.pageNumber-1)*init_page.pageSize+1;
        var pageTo=init_page.pageNumber*init_page.pageSize;
        if(pageTo>data.extra){
            pageTo=data.extra;
        }
        var tableIdStr="#"+tableId;
        $(tableIdStr).bootstrapTable({
            data:data.data,
            pagination:true,
            sidePagination:'client'
        })
        $('.pagination-info').html("显示第 "+pageFrom+" 到第 "+pageTo+"条记录，总共 "+data.extra+"条记录");
        $('.pagination').show();
        $('.active').remove();
        var p;
        data.extra%init_page.pageSize==0?p=parseInt(data.extra/init_page.pageSize):p=parseInt(data.extra/init_page.pageSize)+1;
        for(var i=p;i>=1;i--){
            $('.page-pre').after('<li class="page-item"><a class="page-link" onclick="changePage(this)" href="#">'+i+'</a></li>')
        }
    }
    return common;
})