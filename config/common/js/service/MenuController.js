define(['common'],function MenuController(common){
    var MenuService=new Object();
    MenuService.url=common.host+"/auth"+"/menu";
    /**
      *添加菜单项 
      *@param menu  待添加菜单项的信息 
      */
     MenuService.addMenu=function(menu,onSuccess){
	     var menuStr=JSON.stringify(menu);
		 var requestUrl=this.url+"/add";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   menu:menuStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *修改菜单项信息 
      *@param menuId  待修改菜单项的Id 
      *@param menu  待修菜单项修改后的信息 
      */
     MenuService.updateMenuById=function(menuId,menu,onSuccess){
	     var menuIdStr=menuId;
	     var menuStr=JSON.stringify(menu);
		 var requestUrl=this.url+"/update";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   menuId:menuIdStr,
                   menu:menuStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *删除菜单项 
      *@param menuId  待删除菜单项的Id 
      */
     MenuService.deleteMenuById=function(menuId,onSuccess){
	     var menuIdStr=menuId;
		 var requestUrl=this.url+"/delete";
         $.ajax({
             url:requestUrl,
             type:'Delete',
             data:{
                   menuId:menuIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *加载子菜单项 
      *@param parentMenuId  子菜单项的父菜单Id,根菜单的父菜单Id为"-1" 
      */
     MenuService.getMenuListByParentId=function(parentMenuId,onSuccess){
	     var parentMenuIdStr=parentMenuId;
		 var requestUrl=this.url+"/"+parentMenuIdStr+"/list";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   parentMenuId:parentMenuIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *指定角色,加载子菜单项 
      *@param parentMenuId  子菜单项的父菜单Id,根菜单的父菜单Id为"-1" 
      *@param roleId  角色Id,如果角色Id为空,则默认加载当前角色的菜单项 
      */
     MenuService.getMenuListByParentIdAndRoleId=function(parentMenuId,roleId,onSuccess){
	     var parentMenuIdStr=parentMenuId;
	     var roleIdStr=roleId;
		 var requestUrl=this.url+"/role/"+parentMenuIdStr+"/list";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   parentMenuId:parentMenuIdStr,
                   roleId:roleIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *加载当前用户的子菜单项 
      *@param parentMenuId  子菜单项的父菜单Id,根菜单的父菜单Id为"-1" 
      */
     MenuService.getCurrentUserMenuListByParentId=function(parentMenuId,onSuccess){
	     var parentMenuIdStr=parentMenuId;
		 var requestUrl=this.url+"/user/"+parentMenuIdStr+"/list";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
                   parentMenuId:parentMenuIdStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return MenuService;
})
