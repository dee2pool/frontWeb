function DeviceTypeController(){
    var service=new Object();
    service.url=host/*+"/mgc"*/+"/deviceType";
    /**
      *no comment for this interface
      *@param page no comment
      */
    service.getTypeList=function(tableId){
        var temp=this.url+"/getTypeList";
        common.loadTableData(temp,tableId,function (params) {
            var page=JSON.stringify({"pageNumber":params.offset/params.limit+1,"pageSize":params.limit,"parameters":{}});
            var temp={
                page:page
            };
            return temp;
        })
    };

    service.getTypeTreeList=function(page,onSuccess){
        var pageStr=JSON.stringify(page);
        var requestUrl=this.url+"/getTypeList";
        $.ajax({
            url:requestUrl,
            type:'GET',
            data:{
                page:pageStr,
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    /**
      *no comment for this interface
      *@param type no comment
      */
     service.addType=function(type,onSuccess){
	     var typeStr=JSON.stringify(type);
		 var requestUrl=this.url+"/addType";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   type:typeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *no comment for this interface
      *@param type no comment
      */
     service.updateType=function(type,onSuccess){
	     var typeStr=JSON.stringify(type);
		 var requestUrl=this.url+"/updateType";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   type:typeStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *no comment for this interface
      *@param ids no comment
      */
     service.deleteType=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/deleteType";
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
           
    return service;
}
