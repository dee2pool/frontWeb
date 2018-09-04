var deviceModeController=DeviceModelController();

$(function () {
    var tableObject=new deviceModeTable("deviceMode_table");
    tableObject.init();
})
var deviceModeTable=function (tableId) {
    var tableInit=new Object();
    tableInit.init=function () {
        deviceModeController.getModelList(tableId);
    }
    return tableInit;
}