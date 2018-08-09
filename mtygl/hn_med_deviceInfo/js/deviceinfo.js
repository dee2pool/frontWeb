var deviceInfoService=deviceInfoService();

$(function () {
    //初始化设备表格
    var tableObj=new deviceTable("#device_table");
    tableObj.init();
})
var page0={
    pageNumber:1,
    pageSize:pageSize_init_20,
    parameters:{}
}
//初始化表格数据
function loadTableData() {
    deviceInfoService.getDeivceInfoList(page0,function (data) {
        common.loadTableData(data,"device_table")
    })
}

var deviceTable=function (tableId) {
    var tableInit=new Object();
    tableInit.init=function () {

    }
    return tableInit;
}
//添加设备弹窗
function add_device() {
    layer.open({
        type:1,
        skin:'layui-layer-rim',
        area:'550px',
        scrollbar:false,
        title:'新增设备窗口',
        content:$('#add_dev_form')
    })
}