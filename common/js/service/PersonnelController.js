define(['common'],function PersonnelController(common){
    var personService=new Object();
    personService.url=common.host+"/base-data"+"";
    /**
      *添加人员信息 
      *@param ps  人员信息 
      */
     personService.addPersonnel=function(ps,onSuccess){
	     var psStr=JSON.stringify(ps);
		 var requestUrl=this.url+"/add";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   ps:psStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断人员名称是否存在 
      *@param name  人员名称 
      */
     personService.existPersonnelName=function(name,onSuccess){
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
      *根据人员ID，修改人员信息 
      *@param id  人员ID 
      *@param ps  人员信息 
      */
     personService.updatePersonnelById=function(id,ps,onSuccess){
	     var idStr=id;
	     var psStr=JSON.stringify(ps);
		 var requestUrl=this.url+"/update";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   id:idStr,
                   ps:psStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *根据人员id集合删除人员信息 
      *@param ids  人员集合 
      */
     personService.deletePersonnelByIds=function(ids,onSuccess){
		 var requestUrl=this.url+"/delete";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   ids:ids,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *分页查询人员信息 
      *@param pageNo pageNo 
      *@param pageSize pageSize 
      *@param name  人员名称 
      *@param phone  手机号码 
      *@param personnelNum  人员编号 
      *@param depName  部门名称 
      */
     personService.getPersonnerlList=function(pageNo,pageSize,name,phone,personnelNum,depName,onSuccess){
	     var pageNoStr=pageNo;
	     var pageSizeStr=pageSize;
	     var nameStr=name;
	     var phoneStr=phone;
	     var personnelNumStr=personnelNum;
	     var depNameStr=depName;
		 var requestUrl=this.url+"/list";
         $.ajax({
             url:requestUrl,
             type:'GET',
             data:{
                   pageNo:pageNoStr,
                   pageSize:pageSizeStr,
                   name:nameStr,
                   phone:phoneStr,
                   personnelNum:personnelNumStr,
                   depName:depNameStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改部门的人员信息 
      *@param depId  部门id 
      *@param personIds  人员id集合 
      */
     personService.updateDepIdByPersonnelId=function(depId,personIds,onSuccess){
	     var depIdStr=depId;
	     var personIdsStr=JSON.stringify(personIds);
		 var requestUrl=this.url+"/update/depId";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   depId:depIdStr,
                   personIds:personIdsStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return personService;
})
