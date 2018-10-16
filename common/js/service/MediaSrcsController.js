define(['common'],function MediaSrcsController(common){
    var MediaSrcService=new Object();
    MediaSrcService.url=common.host+"/mgc"+"/mediaSrcsService";
    /**
      *添加媒体源信息 
      *@param deviceId     设备id 
      *@param uriNum       所添加的通道号 
      *@param deviceName   设备名称 
      *@param deviceConId  通道所关联设备id 
      *@param deviceCode   设备Code 
      *@param devTypeName     该通道类型(模拟摄像机：131、网络摄像机：132) 
      */
     MediaSrcService.addMediaSrcsList=function(deviceId,uriNum,deviceName,deviceConId,deviceCode,typeCode,onSuccess){
	     var deviceIdStr=deviceId;
	     var uriNumStr=uriNum;
	     var deviceNameStr=deviceName;
	     var deviceConIdStr=deviceConId;
	     var deviceCodeStr=deviceCode;
	     var devTypeNameStr=typeCode;
		 var requestUrl=this.url+"/add";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   deviceId:deviceIdStr,
                   uriNum:uriNumStr,
                   deviceName:deviceNameStr,
                   deviceConId:deviceConIdStr,
                   deviceCode:deviceCodeStr,
                   typeCode:devTypeNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *媒体源分页查询 
      *@param page page 
      *@param srcsName no comment
      */
     MediaSrcService.getMediaSrcsList=function(page,srcsName,onSuccess){
	     var pageStr=JSON.stringify(page);
	     var srcsNameStr=srcsName;
		 var requestUrl=this.url+"/getMediaSrcsList";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   page:pageStr,
                   srcsName:srcsNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *查询通道信息 
      *@param page page 
      *@param srcsName    通道名称 
      *@param deviceName  通道关联的设备名称 
      */
     MediaSrcService.getChannelDeviceList=function(page,srcsName,deviceName,onSuccess){
	     var pageStr=JSON.stringify(page);
	     var srcsNameStr=srcsName;
	     var deviceNameStr=deviceName;
		 var requestUrl=this.url+"/getList";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   page:pageStr,
                   srcsName:srcsNameStr,
                   deviceName:deviceNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改通道关联的设备 
      *@param id id 
      *@param deviceId  关联设备的ID 
      */
     MediaSrcService.updateById=function(id,deviceId,onSuccess){
	     var idStr=id;
	     var deviceIdStr=deviceId;
		 var requestUrl=this.url+"/updateById";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   id:idStr,
                   deviceId:deviceIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除媒体源信息 
      *@param ids ids 
      */
     MediaSrcService.deleteMediaSrcsByIds=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/delete";
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
           
    return MediaSrcService;
})
