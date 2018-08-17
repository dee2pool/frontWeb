var deviceTypeController=DeviceTypeController();

$(function () {
    var tableObj=new deviceTypeTable("device_type_table");
    tableObj.init();
})
var deviceTypeTable=function (tableId) {
    var tableInit=new Object();
    tableInit.init=function () {
        deviceTypeController.getTypeList(tableId)
    }
    return tableInit;
}
