define(['layer'], function (layer) {
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
    //初始化分页组件
    common.pageInit = function (pageNo, pageSize, count) {
        //显示分页条
        var $pagbar = $('.fixed-table-pagination');
        var begin = (pageNo - 1) * pageSize + 1;
        var end = pageNo * pageSize;
        var pageNum;
        count % pageSize == 0 ? pageNum = count / pageSize : pageNum = parseInt(count / pageSize) + 1;
        $pagbar.html('<div class="pull-left pagination-detail">' +
            '<span class="pagination-info">当前显示 ' + begin + ' - ' + end + '条记录 共' + count + '条记录</span>' +
            '<span class="page-list">' +
            '<span class="btn-group dropup">' +
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
            '<span class="page-size">10</span>' +
            '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
            '<li data-url="menuitem" class="active">' +
            '<a href="#">10</a>' +
            '</li>' +
            '<li data-url="menuitem">' +
            '<a href="#">20</a>' +
            '</li>' +
            '<li data-url="menuitem">' +
            '<a href="#">30</a>' +
            '</li>' +
            '</ul>' +
            '</span>' +
            '</span>' +
            '</div>' +
            '<div class="pull-right pagination">' +
            '<ul class="pagination">' +
            '<li class="page-item page-pre">' +
            '<a class="page-link" href="#">‹</a> ' +
            '</li>' +
            '<li class="page-item active">' +
            '<a class="page-link" href="#">1</a> ' +
            '</li>' +
            '<li class="page-item page-next">' +
            '<a class="page-link" href="#">›</a> ' +
            '</li>' +
            '</ul>' +
            '</div>');
        for (var i = 0; i < pageNum - 1; i++) {
            var p = i + 2;
            $('.page-next').before('<li class="page-item"><a class="page-link" href="#">' + p + '</a></li>')
        }
    }
    return common;
})