/**
 * Created by virgil on 15-9-29.
 */

//156
/*var host="http://192.168.0.156:8080/web";
var wsHost="ws://192.168.0.156:8080/web";*/
//document.domain="192.168.0.156";

//142
//var loginPageUrl="/HNFrontToEnd/login.html";
// var hostIP="192.168.0.144:8080";
// //var host=document.location.protocol+"//"+hostIP+"/web/api";
// //var wsHost='https:'==document.location.protocol?"wss://"+document.location.host+"/web":"ws://"+document.location.host+"/web";
//
// ////localhost
// var host="https://"+hostIP+"/";
// var wsHost='https:'==document.location.protocol?"wss://"+hostIP+"/web":"ws://"+hostIP+"/web";
//  wsHost="wss://"+"192.168.0.144:8087/websocket";
// /*var docUrl=host+"/doc/index.html";*/

var m={
    "tCollectTime":"T_COLLECT_TIME",
    "cCreateTime":"C_CREATE_TIME",
    "cUpdateTime":"C_UPDATE_TIME"
};
//上次弹窗发生时间
var lastAlertTime=0;
//上次弹窗内容
var lastAlertContent="";
//同样内容弹窗最少间隔
var MIN_ALERT_TIME_INTERVAL=3000;

var pageSize_init_20=20;

Array.prototype.indexOf=function(val){
    for(var i=0;i<this.length;i++){
        if(this[i]==val)return i;
    }
    return -1;
};

Array.prototype.remove=function(val){
    var index=this.indexOf(val);
    if(index==-1){

    }else{
        this.splice(index,1)

    }
};

function cleanWindowInputValue(window){
    var inputs= $(window).find("input");

    for(var i=0;i<inputs.length;i++){

        var input=inputs[i];

        var inputType=$(input).attr("type");
        console.log(inputType);

        if(inputType=="text" || inputType=="password")
        {
            $(input).val("");
        }

    }

}

function closeWindow(window){

  //  cleanWindowInputValue(window);
    window.window("close");


}
function openWindow(window){

    cleanWindowInputValue(window);
    window.window('center');
    window.window("open");


}

