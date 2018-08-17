
var host = "http://192.168.0.123:8081/web/api";
var wsHost = 'https:' == document.location.protocol ? "wss://" + document.location.host + "/web" : "ws://" + document.location.host + "/web";
/*var docUrl=host+"/doc/index.html";*/
var m = {
    "tCollectTime": "T_COLLECT_TIME",
    "cCreateTime": "C_CREATE_TIME",
    "cUpdateTime": "C_UPDATE_TIME"
};
/*$.ajaxSetup({
    crossDomain:true,
    xhrFields:{
        withCredentials:true
    },
    error:function(data){
        try{
            var resp=data.responseText;
            var msg=JSON.parse(resp);
            var httpStatus=data.status;
            if(httpStatus==403){
                window.parent.location.href=loginPageUrl;
            }else if(httpStatus==404){
                common.alert("网络异常，请稍后再试");
            }
        }catch(e){
            common.alert("网络异常，请稍后再试");
            console.log(data.responseText);
        }finally{

        }
    }
})*/
//上次弹窗发生时间
var lastAlertTime = 0;
//上次弹窗内容
var lastAlertContent = "";
//同样内容弹窗最少间隔
var MIN_ALERT_TIME_INTERVAL = 3000;

var pageSize_init_20 = 20;


function cleanWindowInputValue(window) {
    var inputs = $(window).find("input");

    for (var i = 0; i < inputs.length; i++) {

        var input = inputs[i];

        var inputType = $(input).attr("type");
        console.log(inputType);

        if (inputType == "text" || inputType == "password") {
            $(input).val("");
        }

    }

}

function closeWindow(window) {

    //  cleanWindowInputValue(window);
    window.window("close");


}

function openWindow(window) {

    cleanWindowInputValue(window);
    window.window('center');
    window.window("open");


}

