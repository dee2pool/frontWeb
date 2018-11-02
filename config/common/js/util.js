define(['layer'], function (layer) {
    var common = {};
    common.host = "https://192.168.0.144:8080";
    common.end = "http://192.168.0.222:8040";
    common.geoserver = "http://192.168.0.142:8060";
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
        if (count == 0) {
            $('.page-next').before('<li class="page-item active"><a class="page-link pNo" href="#">1</a></li>')
        } else {
            for (var i = 0; i < pageNum; i++) {
                var p = i + 1;
                var active = "";
                if (p == pageNo) {
                    active = "active"
                    $('.pagination>li').removeClass('active')
                }
                if (pageNum >= 8) {
                    if (pageNo <= 4 && p >= 6) {
                        $('.page-next').before('<li class="page-item page-last-separator disabled"><a class="page-link" href="#">...</a></li>' +
                            '<li class="page-item"><a class="page-link pNo" href="#">' + pageNum + '</a></li>');
                        break;
                    }
                    if(pageNo>=pageNum-3&&p<pageNum-4){
                        if(p==1){
                            $('.page-next').before('<li class="page-item"><a class="page-link pNo" href="#">1</a></li>' +
                                '<li class="page-item page-last-separator disabled"><a class="page-link" href="#">...</a></li>')
                            continue;
                        }else{
                            continue;
                        }
                    }
                    if(pageNo>4&&pageNo<pageNum-3){
                        var prePage=pageNo-1;
                        var nextPage=parseInt(pageNo)+1;
                        $('.page-next').before('<li class="page-item"><a class="page-link pNo" href="#">1</a></li>' +
                            '<li class="page-item page-last-separator disabled"><a class="page-link" href="#">...</a></li>' +
                            '<li class="page-item"><a class="page-link pNo" href="#">' + prePage + '</a></li>' +
                            '<li class="page-item active"><a class="page-link pNo" href="#">' + pageNo + '</a></li>' +
                            '<li class="page-item"><a class="page-link pNo" href="#">' + nextPage +'</a></li>' +
                            '<li class="page-item page-last-separator disabled"><a class="page-link" href="#">...</a></li>' +
                            '<li class="page-item"><a class="page-link pNo" href="#">' + pageNum + '</a></li>');
                        break;
                    }
                }
                $('.page-next').before('<li class="page-item ' + active + '"><a class="page-link pNo" href="#">' + p + '</a></li>')

            }
        }
    }
    //分页组件
    common.pageInit = function (pageNo, pageSize, count) {
        //清除之前的分页条
        common.clearPageNum();
        common.tableHeight();
        common.pageLeft(pageNo, pageSize, count);
        common.pageRight(pageNo, pageSize, count);
    }
    //改变页面展示条数
    common.pageList = function (page, initTable) {
        $('li[role="menuitem"]>a').click(function () {
            page.pageSize = $(this).html();
            $('.page-size').html($(this).html());
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            initTable();
            common.clearPageNum();
        })
    }
    //点击上一页
    common.prePage = function (page, initTable) {
        $('.page-pre>a').click(function () {
            if (page.pageNumber > 1) {
                page.pageNumber--;
                initTable();
                common.clearPageNum();
            }
        })
    }
    //点击下一页
    common.nextPage = function (page, initTable) {
        $('.page-next>a').click(function () {
            var pageNum = $('.page-next').prev().children().html();
            if (page.pageNumber < pageNum) {
                page.pageNumber++;
                initTable();
                common.clearPageNum();
            }
        })
    }
    //跳转到制定的页面
    common.toPage = function (page, initTable) {
        $('.pageAction').on('click', '.pNo', function () {
            //得到跳转的页码
            var pnum = $(this).html();
            page.pageNumber = pnum;
            initTable();
            common.clearPageNum();
        })
    }
    //清除分页条，删除所有的页码
    common.clearPageNum = function () {
        //清除
        $('.pagination>li').each(function () {
            if ($(this).children().html() > 0 || $(this).children().html() == '...') {
                $(this).remove();
            }
        })
    }
    //分页操作集合 page:有关页码和条数的对象 initTable:初始化表格的方法
    common.initPageOpera = function (page, initTable) {
        common.pageList(page, initTable);
        common.prePage(page, initTable);
        common.nextPage(page, initTable);
        common.toPage(page, initTable);
    }
    //表格高度自适应
    common.resizeTableH=function(id){
        $(window).resize(function () {
            $(id).bootstrapTable('resetView',{height:$(window).height()-135})
        })
    }
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
    common.formatDate=function(obj){
        var date = new Date(obj * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        return Y+M+D;
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