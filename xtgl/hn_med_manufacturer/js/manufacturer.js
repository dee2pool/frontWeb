var manufacturerController=DeviceManufacturerController();
$(function () {
    var tableObj=new manufacturerTable("manufacturer_table");
    tableObj.init();
})
var manufacturerTable=function (tableId) {
    var tableInit=new Object();
    tableInit.init=function () {
        manufacturerController.getManuList(tableId);
    }
    return tableInit;
}