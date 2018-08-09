/**
 * Created by virgil on 15-9-28.
 */

function deviceInfoService(){
    var service=new Object();
    service.url=host+"/deviceInfoService";
    service.existInfoName=function(deviceName,onSuccess){
        var temp=this.url+"/existInfoName";
        //var pageStr=JSON.stringify(page);
        $.ajax({
            url:temp,
            type:"get",
            data:{

                deviceName:deviceName
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.addDeviceInfo=function(deviceInfo,model,manu,onSuccess){
        var temp=this.url+"/addDeviceInfo";
        var deviceInfoStr=JSON.stringify(deviceInfo);
        $.ajax({
            url:temp,
            type:"post",
            data:{
                deviceInfo:deviceInfoStr,
                manu:manu,
                model:model
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };


    service.updateDeviceInfo=function(deviceInfo,model,manu,onSuccess){
        var temp=this.url+"/updateDeviceInfo";
        var deviceInfoStr=JSON.stringify(deviceInfo);
        $.ajax({
            url:temp,
            type:"post",
            data:{
                devicInfo:deviceInfoStr,
                manu:manu,
                model:model
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.existModelName=function(modelName,onSuccess){
        var temp=this.url+"/existManuName";
        //var manuNameStr=JSON.stringify(ManuName);
        $.ajax({
            url:temp,
            type:"post",
            data:{

                modelName:modelName
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.deleteDeviceInfo=function(ids,onSuccess){
        var temp=this.url+"/deleteDeviceInfo";
        var idsStr=JSON.stringify(ids);
        $.ajax({
            url:temp,
            type:"post",
            data:{

                ids:idsStr
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.getDeivceInfoList=function(page,onSuccess){
        var temp=this.url+"/getDeivceInfoList";
        if(page.ip){var ip=page.ip;}else{ip=""}
        if(page.name){var name=page.name;}else{name=""}
        if(page.manu){var manu=page.manu;}else{manu=""}
        if(page.deviceTypeIndex){var deviceTypeIndex=page.deviceTypeIndex;}else{deviceTypeIndex=""}
        var pageStr=JSON.stringify(page);

        $.ajax({
            url:temp,
            type:"get",
            data:{
                page:pageStr,
                ip:ip,
                name:name,
                manu:manu,
                deviceTypeIndex:deviceTypeIndex
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.getDeviceById=function(id,onSuccess){
        var temp=this.url+"/getDeviceById";
        //var pageStr=JSON.stringify(page);
        $.ajax({
            url:temp,
            type:"get",
            data:{
                id:id
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    service.contractorExport=function(page){
        var pageStr=JSON.stringify(page);
        var temp=this.url+"/contractorExport"+"?page="+pageStr;
        window.location.href=temp;
    };

    service.exportDeviceInfoList=function(page){
        var pageStr=JSON.stringify(page);
        var temp=this.url+"/exportDeviceInfoList"+"?page="+pageStr;
        window.location.href=temp;

    };

    //导入设备信息
    service.importExcel=function(file){
        var temp=this.url+"/importExcel"+"?file="+file;
        window.location.href=temp;

    };


    service.importExcel=function(file){
        var temp=this.url+"/importExcel"+"?file="+file;
        window.location.href=temp;

    };

    service.getExcelFieldList=function(onSuccess){
        var temp=this.url+"/getExcelFieldList";

        $.ajax({
            url:temp,
            data:{

            },
            cache:false,
            type:"get",
            success:onSuccess,
            error:this.onError
        })

    };


    //设备信息 Excel 模板导出
    service.downloadExcelTemplate=function(ids){
        var temp=this.url+"/downloadExcelTemplate";
        var idsStr=JSON.stringify(ids);
        window.location.href=temp;
    };

    //媒体源 Excel 模板导出
    service.downloadSrcsExcelTemplate=function(ids){
        var temp=this.url+"/downloadSrcsExcelTemplate";
        var idsStr=JSON.stringify(ids);
        window.location.href=temp;
    };

    service.onError=common.onError;

    return service;

}