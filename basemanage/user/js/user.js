//添加用户组
function addUgroup() {
    layer.open({
        type:1,
        title:'添加用户组',
        area:['700px','610px'],
        content: $('#add_ugroup')
    })
}
//添加用户
function addUser() {
    layer.open({
        type:1,
        title:'添加用户',
        area:['700px','610px'],
        content: $('#add_user')
    })
}
//添加Mac地址
var id=0;
function addMac() {
    id++;
    $('#add_mac').after('<div><input type="text" style="width: 280px;margin-bottom: 10px;margin-right: 15px;display: inline-block" class="form-control">' +
        '<a id="'+id+'" href="javascript:;" onclick="removeMac(this.id)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></a></div>')
}
//移除Mac地址
function removeMac(aid) {
    $('#'+aid).parent().remove();
}
