require.config({
    shim: {
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'bootstrap-datetimepicker': {
            deps: ['bootstrap', 'jquery'],
            exports: "datetimepicker"
        },
        'bootstrap-datetimepicker.zh-CN': {
            deps: ['bootstrap-datetimepicker', 'jquery']
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "departMentService": "../../../common/js/service/DepartmentController",
        "bootstrap-datetimepicker": "../../common/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-datetimepicker.zh-CN": "../../common/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap', 'bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'topBar', 'departMentService'],
    function (jquery, common, frame, bootstrapTable, bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, topBar, departMentService) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../common/libs/layer/'
        });
        //将部门信息封装成树节点
        var deptTree = {};
        deptTree.isNodeSelected = false;
        deptTree.nodeSelected;
        deptTree.getTreeList = function () {
            var tree = [];
            var temp = {};
            departMentService.listAll(function (data) {
                if (data.result) {
                    //清空下拉框中的选项
                    $('select[name="parentDept"]>option[value="-1"]').siblings().remove();
                    //将节点封装成树形结构
                    for (var i = 0; i < data.data.length; i++) {
                        //向下拉框中添加
                        $('select[name="parentDept"]').append('<option value="' +data.data[i].id+ '">' +
                            data.data[i].name
                            + '</option>')
                        temp[data.data[i].id] = {
                            id: data.data[i].id,
                            text: data.data[i].name,
                            pId: data.data[i].parentId,
                            remark: data.data[i].remark
                        };
                    }
                    for (i = 0; i < data.data.length; i++) {
                        var key = temp[data.data[i].parentId];
                        if (key) {
                            if (key.nodes == null) {
                                key.nodes = [];
                                key.nodes.push(temp[data.data[i].id]);
                            } else {
                                key.nodes.push(temp[data.data[i].id]);
                            }
                        } else {
                            tree.push(temp[data.data[i].id]);
                        }
                    }
                }
            })
            return tree;
        }
        console.log(deptTree.getTreeList())
        deptTree.init = function () {
            //滚动条
            $('#departmentTree').treeview({
                showBorder: false,
                nodeIcon: 'glyphicon glyphicon-user',
                data: deptTree.getTreeList(),
                onhoverColor: 'lightgrey',
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeSelected: function (event, data) {
                    deptTree.isNodeSelected = true;
                    deptTree.nodeSelected = data;
                },
                onNodeUnselected: function (event, data) {
                    deptTree.isNodeSelected = false;
                    deptTree.nodeSelected = null;
                }
            })
        }
        deptTree.init();
        //添加部门
        //部门验证
        var deptValida={};
        deptValida.addValida=function(){
            $('#addDeptForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    deptName: {
                        validators: {
                            notEmpty: {
                                message: '部门名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        $('#addDept').click(function () {
            //启用验证
            deptValida.addValida();
            layer.open({
                type: 1,
                title: '添加部门',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('.add_dept')
            })
            $('#addDeptForm').on('success.form.bv', function () {
                var dept = {};
                dept.name = $("input[name='deptName']").val();
                dept.parentId = $("select[name='parentDept']").val();
                dept.remark = $("textarea[name='deptRemark']").val();
                departMentService.addDepartment(dept, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        //清空表单
                        $("input[name='res']").click();
                        //清空验证
                        $("#addDeptForm").data('bootstrapValidator').destroy();
                        //初始化
                        deptTree.getTreeList();
                        deptTree.init();
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false
            })
        })
        //修改部门
        $('#editDept').click(function () {
            if (!deptTree.isNodeSelected) {
                layer.msg('请选择要修改的部门')
            } else {
                $('input[name="editDeptId"]').val(deptTree.nodeSelected.id);
                console.log(deptTree.nodeSelected)
                $('select[name="parentDept"]').val(deptTree.nodeSelected.pId);
                $('input[name="eidtDeptName"]').val(deptTree.nodeSelected.text);
                $('textarea[name="eidtDeptRemark"]').val(deptTree.nodeSelected.remark);
                layer.open({
                    type: 1,
                    title: '修改部门',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#edit_dept')
                })
            }
            //修改部门表单提交
            $('#editDeptForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    eidtDeptName: {
                        validators: {
                            notEmpty: {
                                message: '部门名称不能为空'
                            }
                        }
                    }
                }
            }).on('success.form.bv', function () {
                var dept = {};
                dept.id = $('input[name="editDeptId"]').val();
                dept.name = $('input[name="eidtDeptName"]').val();
                dept.parentId = $("select[name='parentDept']").val();
                dept.remark = $('textarea[name="eidtDeptRemark"]').val();
                console.log(dept.parentId)
                console.log(dept.id)
                /*if(dept.parentId==dept.id){
                    layer.msg('上级部门不能为要修改的部门')
                }else{
                    departMentService.updateDep(dept.id, dept, function (data) {
                        if (data.result) {
                            layer.closeAll();
                            deptTree.getTreeList();
                            deptTree.init();
                        }
                    })
                }*/
                return false;
            })
        })
        //删除部门
        $('#delDept').click(function () {
            if(!deptTree.isNodeSelected){
                layer.msg('请选择要删除的部门')
            }else{
                if(deptTree.nodeSelected){
                    layer.confirm('确定删除部门 ' + deptTree.nodeSelected.text + ' ?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        //删除操作
                        departMentService.deleteBydepId(deptTree.nodeSelected.id,function (data) {
                            if(data.result){
                                deptTree.getTreeList();
                                deptTree.init();
                                layer.closeAll();
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }
            }
        })
        //添加人员弹窗
        $('#addPerson').click(function () {
            layer.open({
                type: 1,
                title: '添加人员',
                offset: '100px',
                area: '650px',
                resize: false,
                zIndex: 1000,
                content: $('.add_person')
            })
        })
        //日历控件
        $('.form_datetime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            pickerPosition: 'bottom-left'
        });
        //点击下一步
        $('.btn-next').click(function () {
            $('#per_tab a:last').tab('show')
        })
        //点击取消
        $('.btn-cancel').click(function () {
            layer.closeAll();
        })
        //人员表格
        $('#person_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: '序号',
                align: "center"
            }, {
                field: 'name',
                title: '姓名',
                align: "center"
            }, {
                field: 'gender',
                title: '性别',
                align: "center"
            }, {
                field: 'perImg',
                title: '图像',
                align: "center"
            }, {
                field: 'dept',
                title: '所属部门',
                align: "center"
            }, {
                field: 'cardType',
                title: '证件类型',
                align: "center"
            }, {
                field: 'cardNo',
                title: '证件号',
                align: "center"
            }, {
                field: 'birdate',
                title: '出生日期',
                align: "center"
            }, {
                field: 'education',
                title: '学历',
                align: "center"
            }, {
                field: 'phone',
                title: '联系电话',
                align: "center"
            }, {
                field: 'address',
                title: '联系地址',
                align: "center"
            }, {
                field: 'email',
                title: '邮箱',
                align: "center"
            }, {
                field: 'indate',
                title: '到职日期',
                align: "center"
            }, {
                field: 'outdate',
                title: '离职日期',
                align: "center"
            }, {
                field: 'remark',
                title: '备注',
                align: "center"
            }, {
                title: '操作',
                align: "center",
                events: {
                    "click #edit_role": function (e, value, row, index) {
                        //点击编辑按钮

                    },
                    "click #del_role": function (e, value, row, index) {
                        //点击删除按钮
                        layer.confirm('确定删除 ' + row.uname + ' ?', {
                            btn: ['确定', '取消'] //按钮
                        }, function () {
                            //删除操作

                        }, function () {
                            layer.closeAll();
                        });
                    }
                },
                formatter: function () {
                    var icons = "<button type='button' id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                        "<button type='button' id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>"
                    return icons;
                }
            }],
            data: [{
                id: 1,
                name: '张三',
                gender: '男',
                perImg: '<img src="../img/pimg.jpg" width="30px" height="30px">',
                dept: '研发中心',
                cardType: "身份证",
                cardNo: "11111111111",
                birdate: '1999-1-1',
                education: '本科',
                phone: '',
                address: '',
                email: '',
                indate: '',
                outdate: '',
                remark: ''
            }]
        })
        //迁移人员
        $('#movePerson').click(function () {
            var selecte = $('#person_table').bootstrapTable('getSelections');
            if (selecte.length == 0) {
                layer.msg("请选择要迁移的人员");
            } else {
                layer.open({
                    type: 1,
                    title: '迁移人员',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('.changeDept')
                })
            }
        })
    })