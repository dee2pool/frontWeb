define(['common'],function DepartmentController(common){
    var departMentService=new Object();
    departMentService.url=common.host+"/auth"+"/department";
    /**
      *添加部门信息 
      *@param dep dep 
      */
     departMentService.addDepartment=function(dep,onSuccess){
	     var depStr=JSON.stringify(dep);
		 var requestUrl=this.url+"/add";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   dep:depStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断部门名称是否存在 
      *@param depName depName 
      */
     departMentService.existDepName=function(depName,onSuccess){
	     var depNameStr=depName;
		 var requestUrl=this.url+"/name/exist";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   depName:depNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改部门信息 
      *@param depId depId 
      *@param dep dep 
      */
     departMentService.updateDep=function(depId,dep,onSuccess){
	     var depIdStr=depId;
	     var depStr=JSON.stringify(dep);
		 var requestUrl=this.url+"/update";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   depId:depIdStr,
                   dep:depStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除部门信息 
      *@param depId depId 
      */
     departMentService.deleteBydepId=function(depId,onSuccess){
	     var depIdStr=depId;
		 var requestUrl=this.url+"/delete";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   depId:depIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
    /**
      *多条件查询部门信息 
      *@param pageNo pageNo 
      *@param pageSise pageSize 
      *@param depName depName 
      */
     departMentService.getDepList=function(pageNo,pageSize,depName,onSuccess){
	     var pageNoStr=pageNo;
	     var pageSizeStr=pageSize;
	     var depNameStr=depName;
		 var requestUrl=this.url+"/list";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   pageNo:pageNoStr,
                   pageSise:pageSizeStr,
                   depName:depNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
    /**
      *根据部门id,查询部门的子节点 
      *@param id id 
      */
     departMentService.getChidlList=function(id,onSuccess){
	     var idStr=id;
		 var requestUrl=this.url+"/"+idStr+"/chidlren";
         $.ajax({
             url:requestUrl,
             type:'GET',
             async:false,
             data:{
                   id:idStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
    /**
      *no comment for this interface
      */
     departMentService.listAll=function(onSuccess){
		 var requestUrl=this.url+"/"+"list/all";
         $.ajax({
             url:requestUrl,
             type:'GET',
             async:false,
             data:{},
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return departMentService;
})
