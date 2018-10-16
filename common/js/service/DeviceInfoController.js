define(['common'],function DeviceInfoController(common){
    var deviceService=new Object();
    deviceService.url=common.host+"/mgc"+"/deviceInfoService";
    /**
      *分页查询设备信息 
      *@param page page 
      *@param ip    设备ip 
      *@param name  设备名称 
      *@param orgCode  所属组织 
      */
     deviceService.getDeviceInfoList=function(page,ip,name,orgCode,onSuccess){
	     var pageStr=JSON.stringify(page);
	     var ipStr=ip;
	     var nameStr=name;
	     var orgCodeStr=orgCode;
		 var requestUrl=this.url+"/getDeivceInfoList";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   page:pageStr,
                   ip:ipStr,
                   name:nameStr,
                   orgCode:orgCodeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断设备信息名字是否存在 
      *@param deviceName deviceName 
      */
     deviceService.existInfoName=function(deviceName,onSuccess){
	     var deviceNameStr=deviceName;
		 var requestUrl=this.url+"/existInfoName";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   deviceName:deviceNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *添加设备信息 
      *@param deviceInfo  设备信息 
      *@param orgCode     组织code 
      *@param parentCode  网关code 
      *@param typeCode    类型code 
      *@param dictCode    设备大类code 
      */
     deviceService.addDeviceInfo=function(deviceInfo,orgCode,parentCode,typeCode,dictCode,onSuccess){
	     var deviceInfoStr=JSON.stringify(deviceInfo);
	     var orgCodeStr=orgCode;
	     var parentCodeStr=parentCode;
	     var typeCodeStr=typeCode;
	     var dictCodeStr=dictCode;
		 var requestUrl=this.url+"/addDeviceInfo";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deviceInfo:deviceInfoStr,
                   orgCode:orgCodeStr,
                   parentCode:parentCodeStr,
                   typeCode:typeCodeStr,
                   dictCode:dictCodeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改设备信息 
      *@param devicInfo  设备信息 
      *@param model  型号id 
      *@param manu   厂商id 
      */
     deviceService.updateDeviceInfo=function(devicInfo,model,manu,onSuccess){
	     var devicInfoStr=JSON.stringify(devicInfo);
	     var modelStr=model;
	     var manuStr=manu;
		 var requestUrl=this.url+"/updateDeviceInfo";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   devicInfo:devicInfoStr,
                   model:modelStr,
                   manu:manuStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除设备信息 
      *@param ids ids 
      */
     deviceService.deleteDeviceInfo=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/deleteDeviceInfo";
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
      *根据设备信息id查询设备信息 
      */
     deviceService.getDeviceById=function(onSuccess){
		 var requestUrl=this.url+"/getDeviceById";
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
      *根据设备类型查询设备信息 
      *@param type type 
      */
     deviceService.getDeviceInfoByType=function(type,onSuccess){
	     var typeStr=type;
		 var requestUrl=this.url+"/getDeviceInfoByType";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   type:typeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return deviceService;
})
