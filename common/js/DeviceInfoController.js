function DeviceInfoController() {
    var service = new Object();
    service.url = host +/* "/mgc"+*/"/deviceInfoService";
    /**
     *判断设备信息名字是否存在
     *@param deviceName deviceName
     */
    service.existInfoName = function (deviceName, onSuccess) {
        var deviceNameStr = deviceName;
        var requestUrl = this.url + "/existInfoName";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                deviceName: deviceNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *添加设备信息
     *@param deviceInfo deviceInfo
     *@param model manuId
     *@param manu modelId
     */
    service.addDeviceInfo = function (deviceInfo, model, manu, onSuccess) {
        var deviceInfoStr = JSON.stringify(deviceInfo);
        var modelStr = model;
        var manuStr = manu;
        var requestUrl = this.url + "/addDeviceInfo";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                deviceInfo: deviceInfoStr,
                model: modelStr,
                manu: manuStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *修改设备信息
     *@param devicInfo deviceInfo
     *@param model no comment
     *@param manu no comment
     */
    service.updateDeviceInfo = function (devicInfo, model, manu, onSuccess) {
        var devicInfoStr = JSON.stringify(devicInfo);
        var modelStr = model;
        var manuStr = manu;
        var requestUrl = this.url + "/updateDeviceInfo";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                devicInfo: devicInfoStr,
                model: modelStr,
                manu: manuStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *删除设备信息
     *@param ids ids
     */
    service.deleteDeviceInfo = function (ids, onSuccess) {
        var idsStr = JSON.stringify(ids);
        var requestUrl = this.url + "/deleteDeviceInfo";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                ids: idsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /*//加载设备表格数据
    service.getDeviceInfoList=function(page,id){
        var temp=this.url+"/getDeivceInfoList";
        if(page.ip){var ip=page.ip;}else{ip=""}
        if(page.name){var name=page.name;}else{name=""}
        if(page.manu){var manu=page.manu;}else{manu=""}
        if(page.deviceTypeIndex){var deviceTypeIndex=page.deviceTypeIndex;}else{deviceTypeIndex=""}
        common.loadTableData(temp,id,function (params) {
            var page=JSON.stringify({"pageNumber":params.offset/params.limit+1,"pageSize":params.limit,"parameters":{}});
            var temp={
                page:page,
                ip:ip,
                name:name,
                manu:manu,
                deviceTypeIndex:deviceTypeIndex
            }
            return temp;
        })
    };*/
    /*
    * 分页查询表格信息
    * */
    service.getDeviceInfoList=function(page,onSuccess){
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
        })
    }

    /**
     *根据设备信息id查询设备信息
     */
    service.getDeviceById = function (onSuccess) {
        var requestUrl = this.url + "/getDeviceById";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据设备类型查询设备信息
     *@param type type
     */
    service.getDeviceInfoByType = function (type, onSuccess) {
        var typeStr = type;
        var requestUrl = this.url + "/getDeviceInfoByType";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                type: typeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *获取摄像机Excel导入模板数据项集合
     */
    service.getExcelFieldList = function (onSuccess) {
        var requestUrl = this.url + "/getExcelFieldList";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *导出模版
     */
    service.downloadExcelTemplate = function (onSuccess) {
        var requestUrl = this.url + "/downloadExcelTemplate";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *
     *@param page page
     */
    service.exportEncodeInfoList = function (page, onSuccess) {
        var pageStr = JSON.stringify(page);
        var requestUrl = this.url + "/exportDeviceInfoList";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                page: pageStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *导入数据
     *@param file file
     */
    service.importExcel = function (file, onSuccess) {
        var fileStr = JSON.stringify(file);
        var requestUrl = this.url + "/importExcel";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                file: fileStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    return service;
}
