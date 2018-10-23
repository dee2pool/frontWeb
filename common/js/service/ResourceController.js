function ResourceController(){
    var service=new Object();
    service.url=host+"/event-linkage"+"/resource";
    /**
      *分页查询资源基础信息 
      *@param pageNo  页号 
      *@param pageSize  页大小 
      *@param resName  资源名称 
      *@param resTypeCode  资源类型代码 
      */
     service.getResources=function(pageNo,pageSize,resName,resTypeCode,onSuccess){
	     var pageNoStr=pageNo;
	     var pageSizeStr=pageSize;
	     var resNameStr=resName;
	     var resTypeCodeStr=resTypeCode;
		 var requestUrl=this.url+"/list";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   pageNo:pageNoStr,
                   pageSize:pageSizeStr,
                   resName:resNameStr,
                   resTypeCode:resTypeCodeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *根据上级资源类型代码,查询子资源类型列表 
      *@param parentTypeCode  上级资源类型代码,最上级的资源类型代码,传入"resType" 
      */
     service.getSubResourceTypes=function(parentTypeCode,onSuccess){
	     var parentTypeCodeStr=parentTypeCode;
		 var requestUrl=this.url+"/type/list";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   parentTypeCode:parentTypeCodeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return service;
}
