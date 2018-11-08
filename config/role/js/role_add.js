define(['bootstrapValidator','RoleService'], function (bootstrapValidator,RoleService) {
    var roleAdd = {};
    //添加角色弹窗
    function openWin() {
        $('#addRole').click(function () {
            layer.open({
                type: 1,
                area: '380px',
                skin: 'layui-layer-lan',
                offset: '100px',
                scrollbar: false,
                title: '添加角色',
                content: $('#add_role')
            })
            validator();
            formSubmit();
        })
    }
    //表单验证
    function validator() {
        $('#add_role').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '角色名称不能为空!'
                        }
                    }
                },
                remark: {
                    validators: {
                        notEmpty: {
                            message: '描述信息不能为空!'
                        }
                    }
                }
            }
        })
    }
    //表单提交
    function formSubmit() {
        $('#add_role').on('success.form.bv', function (e) {
            var sub_data={};
            sub_data.name=$("input[name='name']").val();
            sub_data.remark=$("input[name='remark']").val();
            RoleService.addRole(sub_data,function (data) {
                if(data.result){
                    sub_data.id=data.data;
                    sub_data.inbuiltFlag=0;
                    sub_data.permit=1;
                    layer.closeAll();
                    $('#role_table').bootstrapTable('append',sub_data);
                    //表单清空
                    common.clearForm('add_role');
                }else{
                    layer.msg(data.description);
                    $("button[type='submit']").removeAttr('disabled');
                }
            })
            return false;
        })
    }
    roleAdd.init = function () {
        openWin();
    }
    return roleAdd;
})