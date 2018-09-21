define(['bootstrapValidator', 'RoleService'], function (bootstrapValidator, RoleService) {
    var editRole = {};
    //修改角色弹窗
    editRole.openWin = function (name, remark) {
        $("input[name='name']").val(name);
        $("input[name='remark']").val(remark);
        layer.open({
            type: 1,
            area: '380px',
            offset: '100px',
            scrollbar: false,
            title: '修改角色',
            content: $('#add_role')
        })
    }
    //表单验证
    editRole.formVali = function () {
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
    editRole.formSub=function () {
        $('#add_role').on('success.form.bv',function (e) {
            
        })
    }
    return editRole;
})