var common={
     pageParameter:{

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
    firstDayThisMonth:function(time){
        var firstDayThisMonth=time.substr(0,8)+"01 00:00:00";
        return firstDayThisMonth
    },
    createImageUrl:function(cameraCode,collectTime){

        var d=new Date(collectTime);

        //20_2016-01-06_17-02-59.jpg
        //var url=imageHost+"/"+cameraCode+"_";
        var url=host+"/fileService/download?fileName="+""+cameraCode+"_";
        var month= d.getMonth()+1;
        var day= d.getDate();
        var hour= d.getHours();
        var minute= d.getMinutes();
        var second= d.getSeconds();
        var timeStr= d.getFullYear()+"-"
            + (month<10?"0"+month:month)+"-"
            + (day<10?"0"+day:day)+" "
            + (hour<10?"0"+hour:hour)+"-"
            + (minute<10?"0"+minute:minute)+"-"
            + (second<10?"0"+second:second)+".jpg";
        return url+timeStr;
    },

    loadTableData:function(data,tableId){

        var tableIdStr="#"+tableId;
        if(data.result){

            var wellFormData={

                total:data.extra,
                rows:data.data

            };
            $(tableIdStr).datagrid("loadData",wellFormData);
            if($(".datagrid-mask")){
                $(".datagrid-mask").remove();
            }
            if($(".datagrid-mask-msg")){
                $(".datagrid-mask-msg").remove();
            }


        }else{
            //$(tableIdStr).datagrid("loadData",{total:0,rows:[]});
            $(tableIdStr).datagrid("loadData",[]);
            layer.confirm(data.description,{icon:-1,title:"提示",end:function(){}});

        }


    },
    loadTableData_withoutTotal:function(data,tableId){
        var tableIdStr="#"+tableId;
        if(data.result){
            var wellFormData={
                rows:data.data
            };
            $(tableIdStr).datagrid("loadData",wellFormData);
            if($(".datagrid-mask")){
                $(".datagrid-mask").remove();
            }
            if($(".datagrid-mask-msg")){
                $(".datagrid-mask-msg").remove();
            }
        }else{
            $(tableIdStr).datagrid("loadData",{total:0,rows:[]});
        }


    },
    //毫秒转换成年月日 时分秒  以"年"、“月”、“日”衔接
    dateFormatter:function(value,rec,index){

        if(value!=undefined){

            var value1=Number(value);
            var d=new Date(value1);
            var year= d.getFullYear();
            var month= d.getMonth()+1;
            var day= d.getDate();
            var hour= d.getHours();
            var minute= d.getMinutes();
            var second= d.getSeconds();
            var timeStr=year+"年"+(month<10?"0"+month:month)+"月"+(day<10?"0"+day:day)+"日 "+(hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+":"+(second<10?"0"+second:second);
            return  timeStr;


           // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //毫秒转换成年月日 时分秒  以连词符-衔接
    dateFormatter_hyphen:function(value,rec,index){

        if(value!=undefined){

            var value1=Number(value);
            var d=new Date(value1);
            var year= d.getFullYear();
            var month= d.getMonth()+1;
            var day= d.getDate();
            var hour= d.getHours();
            var minute= d.getMinutes();
            var second= d.getSeconds();
            var timeStr=year+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day)+" "+(hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+":"+(second<10?"0"+second:second);
            return  timeStr;

            // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //截止到天
    dateFormatter_hyphen_day:function(value,rec,index){

        if(value!=undefined){

            var value1=Number(value);
            var d=new Date(value1);
            var year= d.getFullYear();
            var month= d.getMonth()+1;
            var day= d.getDate();
            //var hour= d.getHours();
            //var minute= d.getMinutes();
            //var second= d.getSeconds();
            var timeStr=year+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day);
            return  timeStr;

            // return unixTimestamp.toLocaleString();
        }
        return value;
    },

    //时间只取时分秒。
    dateFormatter_hms:function(value,rec,index){
        if(value!=undefined){
            var value1=Number(value);
            var d=new Date(value1);
            var hour= d.getHours();
            var minute= d.getMinutes();
            var second= d.getSeconds();
            var timeStr=(hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+":"+(second<10?"0"+second:second);
            return  timeStr;


            // return unixTimestamp.toLocaleString();
        }
        return value;
    },
    //年月日时分秒转换成 毫秒
    dateFormatter_inverse:function(value,rec,index){
        if(value!=undefined){
            var dateTimeMilliSecond=Date.parse(value);
            if(isNaN(dateTimeMilliSecond)){
                var new_dateTimeMilliSecond=value.replace('-','/');
                new_dateTimeMilliSecond=new_dateTimeMilliSecond.replace('年','/');
                new_dateTimeMilliSecond=new_dateTimeMilliSecond.replace('月','/');
                new_dateTimeMilliSecond=new_dateTimeMilliSecond.replace('日','/');
                return (new Date(new_dateTimeMilliSecond)).getTime();

            }else{
                return dateTimeMilliSecond
            }

        }
        return value;
    },
    //去除时分秒：只保留日期（时分秒阶段为00:00:00）
    dateFormatter_noHMS:function(value,rec,index){
        var newCurrent=value.substr(0,11)+"00:00:00";
        return newCurrent
    },
    progressFormatter:function(value,row,index){
        if(value){
            var processed_value=parseFloat(parseFloat(value).toFixed(2));
        }else{
            value=0;
            //value=Math.random()*100;
            processed_value=parseFloat(parseFloat(value).toFixed(2));
        }
        var addedClass;
        if(processed_value<=80){
            addedClass="normalCapacity";
        }else if(processed_value>80){
            addedClass="criticalCapacity";
        }

        var htmlStr='<div class="easyui-progressbar'+' '+addedClass+'" data-options="value:'+processed_value+'" style="width:100%;"></div> ';

        return htmlStr;
    },
    //进度条样式转义函数：<80 采用 normalCapacity 样式类: >80 采用criticalCapacity样式类
    //而且会将数字转换为百分比
    progressFormatter_multiply100:function(value,row,index){
        if(value){
            var processed_value=parseFloat((parseFloat(value)*100).toFixed(2));
        }else{
            value=0;
            //value=Math.random()*100;
            processed_value=parseFloat((parseFloat(value)*100).toFixed(2));
        }
        var addedClass;
        if(processed_value<=80){
            addedClass="normalCapacity";
        }else if(processed_value>80){
            addedClass="criticalCapacity";
        }
        var htmlStr='<div class="easyui-progressbar'+' '+addedClass+'" data-options="value:'+processed_value+'" style="width:100%;"></div> ';
        return htmlStr;
    },
    getCurrentTime:function(){

        var obj=new Date();

        return obj.getTime();

    },
    vqdResultFormatter:function(value,rec,index){

        switch (value) {
            case 0: return "成功";
            case 1: return "设备离线";
            case 2: return "设备离线";
            case 3: return "登录设备失败";
            case 4: return "取流异常";
            case 5: return "取流异常";
            case 6: return "取流异常";
            default: return undefined;

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
    serviceWorkStatusFormatter:function(value,rec,index){
      switch(value){
          case 0: return "正常";
          case 1: return "高负荷";
          case 2: return "损坏";
          case 3: return "离线";
          case 4: return "长时间静默";
          default: return undefined;

      }
    },


    //异常原因转义函数
    alarmCause:function(value,row,index){
        cause=row.cAlarmCause;
        var str="设备不在线";
        if(cause=="0"){
            return str;
        }
    },

    //异常来源钻转义函数
    alarmSrcFormatter:function(value,rec,index){
        switch(value){
            case 1: return "视频质量诊断";
            case 2: return "录像质量诊断";
            case 3: return "设备在线";
            case 4: return "服务在线";
            default: return undefined;

        }
    },

    //工单状态转义函数
    orderStatusFormatter:function(value,rec,index){

        switch(value){
            case 0: return "已上报";
            case 1: return "已确认";
            case 2: return "已挂起";
            case 3: return "已申请延期";
            case 4: return "已反馈";
            case 5: return "已结束";
            case 6: return "已驳回";
            default: return undefined;

        }
    },
    orgCodeToOrgNameFormatter:function(value,row,index){
        var cOrgName=orgCodeToOrgName(value);
        return cOrgName
    },

    /*返回一个UserInfo对象*/
    getUserInfo:function(){

        var userInfoStr=this.getCookieByKey("userInfo");

        try{

            var userInfo=JSON.parse(userInfoStr);
            return userInfo;
        }catch (e){

            return null;
        }

        return null;


    },
    getCookieByKey:function(key){

        var strCookie=document.cookie;

       var reg=new RegExp("(^|)"+key+"=([^;]*)(;|$)");
        var value;
        if(value=document.cookie.match(reg)){

            return value[2];
        }else{

            return null;
        }

    },
    deleteCookieByKey:function(key){

        var date=new Date();
        date.setTime(date.getTime()-1000);
        document.cookie=key+"=a;expires="+date.toGMTString();
    },

    orderStrToBool:function(order){

        if(order=="asc"){

           return false;
        }else{

          return true;
        }
    },
    serverStatusFormatter:function(value,rec,index){

        switch (value){
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
    deviceStatusFormatter:function(value,rec,index){
        if(value==1){
            return "<span style='width:20px;'>在线</span>"
        }else if(value==3){
            return "<sapn>离线</sapn>"
        }else{
            return "<span>未知</span>"
        }
    },
    serverTypeFormatter:function(value,rec,index){
        //var valueType=parseInt(value.substring(10,13));
        var valueType=value;
        switch (valueType){

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
    iPtzStatusFormatter:function(value,row,index){
        var str="";
        if(value==0){
            str="<span class='Set_no'>否</span>"
        }else if(value==1){
            str="<span class='Set_yes'>是</span>"
        }else{
            str="未知"
        }
        return str
    },
    createMenuItem:function(id,text,iconCls,state,loadChild,action){

        var menuItem=
            {

                "id":id,
                "text":text,
                "iconCls":iconCls,
                "state":state,
                "attributes":{
                    loadChild:loadChild,
                    action:action
                }
            };

        return menuItem;

    },
    toLoginPage:function(msg){

        $.messager.confirm({
            title:'提示',
            msg:msg,
            fn:function(isConfirmed){

                window.parent.location.href="/web/login.html";
            }

        })

    },

    onError:function(data){

        try{

            var resp=data.responseText;

            var msg=JSON.parse(resp);
            var httpStatus=data.status;
            if(httpStatus==403){


                common.toLoginPage("你还没有登录,请重新登录");

            }else if(httpStatus==404){

                common.alert("网络异常，请稍后再试");
              //  window.parent.location.href="/web/login.html";
            }
        }catch(e){

            common.alert("网络异常，请稍后再试");
            //alert("网络异常，请稍后再试");
         //   window.parent.location.href="/web/login.html";
                console.log(data.responseText);
        }finally{

        }




    },
    alert:function(msg,title){

        var currentTime=this.getCurrentTime();
        if(lastAlertContent==msg){

            if((currentTime-lastAlertContent)<MIN_ALERT_TIME_INTERVAL){

                return ;
            }

        }
        lastAlertContent=currentTime;
        lastAlertContent=msg;
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

    }



};


$.ajaxSetup({
    //headers: {'Cookie' : document.cookie },
    //headers:{'Access-Control-Allow-Origin':'*'},
    crossDomain:true,
    xhrFields:{withCredentials:true},
    error:common.onError
});

