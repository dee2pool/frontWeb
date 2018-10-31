define(['common'],function DeviceModelController(common){
    var deviceModelService=new Object();
    deviceModelService.url=common.host+"/mgc"+"/deviceModelService";
    /**
      *添加设备型号 
      *@param deviceModel  设备型号信息 
      *@param deviceManuId  设备厂商ID 
      */
     deviceModelService.addDeviceModel=function(deviceModel,deviceManuId,onSuccess){
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
     deviceModelService.updateDeviceModel=function(deviceModel,onSuccess){
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
     deviceModelService.deleteDeviceModel=function(ids,onSuccess){
		 var requestUrl=this.url+"/deleteDeviceModel";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   ids:ids,
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
     deviceModelService.existModelName=function(modelName,onSuccess){
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
     deviceModelService.getModelList=function(page,onSuccess){
		 var requestUrl=this.url+"/getModelList";
         var pageStr=JSON.stringify(page);
         $.ajax({
             url:requestUrl,
             type:"get",
             data:{
                 page:pageStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
         })
    };
           
    /**
      *导出模版 
      */
     deviceModelService.downloadExcelTemplate=function(onSuccess){
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
     deviceModelService.importExcel=function(file,onSuccess){
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
           
    return deviceModelService;
})
