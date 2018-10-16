define(['layer'], function (layer) {
    var common = {};
    common.host = "https://192.168.0.144:8080";
    common.end = "http://192.168.0.222:8040";
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
    //初始化表格高度
    common.tableHeight = function () {
        $('.table-responsive').height($(window).height() - 220)
        $(window).resize(function () {
            $('.table-responsive').height($(window).height() - 220)
        })
    }
    //初始化分页条左侧
    common.pageLeft = function (pageNo, pageSize, count) {
        var begin = (pageNo - 1) * pageSize + 1;
        var end = pageNo * pageSize;
        if (end > count) {
            end = count;
        }
        var pageNum;
        count % pageSize == 0 ? pageNum = count / pageSize : pageNum = parseInt(count / pageSize) + 1;
        $('.pagination-info').html('当前显示 ' + begin + ' - ' + end + '条记录 共' + count + '条记录');
    }
    //初始化分页条右侧
    common.pageRight = function (pageNo, pageSize, count) {
        var pageNum;
        count % pageSize == 0 ? pageNum = count / pageSize : pageNum = parseInt(count / pageSize) + 1;
        for (var i = 0; i < pageNum - 1; i++) {
            var p = i + 2;
            var active="";
            if(p==pageNo){
                active="active"
                $('.pagination>li').removeClass('active')
            }
            $('.page-next').before('<li class="page-item '+active+'"><a class="page-link" href="#">' + p + '</a></li>')
        }
    }
    //分页组件
    common.pageInit = function (pageNo, pageSize, count) {
        common.tableHeight();
        common.pageLeft(pageNo, pageSize, count);
        common.pageRight(pageNo, pageSize, count);
    }
    //改变页面展示条数
    common.pageList = function (pageSize, initTable) {
        $('li[role="menuitem"]>a').click(function () {
            pageSize.pageSize = $(this).html();
            $('.page-size').html($(this).html());
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            initTable();
            //清除
            $('.pagination>li').each(function () {
                if ($(this).children().html() > 1) {
                    $(this).remove();
                }
            })
        })
    }
    //点击上一页
    common.prePage = function (pageSize, initTable) {
        $('.page-pre>a').click(function () {
            if (pageSize.pageNumber > 1) {
                pageSize.pageNumber--;
                initTable();
                //清除
                $('.pagination>li').each(function () {
                    if ($(this).children().html() > 1) {
                        $(this).remove();
                    }
                })
            }
        })
    }
    //点击下一页
    common.nextPage = function (pageSize, initTable) {
        $('.page-next>a').click(function () {
            var pageNum = $('.page-next').prev().children().html();
            if (pageSize.pageNumber < pageNum) {
                pageSize.pageNumber++;
                initTable();
                //清除
                $('.pagination>li').each(function () {
                    if ($(this).children().html() > 1) {
                        $(this).remove();
                    }
                })
            }
        })
    }
    //带侧边栏页面动态高度宽度
    common.height = $(window).height();
    $('.panel-right').width($(window).width() - 380)
    $('.panel-left').height($(window).height() - 95)
    //不带侧边栏页面右侧面板动态宽度
    $('.panel-opera,.panel-table').width($(window).width() - 205)
    $(window).resize(function () {
        $('.panel-right').width($(window).width() - 380)
        $('.panel-left').height($(window).height() - 95)
        $('.panel-opera,.panel-table').width($(window).width() - 205)
    })
    //点击取消
    $('.btn-cancel').click(function () {
        layer.closeAll();
        $("input[name='res']").click();
    })
    //判断是否为数字
    common.isRealNum = function (val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
    //添加后清空表单和验证
    common.clearForm = function (formId) {
        //表单清空
        $("input[name='res']").click();
        //清空验证
        $("#" + formId).data('bootstrapValidator').destroy();
    }
    //将时间戳转为日期
    common.add0 = function (m) {
        return m < 10 ? '0' + m : m
    }
    common.formatTime = function (time) {
        var time = new Date(parseInt(time));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate() + 1;
        var h = time.getHours() + 1;
        var mm = time.getMinutes() + 1;
        var s = time.getSeconds() + 1;
        return y + '-' + common.add0(m) + '-' + common.add0(d) + ' ' + common.add0(h) + ':' + common.add0(mm) + ':' + common.add0(s);
    }
    //将图片转换成canvas
    common.convertImageToCanvas = function (image) {
        //创建canvas dom元素，设置宽高与图片一样
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
    }
    //将图片转换成base64
    common.convertImageToBase64 = function (image) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var i = document.getElementById('showImg');
            i.src = event.target.result;
            i.onload = function () {
                var canvas = common.convertImageToCanvas(i);
                var base64 = canvas.toDataURL('image/jpeg');
                $('input[name="picture"]').val(base64);
            }
        }
        reader.readAsDataURL(image);
    }
    //获得bootstrap table 选中行的index
    common.getTableIndex = function (tableId) {
        var indexs = new Array();
        $('#' + tableId + ' tr[class="selected"]').each(function () {
            indexs.push($(this).data('index'));
        })
        return indexs;
    }

    return common;
})