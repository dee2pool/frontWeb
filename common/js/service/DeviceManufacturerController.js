define(['common'],function DeviceManufacturerController(){
    var manufacturerService=new Object();
    manufacturerService.url=common.host+"/mgc"+"/deviceManufacturerService";
    /**
      *添加设备厂商 
      *@param deManufacturer  设备厂商信息 
      */
     manufacturerService.addDeviceManufacturer=function(deManufacturer,onSuccess){
	     var deManufacturerStr=JSON.stringify(deManufacturer);
		 var requestUrl=this.url+"/addDeviceManufacturer";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deManufacturer:deManufacturerStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改设备厂商 
      *@param deviceManu deviceManu 
      */
     manufacturerService.updateDeviceManufacturer=function(deviceManu,onSuccess){
	     var deviceManuStr=JSON.stringify(deviceManu);
		 var requestUrl=this.url+"/updateDeviceManufacturer";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deviceManu:deviceManuStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除设备厂商 
      *@param ids ids 
      */
     manufacturerService.deleteDeviceManufacturerByids=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/deleteDeviceManufacturerByids";
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
      *判断设备厂商名是否存在 
      *@param ManuName ManuName 
      */
     manufacturerService.existManuName=function(ManuName,onSuccess){
	     var ManuNameStr=ManuName;
		 var requestUrl=this.url+"/existManuName";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   ManuName:ManuNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *分页查询设备厂商 
      *@param page page 
      */
     manufacturerService.getManuList=function(tableId){
		 var requestUrl=this.url+"/getManuList";
		 common.loadTableData(requestUrl,tableId,function (params) {
             var page=JSON.stringify({"pageNumber":params.offset/params.limit+1,"pageSize":params.limit,"parameters":{}});
             var temp={
                 page:page
             };
             return temp;
         })
    };
           
    return manufacturerService;
})