var common = {
    pageParameter: {

        pageSize: pageSize_init_20,//每页显示的记录条数，默认为5
        pageList: [5, 10, 20, 25],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
    },

    //createImageUrl:function(cameraCode,collectTime){
    //    var d=new Date(collectTime);
    //    //20_2016-01-06_17-02-59.jpg
    //    var url=imageHost+"/"+cameraCode+"_";
    //    var month= d.getMonth()+1;
    //    var day= d.getDate();
    //    var hour= d.getHours();
    //    var minute= d.getMinutes();
    //    var second= d.getSeconds();
    //    var timeStr= d.getFullYear()+"-"
    //        + (month<10?"0"+month:month)+"-"
    //        + (day<10?"0"+day:day)+"_"
    //        + (hour<10?"0"+hour:hour)+"-"
    //        + (minute<10?"0"+minute:minute)+"-"
    //        + (second<10?"0"+second:second)+".jpg";
    //    return url+timeStr;
    //},

    createImageUrl: function (cameraCode, collectTime) {

        var d = new Date(collectTime);

        //20_2016-01-06_17-02-59.jpg
        //var url=imageHost+"/"+cameraCode+"_";
        var url = host + "/fileService/download?fileName=" + "" + cameraCode + "_";
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        var timeStr = d.getFullYear() + "-"
            + (month < 10 ? "0" + month : month) + "-"
            + (day < 10 ? "0" + day : day) + " "
            + (hour < 10 ? "0" + hour : hour) + "-"
            + (minute < 10 ? "0" + minute : minute) + "-"
            + (second < 10 ? "0" + second : second) + ".jpg";
        return url + timeStr;
    },

    /*! @function
    * Copyright (c) 2018,湖南华南光电科技股份有限公司
    ********************************************************************
    【函数功能】  加载bootstrap table数据
    【参数】    url:请求地址;tableId:table ID;params:额外参数，类型为function
    【返回值】
    【开发者及日期】 技术中心 fch 2018.08.09
    ********************************************************************/
   /* loadTableData: function (url, tableId, params) {
        var tableIdStr = "#" + tableId;
        $(tableIdStr).bootstrapTable({
            url: url,
            method: 'GET',
            cache: false,
            pagination: true,//是否启用分页
            sidePagination: 'server',//分页在客户端进行还是服务器端进行
            pageNumber: 1,//初始化时加载的页数
            pageSize: 15,//每页的条数
            pageList: [15, 25],
            queryParams: params,//向服务器端传递的额外参数
            responseHandler: function (res) {//对返回数据进行格式化
                var total = res.extra;
                var rows = res.data;
                var formateData = {"total":total,"rows":rows};
                return formateData;
            }
        })
    },*/

    loadTableData:function(init_page,data,tableId){
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
    },
    //毫秒转换成年月日 时分秒  以"年"、“月”、“日”衔接
    dateFormatter: function (value, rec, index) {

        if (value != undefined) {

            var value1 = Number(value);
            var d = new Date(value1);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hour = d.getHours();
            var minute = d.getMinutes();
            var second = d.getSeconds();
            var timeStr = year + "年" + (month < 10 ? "0" + month : month) + "月" + (day < 10 ? "0" + day : day) + "日 " + (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
            return timeStr;


            // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //毫秒转换成年月日 时分秒  以连词符-衔接
    dateFormatter_hyphen: function (value, rec, index) {

        if (value != undefined) {

            var value1 = Number(value);
            var d = new Date(value1);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hour = d.getHours();
            var minute = d.getMinutes();
            var second = d.getSeconds();
            var timeStr = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " " + (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
            return timeStr;

            // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //时间只取时分秒。
    dateFormatter_hms: function (value, rec, index) {

        if (value != undefined) {

            var value1 = Number(value);
            var d = new Date(value1);
            var hour = d.getHours();
            var minute = d.getMinutes();
            var second = d.getSeconds();
            var timeStr = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
            return timeStr;


            // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //年月日时分秒转换成 毫秒
    dateFormatter_inverse: function (value, rec, index) {

        if (value != undefined) {

            var dateTimeMilliSecond = Date.parse(value);
            if (isNaN(dateTimeMilliSecond)) {
                var new_dateTimeMilliSecond = value.replace('-', '/');
                new_dateTimeMilliSecond = new_dateTimeMilliSecond.replace('年', '/');
                new_dateTimeMilliSecond = new_dateTimeMilliSecond.replace('月', '/');
                new_dateTimeMilliSecond = new_dateTimeMilliSecond.replace('日', '/');
                return (new Date(new_dateTimeMilliSecond)).getTime();

            } else {
                return dateTimeMilliSecond
            }

        }
        return value;
    },
    getCurrentTime: function () {

        var obj = new Date();

        return obj.getTime();

    },
    vqdResultFormatter: function (value, rec, index) {

        switch (value) {
            case 0:
                return "成功";
            case 1:
                return "设备离线";
            case 2:
                return "设备离线";
            case 3:
                return "登录设备失败";
            case 4:
                return "取流异常";
            case 5:
                return "取流异常";
            case 6:
                return "取流异常";
            default:
                return undefined;

            //case 0: return "成功";
            //case 1: return "创建线程失败";
            //case 2: return "设备SDK初始化异常";
            //case 3: return "登录设备失败";
            //case 4: return "预览设备视频失败";
            //case 5: return "回调视频流失败";
            //case 6: return "取流超时";
            //default: return undefined;
        }


    },
    serviceWorkStatusFormatter: function (value, rec, index) {
        switch (value) {
            case 0:
                return "正常";
            case 1:
                return "高负荷";
            case 2:
                return "损坏";
            case 3:
                return "离线";
            case 4:
                return "长时间静默";
            default:
                return undefined;

        }
    },


    //异常原因转义函数
    alarmCause: function (value, row, index) {
        cause = row.cAlarmCause;
        var str = "设备不在线";
        if (cause == "0") {
            return str;
        }
    },

    //异常来源钻转义函数
    alarmSrcFormatter: function (value, rec, index) {
        switch (value) {
            case 1:
                return "视频质量诊断";
            case 2:
                return "录像质量诊断";
            case 3:
                return "设备在线";
            case 4:
                return "服务在线";
            default:
                return undefined;

        }
    },

    //工单状态转义函数
    orderStatusFormatter: function (value, rec, index) {

        switch (value) {
            case 0:
                return "已上报";
            case 1:
                return "已确认";
            case 2:
                return "已挂起";
            case 3:
                return "已申请延期";
            case 4:
                return "已反馈";
            case 5:
                return "已结束";
            case 6:
                return "已驳回";
            default:
                return undefined;

        }
    },
    orgCodeToOrgNameFormatter: function (value, row, index) {
        var cOrgName = orgCodeToOrgName(value);
        return cOrgName
    },

    /*返回一个UserInfo对象*/
    getUserInfo: function () {

        var userInfoStr = this.getCookieByKey("userInfo");

        try {

            var userInfo = JSON.parse(userInfoStr);
            return userInfo;
        } catch (e) {

            return null;
        }

        return null;


    },
    getCookieByKey: function (key) {

        var strCookie = document.cookie;

        var reg = new RegExp("(^|)" + key + "=([^;]*)(;|$)");
        var value;
        if (value = document.cookie.match(reg)) {

            return value[2];
        } else {

            return null;
        }

    },
    deleteCookieByKey: function (key) {

        var date = new Date();
        date.setTime(date.getTime() - 1000);
        document.cookie = key + "=a;expires=" + date.toGMTString();
    },

    orderStrToBool: function (order) {

        if (order == "asc") {

            return false;
        } else {

            return true;
        }
    },
    serverStatusFormatter: function (value, rec, index) {

        switch (value) {
            case 0:
                return "正常";
            case 1:
                return "高负荷";
            case 2:
                return "损坏";
            case 3:
                return "离线";
            case 4:
                return "长时间静默";
            default :
                return "未知";
        }
    },
    serverTypeFormatter: function (value, rec, index) {
        //var valueType=parseInt(value.substring(10,13));
        var valueType = value;
        switch (valueType) {

            case 213:
                return "运维业务服务器";
            case 214:
                return "网管服务器";
            case 215:
                return "媒体接入服务器";
            case 200:
                return "中心信令控制服务器";
            case 201:
                return "Web应用服务器";
            case 202:
                return "媒体分发服务器";
            case 203:
                return "代理服务器";
            case 204:
                return "安全服务器";
            case 205:
                return "报警服务器";
            case 206:
                return "数据库服务器";
            case 207:
                return "GIS服务器";
            case 208:
                return "管理服务器";
            case 209:
                return "接入网关";
            case 210:
                return "媒体存储服务器";
            case 211:
                return "信令安全路由网关";
            case 212:
                return "视频质量诊断服务器";
            case 216:
                return "报警服务器";
            case 217:
                return "Oracle数据库服务器";
            case 218:
                return "PostgreSQL数据库服务器";
            default :
                return "未知";
        }

    },
    createMenuItem: function (id, text, iconCls, state, loadChild, action) {

        var menuItem =
            {

                "id": id,
                "text": text,
                "iconCls": iconCls,
                "state": state,
                "attributes": {
                    loadChild: loadChild,
                    action: action
                }
            };

        return menuItem;

    },
    toLoginPage: function (msg) {

        $.messager.confirm({
            title: '提示',
            msg: msg,
            fn: function (isConfirmed) {

                window.parent.location.href = "/web/login.html";
            }

        })

    },

    onError: function (data) {

        try {

            var resp = data.responseText;

            //alert(resp);

            var msg = JSON.parse(resp);
            var httpStatus = data.status;
            if (httpStatus == 403) {


                common.toLoginPage("你还没有登录,请重新登录");

            } else if (httpStatus == 404) {

                common.alert("网络异常，请稍后再试");
                //  window.parent.location.href="/web/login.html";
            }
        } catch (e) {

            common.alert("网络异常，请稍后再试");
            //alert("网络异常，请稍后再试");
            //   window.parent.location.href="/web/login.html";
            console.log(data.responseText);
        } finally {

        }


    },
    alert: function (msg, title) {

        var currentTime = this.getCurrentTime();
        if (lastAlertContent == msg) {

            if ((currentTime - lastAlertContent) < MIN_ALERT_TIME_INTERVAL) {

                return;
            }

        }
        lastAlertContent = currentTime;
        lastAlertContent = msg;
        $('#message').html(msg);
        //openWindow($('#myWindow'));
        //if($('#myModal_logout')){
        //    $('#myModal_logout').modal('show');
        //}


        //$.messager.alert({
        //
        //    title:title==undefined?"提示":title,
        //    msg:msg
        //})

    },

    loadPage: function (url, onSuccess) {

        $.ajax({
            url: url,
            type: "get",
            cache: false,
            success: onSuccess,
            error: this.OnError
        })

    },
    planTemplateTimeToBinary: function (arr) {
        if (!arr) {
            return;
        }
        var arr_binary = new Array(7);
        for (var m = 0; m < arr_binary.length; m++) {
            arr_binary[m] = "";
        }
        for (var i = 0; i < arr.length; i++) {
            //如果某一天为空值，则将其转换为48个0组成的字符串
            if (arr[i] == "") {
                for (m = 0; m < 48; m++) {
                    arr_binary[i] += "0";
                }
            }
            //若某一天不是空值，则将其作如下处理
            else {
                //先将数据重新排序

                var arr_split = arr[i].split(";");//时间段分割;
                //删除最后一个空元素
                arr_split = deleteLastNullEle(arr_split);
                arr[i] = sortArr(arr[i]);
                arr_split = arr[i];
                //arr_split=arr_split.sort();
                for (var j = 0; j < arr_split.length; j++) {
                    var arr_split_ = arr_split[j].split(",");//每个时间段，起始、结束分割
                    //arr_split_=deleteLastNullEle(arr_split_);
                    var arr_split_start = parseInt(arr_split_[0]);
                    var arr_split_end = parseInt(arr_split_[1]);

                    //获取当前时间段的下一个时间段起始时间
                    var arr_next_split_;
                    var arr_next_split_start;
                    if ((j + 1) < arr_split.length) {
                        arr_next_split_ = arr_split[j + 1].split(",");
                        arr_next_split_start = parseInt(arr_next_split_[0]);//每个时间段，起始、结束分割
                    } else {
                        arr_next_split_start = false
                    }

                    //if(arr_split.length==1){
                    //    arr_next_split_start=false
                    //}


                    var intervalNum;
                    var zero_num;
                    //如果是第一项，则进行如下操作
                    if (j == 0) {
                        //第一项的起始时间为0
                        if (arr_split_start == 0) {
                            //获得第一段时间有多少个半小时，itervalNum
                            intervalNum = (arr_split_end + 1) / 60 / 30;
                            for (var k = 0; k < intervalNum; k++) {
                                arr_binary[i] += "1";
                            }
                            //如果下一个时间段的起点存在的话；
                            if (arr_next_split_start) {
                                //如果前一个时间段和后一个时间段中间有空时间段
                                if ((arr_split_end + 1) != arr_next_split_start) {
                                    zero_num = (arr_next_split_start - (arr_split_end + 1)) / 60 / 30;
                                    for (k = 0; k < zero_num; k++) {
                                        arr_binary[i] += "0";
                                    }
                                }
                            }
                        }
                        //若起始时间不为0；补零
                        else {
                            intervalNum = (arr_split_start) / 60 / 30;
                            for (k = 0; k < intervalNum; k++) {
                                arr_binary[i] += "0";
                            }
                            var time_binary_interval = (arr_split_end - arr_split_start + 1) / 30 / 60;
                            for (k = 0; k < time_binary_interval; k++) {
                                arr_binary[i] += "1";
                            }
                            //如果有下一个时间段
                            if (arr_next_split_start) {
                                if ((arr_split_end + 1) != arr_next_split_start) {
                                    zero_num = (arr_next_split_start - (arr_split_end + 1)) / 60 / 30;
                                    for (k = 0; k < zero_num; k++) {
                                        arr_binary[i] += "0";
                                    }
                                }
                            }
                            //如果是最后一个时间段，
                            // 则将其结束时间和86400比较。看需要补多少个0
                            else {
                                intervalNum = (86400 - (arr_split_end + 1)) / 60 / 30;
                                for (k = 0; k < intervalNum; k++) {
                                    arr_binary[i] += "0";
                                }
                            }
                        }

                    }
                    //如果不是第一项，则进行下面的操作
                    else {
                        //首位时间段半小时个数
                        time_binary_interval = ((arr_split_end + 1) - arr_split_start) / 30 / 60;
                        for (k = 0; k < time_binary_interval; k++) {
                            arr_binary[i] += "1";
                        }
                        //若有下个时间段
                        if (arr_next_split_start) {
                            //如果前一个时间段和后一个时间段中间有空时间段
                            if ((arr_split_end + 1) != arr_next_split_start) {
                                zero_num = (arr_next_split_start - (arr_split_end + 1)) / 60 / 30;
                                for (k = 0; k < zero_num; k++) {
                                    arr_binary[i] += "0";
                                }
                            }
                        }
                        //若没有下个时间段，则和24:00:00比较看还有几个半小时
                        else {
                            intervalNum = (86400 - (arr_split_end + 1)) / 60 / 30;
                            for (k = 0; k < intervalNum; k++) {
                                arr_binary[i] += "0";
                            }
                        }


                    }
                }
            }
        }

        //删除数组中最后一项为空值的元素
        function deleteLastNullEle(arr) {
            var arr_new = new Array();
            if (arr.length > 1) {
                if (arr[arr.length - 1] == "") {
                    for (var q = 0; q < arr.length - 1; q++) {
                        arr_new[q] = arr[q]
                    }
                }
                return arr_new
            } else {
                return arr
            }

        }

        function sortArr(numArry) {
            var arrStorage = numArry;
            var newArray = [];
            var startTime = [];
            var newStartTime = [];
            //var order=[];
            var items = arrStorage.split(";");//时间段分割
            items = deleteLastNullEle(items);
            for (var m = 0; m < items.length; m++) {
                //每个时间段，起始、结束分割
                var timeIntevalSplit = items[m].split(",");
                startTime.push(parseInt(timeIntevalSplit[0]));
            }
            console.log(startTime);

            startTime = sortNum(startTime);

            for (var m = 0; m < items.length; m++) {
                //每个时间段，起始、结束分割
                timeIntevalSplit = items[m].split(",");
                newStartTime.push(parseInt(timeIntevalSplit[0]));
            }

            var order = [];
            for (m = 0; m < newStartTime.length; m++) {
                for (var n = 0; n < newStartTime.length; n++) {
                    var num = -1;
                    if (newStartTime[m] == startTime[n]) {
                        num = n;
                        break
                    } else {
                        num = -1;
                    }
                }
                if (num != -1) {
                    order.push(num);
                }
            }

            for (m = 0; m < items.length; m++) {
                var testNum;
                for (n = 0; n < order.length; n++) {
                    if (m == order[n]) {
                        testNum = n;
                        break
                    }
                }
                newArray[m] = items[testNum]
            }

            return newArray;

        }


        function sortNum(array) {
            return array.sort(sequence);
        }

        function sequence(a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        }

        return arr_binary
    },
    loadingModalCreate: function () {
        $("body").append("<!-- loading -->" +
            "<div class='modal fade' id='loading' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' data-backdrop='static'>" +
            "<div class='modal-dialog' role='document'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<h4 class='modal-title' id='myModalLabel'>提示</h4>" +
            "</div>" +
            "<div id='loadingText' class='modal-body'>" +
            "<span class='glyphicon glyphicon-refresh' aria-hidden='true'>1</span>" +
            "处理中，请稍候。。。" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>"
        );
    },
    bootstrapTableLoadingShow: function (tableId) {
        $(tableId).bootstrapTable('showLoading')
    },
    bootstrapTableLoadingHide: function (tableId) {
        //$("#loading").modal("hide");
        $(tableId).bootstrapTable('hideLoading')
    },
    datagridLoading: function (tableId) {
        $(tableId).datagrid('loading')
    },
    datagridLoaded: function (tableId) {
        $(tableId).datagrid('loaded')
    },


    //判断输入框是否符合验证规范
    checkInvalid: function (inputs) {
        var invalid_results = new Array();
        for (var i = 0; i < inputs.length; i++) {
            invalid_results[i] = common.textboxCheckInvalid(inputs[i])
        }
        var valid = true;
        for (var i = 0; i < invalid_results.length; i++) {
            if (invalid_results[i] == true) {
                valid = false;
                break
            }
        }
        return valid;
    },
    textboxCheckInvalid: function (input) {
        var invalidStr = "invalid";
        var className = input.siblings()[0].className;
        var result = common.isContains(className, invalidStr);
        return result;
    },
    isContains: function (str, subStr) {
        return str.indexOf(subStr) >= 0;
    },
    validateForm: function (ElementId, flag) {
        flag = true;
        var inputs = $(ElementId).find("input");//设置提交的数据不能为空///此段程序可以封装
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var idStr = $(input).attr("id");
            var val = $(input).val();
            if (val == "") {
                $(input).attr("placeholder", "");
                flag = false;
                layer.confirm("录入数据不完整", {
                    icon: -1, title: "提示", end: function () {
                    }
                });
                return;
            }
        }
    }

};
