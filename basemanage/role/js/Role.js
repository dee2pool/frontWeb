var roleController=new RoleController();
$(function () {
    //初始化角色列表
})
var roleTable=function (tableId) {
    var tableInit=new Object();
    tableInit.init=function () {
        roleController.getRoleList()
    }
}