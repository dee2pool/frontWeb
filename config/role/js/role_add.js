define(['bootstrapValidator','RoleService'], function (bootstrapValidator,RoleService) {
    var roleAdd = {};
    //添加角色弹窗
    function openWin() {
        $('#addRole').click(function () {
            layer.open({
                type: 1,
                area: '380px',
                offset: '100px',
                scrollbar: false,
                title: '添加角色',
                content: $('#add_role')
            })
        })
    }
    //表单验证
    function validator() {
        $('#add_role').bootstrapValidator({
            //container: 'tooltip',
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
                    sub_data.inbuiltFlag=0;
                    sub_data.permit=1;
                    $('#role_table').bootstrapTable('append',sub_data);
                    layer.closeAll();
                }
            })
            return false;
        })
    }
    roleAdd.init = function () {
        openWin();
        validator();
        formSubmit();
    }
    return roleAdd;
})