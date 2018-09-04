function DeviceModelController(){
    var service=new Object();
    service.url=host+"/mgc"+"/deviceModelService";
    /**
      *添加设备型号 
      *@param deviceModel  设备型号信息 
      *@param deviceManuId  设备厂商ID 
      */
     service.addDeviceModel=function(deviceModel,deviceManuId,onSuccess){
	     var deviceModelStr=JSON.stringify(deviceModel);
	     var deviceManuIdStr=deviceManuId;
		 var requestUrl=this.url+"/addDeviceModel";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deviceModel:deviceModelStr,
                   deviceManuId:deviceManuIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改设备型号信息 
      *@param deviceModel deviceModel 
      */
     service.updateDeviceModel=function(deviceModel,onSuccess){
	     var deviceModelStr=JSON.stringify(deviceModel);
		 var requestUrl=this.url+"/updateDeviceModel";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deviceModel:deviceModelStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除设备型号 
      *@param ids  设备型号集 
      */
     service.deleteDeviceModel=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/deleteDeviceModel";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   ids:idsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断型号名称是否存在 
      *@param modelName modelName 
      */
     service.existModelName=function(modelName,onSuccess){
	     var modelNameStr=modelName;
		 var requestUrl=this.url+"/existModelName";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   modelName:modelNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      * 
      *@param page page 
      */
     service.getModelList=function(tableId){
		 var requestUrl=this.url+"/getModelList";
		 common.loadTableData(requestUrl,tableId,function (params) {
             var page=JSON.stringify({"pageNumber":params.offset/params.limit+1,"pageSize":params.limit,"parameters":{}});
             var temp={
                 page:page
             };
             return temp;
         })
    };
           
    /**
      *导出模版 
      */
     service.downloadExcelTemplate=function(onSuccess){
		 var requestUrl=this.url+"/downloadExcelTemplate";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *导入数据 
      *@param file file 
      */
     service.importExcel=function(file,onSuccess){
	     var fileStr=JSON.stringify(file);
		 var requestUrl=this.url+"/importExcel";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   file:fileStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return service;
}
