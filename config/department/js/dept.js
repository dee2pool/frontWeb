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
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "departMentService": "../../../common/js/service/DepartmentController"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap', 'bootstrap-treeview', 'topBar', 'departMentService'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrap, treeview, topBar, departMentService) {
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
        //部门树
        var deptTree = {};
        deptTree.getTree = function () {
            var tree = [];
            var temp = {};
            departMentService.listAll(function (data) {
                if (data.result) {
                    //将节点封装成树形结构
                    for (var i = 0; i < data.data.length; i++) {
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
        deptTree.isNodeSelected = false;
        deptTree.nodeSelected;
        deptTree.init = function () {
            //滚动条
            $('#depttree').treeview({
                showBorder: false,
                data: deptTree.getTree(),
                onhoverColor: 'lightgrey',
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeSelected: function (event, data) {
                    deptTree.isNodeSelected = true;
                    deptTree.nodeSelected = data;
                    //更新表格
                    departMentService.getChidlList(data.id, function (data) {
                        if (data.result) {
                            $('#dept_table').bootstrapTable('load', data.data);
                            //更新分页
                            common.pageInit(1, 10, data.dataSize)
                        } else {
                            layer.msg(data.description);
                        }
                    })
                },
                onNodeUnselected: function (event, data) {
                    deptTree.isNodeSelected = false;
                    deptTree.nodeSelected = null;
                }
            })
        }
        deptTree.init();
        //部门表格
        var init_page = {
            pageNumber: 1,
            pageSize: 10
        }
        departMentService.getDepList(init_page.pageNumber, init_page.pageSize, init_page.domainName, function (data) {
            if (data.result) {
                $('#dept_table').bootstrapTable({
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'name',
                        title: '部门名称',
                        align: 'center'
                    }, {
                        field: 'id',
                        title: '部门ID',
                        align: 'center'
                    }, {
                        field: 'parentId',
                        visible: false
                    }, {
                        field: 'remark',
                        title: '部门描述',
                        align: 'center'
                    }, {
                        title: '操作',
                        align: 'center',
                        events: {
                            "click #edit_role": function (e, value, row, index) {
                                $('input[name="eidtDeptName"]').val(row.name);
                                $('textarea[name="eidtDeptRemark"]').val(row.description);
                                deptValida.editValidator();
                                layer.open({
                                    type: 1,
                                    title: '修改部门',
                                    offset: '100px',
                                    area: '600px',
                                    resize: false,
                                    content: $('#edit_dept')
                                })
                                //表单提交
                                $('#editDeptForm').on('success.form.bv', function () {
                                    var dept = {};
                                    dept.id = row.id;
                                    dept.name = $('input[name="eidtDeptName"]').val();
                                    dept.description = $('textarea[name="eidtDeptRemark"]').val();
                                    dept.parentId = row.parentId
                                    departMentService.updateDep(dept.id,dept,function (data) {
                                        if (data.result) {
                                            layer.msg('更新成功')
                                            //清除校验
                                            $("#editDeptForm").data('bootstrapValidator').destroy();
                                            //更新树
                                            deptTree.getTree();
                                            deptTree.init();
                                            layer.closeAll();
                                            //更新表格
                                            $('#dept_table').bootstrapTable('updateRow',{index:index,row:domain})
                                        } else {
                                            layer.msg(data.description)
                                            $("button[type='submit']").removeAttr('disabled');
                                        }
                                    })
                                    return false;
                                })
                            },
                            "click #del_role": function (e, value, row, index) {
                                //点击删除按钮
                                layer.confirm('确定删除 ' + row.name + ' ?', {
                                    btn: ['确定', '取消'] //按钮
                                }, function () {
                                    //删除操作
                                    departMentService.deleteBydepId(row.id, function (data) {
                                        if (data.result) {
                                            layer.closeAll();
                                            //更新树
                                            deptTree.getTree();
                                            deptTree.init();
                                            //更新表格
                                            $('#dept_table').bootstrapTable('remove', {field: 'id', values: [row.id]})
                                        } else {
                                            layer.msg(data.description);
                                        }
                                    })
                                }, function () {
                                    layer.closeAll();
                                });
                            }
                        },
                        formatter: function () {
                            var icons = "<div class='btn-group-sm'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data: data.data
                })
                //初始化分页组件
                common.pageInit(init_page.pageNumber, init_page.pageSize, data.extra)
            }
        })
        var deptValida = {};
        deptValida.addValida = function () {
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
        deptValida.editValidator = function () {
            $('#editDeptForm').bootstrapValidator({
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
        //添加部门
        $('#addDept').click(function () {
            if(!deptTree.isNodeSelected){
                $('input[name="parentDept"]').val('无');
                $('input[name="parentDeptCode"]').val('-1');
            }else{
                $('input[name="parentDept"]').val(deptTree.nodeSelected.text);
                $('input[name="parentDeptCode"]').val(deptTree.nodeSelected.id);
            }
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
                dept.parentId = $('input[name="parentDeptCode"]').val();
                dept.remark = $("textarea[name='deptRemark']").val();
                departMentService.addDepartment(dept, function (data) {
                    if (data.result) {
                        layer.closeAll();
                        //清空表单
                        $("input[name='res']").click();
                        //清空验证
                        $("#addDeptForm").data('bootstrapValidator').destroy();
                        //初始化
                        deptTree.getTree();
                        deptTree.init();
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false
            })
        })
    })