require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
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
        'bootstrap-table-zh-CN': {
            deps: ['bootstrap-table', 'jquery'],
            exports: "bootstrapTableZhcN"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "departMentService": "../../../common/js/service/DepartmentController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table','bootstrap-table-zh-CN','bootstrap', 'topBar', 'departMentService','ztree'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable,bootstrapTableZhcN,bootstrap,topBar, departMentService,ztree) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 部门树 ***************************************/
        var deptTree={};
        deptTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                },
                key: {
                    name: "name"
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    deptTree.nodeSelected = treeNode;

                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    deptTree.obj.removeChildNodes(treeNode);
                    departMentService.getChidlList(treeNode.id, function (data) {
                        if (data.result) {
                            if (data.result) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/dept.png";
                                }
                                var newNodes = data.data;
                                //添加节点
                                deptTree.obj.addNodes(treeNode, newNodes);
                            }
                        }
                    })
                }
            }
        };
        deptTree.zNode = function () {
            var treeNode;
            departMentService.getChidlList('-1',function (data) {
                if(data.result){
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/dept.png";
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        deptTree.init = function () {
            deptTree.obj = $.fn.zTree.init($("#depttree"), deptTree.setting, deptTree.zNode());
        }
        //动态添加节点
        deptTree.addNode = function (newNode) {
            if (deptTree.obj) {
                //获取当前选中的节点
                var selected = deptTree.obj.getSelectedNodes();
                if (selected.length > 0&&selected[0].open) {
                    //在节点下添加节点
                    deptTree.obj.addNodes(selected[0], newNode);
                }
            }
        }
        deptTree.updateNode = function (newNode) {
            if (deptTree.obj) {
                var node = deptTree.obj.getNodeByParam('id',newNode.id);
                if (node) {
                    node.name = newNode.name;
                    node.remark = newNode.remark;
                    deptTree.obj.updateNode(node);
                }
            }
        }
        deptTree.delNode=function(id){
            var node=deptTree.obj.getNodeByParam('id',id,null);
            if(node){
                deptTree.obj.removeNode(node);
            }
        }
        deptTree.init();
        /********************************* 部门表格 ***************************************/
        var deptTable={};
        deptTable.init=function () {
            var queryUrl=common.host+"/auth"+"/department"+"/list";
            $('#dept_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'name',
                    title: '部门名称',
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
                        "click #edit": function (e, value, row, index) {
                            deptEdit.init(row,index);
                        },
                        "click #del": function (e, value, row, index) {
                            deptDel.init(row);
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'><button id='edit' type='button' class='button button-tiny button-highlight'>" +
                            "<i class='fa fa-edit'></i>修改</button>" +
                            "<button id='del' type='button' class='button button-tiny button-caution'><i class='fa fa-remove'></i>刪除</button>" +
                            "</div>"
                        return icons;
                    }
                }],
                url: queryUrl,
                method: 'GET',
                cache: false,
                pagination: true,
                sidePagination: 'server',
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 20, 30],
                smartDisplay: false,
                search: true,
                trimOnSearch: true,
                buttonsAlign: 'left',
                showRefresh: true,
                queryParamsType: '',
                responseHandler: function (res) {
                    var rows = res.data;
                    var total = res.extra;
                    return {
                        "rows": rows,
                        "total": total
                    }
                },
                queryParams: function (params) {
                    var temp = {
                        pageNo: params.pageNumber,
                        pageSise: params.pageSize,
                        depName:params.searchText
                    }
                    return temp
                }
            })
        }
        deptTable.init();
        //初始化表格高度
        $('#dept_table').bootstrapTable('resetView',{height:$(window).height()-135});
        //自适应表格高度
        common.resizeTableH('#dept_table');
        /********************************* 添加部门 ***************************************/
        var deptAdd={};
        deptAdd.valia=function(){
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
        deptAdd.submit=function(){
            $('#addDeptForm').on('success.form.bv', function () {
                var dept = {};
                dept.name = $("input[name='deptName']").val();
                dept.parentId = $('input[name="parentDeptCode"]').val();
                dept.remark = $("textarea[name='deptRemark']").val();
                departMentService.addDepartment(dept, function (data) {
                    if (data.result) {
                        dept.id=data.data;
                        dept.icon="../img/dept.png";
                        layer.closeAll();
                        common.clearForm('addDeptForm');
                        //更新表格
                        $('#dept_table').bootstrapTable('refresh', {silent: true});
                        //更新树
                        deptTree.addNode(dept);
                        layer.msg('添加成功');
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false
            })
        }
        deptAdd.init=function(){
            $('#addDept').click(function () {
                if (!deptTree.nodeSelected) {
                    $('input[name="parentDept"]').val('无');
                    $('input[name="parentDeptCode"]').val('-1');
                } else {
                    $('input[name="parentDept"]').val(deptTree.nodeSelected.name);
                    $('input[name="parentDeptCode"]').val(deptTree.nodeSelected.id);
                }
                deptAdd.valia();
                layer.open({
                    type: 1,
                    title: '添加部门',
                    offset: '100px',
                    skin: 'layui-layer-lan',
                    area: '600px',
                    resize: false,
                    content: $('.add_dept')
                })
                deptAdd.submit();
            })
        }
        deptAdd.init();
        /********************************* 修改部门 ***************************************/
        var deptEdit={};
        deptEdit.valia=function(){
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
            })
        }
        deptEdit.submit=function(row,index){
            //表单提交
            $('#editDeptForm').on('success.form.bv', function () {
                var dept = {};
                dept.id = row.id;
                dept.name = $('input[name="eidtDeptName"]').val();
                dept.description = $('textarea[name="eidtDeptRemark"]').val();
                dept.parentId = row.parentId
                departMentService.updateDep(dept.id,dept,function (data) {
                    if (data.result) {
                        //清除校验
                        $("#editDeptForm").data('bootstrapValidator').destroy();
                        //更新表格
                        $('#dept_table').bootstrapTable('updateRow',{index:index,row:dept});
                        //更新树
                        deptTree.updateNode(dept);
                        layer.closeAll();
                        layer.msg('更新成功');
                    } else {
                        layer.msg(data.description)
                        $("button[type='submit']").removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        deptEdit.init=function(row,index){
            $('input[name="eidtDeptName"]').val(row.name);
            $('textarea[name="eidtDeptRemark"]').val(row.description);
            deptEdit.valia();
            layer.open({
                type: 1,
                title: '修改部门',
                offset: '100px',
                skin: 'layui-layer-lan',
                area: '600px',
                resize: false,
                content: $('#edit_dept')
            })
            deptEdit.submit(row,index);
        }
        /********************************* 删除部门 ***************************************/
        var deptDel={};
        deptDel.init=function(row){
            //点击删除按钮
            layer.confirm('确定删除 ' + row.name + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                //删除操作
                departMentService.deleteBydepId(row.id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#dept_table').bootstrapTable('remove', {field: 'id', values: [row.id]})
                        layer.closeAll();
                        //更新树
                        deptTree.delNode(row.id)
                        layer.msg('刪除成功');
                    } else {
                        layer.msg(data.description);
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
    })