define(['common'],function UserGroupController(common){
    var ugroupService=new Object();
    ugroupService.url=common.host+"/auth"+"/userGroup";
    /**
      *添加用户组信息 
      *@param ug ug 
      */
     ugroupService.addUserGroup=function(ug,onSuccess){
	     var ugStr=JSON.stringify(ug);
		 var requestUrl=this.url+"/add";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   ug:ugStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断用户组名称是否存在 
      *@param name name 
      */
     ugroupService.existUserGroupName=function(name,onSuccess){
	     var nameStr=name;
		 var requestUrl=this.url+"/name/exist";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   name:nameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改用户组信息 
      *@param id id 
      *@param ug ug 
      */
     ugroupService.updateUserGroup=function(id,ug,onSuccess){
	     var idStr=id;
	     var ugStr=JSON.stringify(ug);
		 var requestUrl=this.url+"/update";
         $.ajax({
             url:requestUrl,
             type:'POST',
             data:{
                   id:idStr,
                   ug:ugStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除用户组信息 
      *@param ids ids 
      */
     ugroupService.deleteUserGroupByIds=function(ids,onSuccess){
	     var idsStr=JSON.stringify(ids);
		 var requestUrl=this.url+"/delete";
         $.ajax({
             url:requestUrl,
             type:'DELETE',
             data:{
                   ids:idsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *分页查询用户组信息 
      *@param pageNo pageNo 
      *@param pageSize pageSize 
      *@param name name 
      */
     ugroupService.getUserGroupList=function(pageNo,pageSize,name,onSuccess){
	     var pageNoStr=pageNo;
	     var pageSizeStr=pageSize;
	     var nameStr=name;
		 var requestUrl=this.url+"/list";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   pageNo:pageNoStr,
                   pageSize:pageSizeStr,
                   name:nameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *根据id查询该用户组的子节点 
      *@param groupId groupId 
      */
     ugroupService.getChildList=function(groupId,onSuccess){
	     var groupIdStr=groupId;
		 var requestUrl=this.url+"/"+groupIdStr+"/childList";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   groupId:groupIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *查询全部用户组信息 
      */
     ugroupService.listAllUserGroup=function(onSuccess){
		 var requestUrl=this.url+"/list/all";
         $.ajax({
             url:requestUrl,
             type:'GET',
             async:false,
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *根据id查询用户组信息 
      *@param groupId groupId 
      */
     ugroupService.getUserGroupById=function(groupId,onSuccess){
	     var groupIdStr=groupId;
		 var requestUrl=this.url+"/"+groupIdStr+"";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   groupId:groupIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *用户组权限授权 
      *@param groupId groupId 
      *@param roleIds roleIds 
      */
     ugroupService.assignRoleToUserGroup=function(groupId,roleIds,onSuccess){
	     var groupIdStr=groupId;
	     var roleIdsStr=JSON.stringify(roleIds);
		 var requestUrl=this.url+"/assign/RoleToUserGroup";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   groupId:groupIdStr,
                   roleIds:roleIdsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *重新授权用户组权限，删除之前的授权 
      *@param groupId groupId 
      *@param roleIds roleIds 
      */
     ugroupService.reassignRoleToUserGroup=function(groupId,roleIds,onSuccess){
	     var groupIdStr=groupId;
	     var roleIdsStr=JSON.stringify(roleIds);
		 var requestUrl=this.url+"/reassign/RoleToUserGroup";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   groupId:groupIdStr,
                   roleIds:roleIdsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *剥夺用户组权限 
      *@param groupId groupId 
      *@param roleIds roleIds 
      */
     ugroupService.depriveRoleToUserGroup=function(groupId,roleIds,onSuccess){
	     var groupIdStr=groupId;
	     var roleIdsStr=JSON.stringify(roleIds);
		 var requestUrl=this.url+"/deprive/RoleToUserGroup";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   groupId:groupIdStr,
                   roleIds:roleIdsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return ugroupService;
})
