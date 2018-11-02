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
        "dictService": "../../../common/js/service/DictController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'topBar', 'dictService', 'ztree'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrapTableZhcN, bootstrap, topBar, dictService, ztree) {
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
        /********************************* 字典树 ***************************************/
        var dictTree = {};
        dictTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "dictCode",
                    pIdKey: "dictParentCode",
                },
                key: {
                    name: "dictName"
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    dictTree.selected = treeNode;
                    dictTable.init(treeNode.dictCode);
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    dictTree.obj.removeChildNodes(treeNode);
                    dictService.getChildList(treeNode.dictCode, function (data) {
                        if (data.result) {
                            if (data.result) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/dict.png";
                                }
                                var newNodes = data.data;
                                //添加节点
                                dictTree.obj.addNodes(treeNode, newNodes);
                            }
                        }
                    })
                }
            }
        };
        dictTree.zNode = function () {
            var treeNode;
            dictService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/dict.png";
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        dictTree.init = function () {
            dictTree.obj = $.fn.zTree.init($("#dictTree"), dictTree.setting, dictTree.zNode());
        }
        dictTree.addNode=function(newNode){
            if (dictTree.obj) {
                //获取当前选中的节点
                var selected = dictTree.obj.getSelectedNodes();
                if (selected.length > 0&&selected[0].open) {
                    //在节点下添加节点
                    dictTree.obj.addNodes(selected[0],newNode);
                }
            }
        }
        dictTree.altNode=function(newNode){
            if (dictTree.obj) {
                var node = dictTree.obj.getNodeByParam('id',newNode.id);
                if (node) {
                    node.dictName = newNode.dictName;
                    node.remark = newNode.remark;
                    dictTree.obj.updateNode(node);
                }
            }
        }
        dictTree.delNode=function(id){
            var node=dictTree.obj.getNodeByParam('id',id,null);
            if(node){
                dictTree.obj.removeNode(node);
            }
        }
        dictTree.init();
        /********************************* 添加字典 ***************************************/
        var dictAdd = {};
        dictAdd.valia = function () {
            $('#addDictForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    dictName: {
                        validators: {
                            notEmpty: {
                                message: '字典名称不能为空'
                            }
                        }
                    }, dictNo: {
                        validators: {
                            notEmpty: {
                                message: '字典编号不能为空'
                            }
                        }
                    }
                }
            })
        }
        dictAdd.submit = function (layerId) {
            $('#addDictForm').on('success.form.bv', function () {
                var dict = {};
                dict.dictName = $('input[name="dictName"]').val();
                dict.dictCode = $('input[name="dictNo"]').val();
                dict.dictParentCode = $('input[name="parentCode"]').val();
                dict.remark = $('textarea[name="remark"]').val();
                dictService.addDict(dict, function (data) {
                    if (data.result) {
                        dict.id=data.data;
                        dict.icon="../img/dict.png";
                        //向树中添加
                        dictTree.addNode(dict);
                        //向表格中添加
                        $('#dict_table').bootstrapTable('append',dict);
                        //清空表单和验证
                        common.clearForm('addDictForm');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('添加成功')
                    } else {
                        layer.msg(data.description)
                    }
                })
                return false;
            })
        }
        dictAdd.init = function () {
            $('#addDict').click(function () {
                if (dictTree.selected) {
                    $('input[name="parentName"]').val(dictTree.selected.dictName);
                    $('input[name="parentCode"]').val(dictTree.selected.dictCode);
                }
                //表单验证
                dictAdd.valia();
                layer.open({
                    type: 1,
                    title: '添加字典',
                    offset: '100px',
                    skin: 'layui-layer-lan',
                    area: '600px',
                    resize: false,
                    content: $('#add_Dict')
                })
                //表单提交
                dictAdd.submit();
            })
        }
        dictAdd.init();
        /********************************* 修改字典 ***************************************/
        var dictEdit = {};
        dictEdit.index = null;
        dictEdit.valia = function () {
            $('#editDictForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editDictName: {
                        validators: {
                            notEmpty: {
                                message: '字典名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        dictEdit.submit = function (row, index) {
            $('#editDictForm').on('success.form.bv',function () {
                var dict = {};
                dict.dictName = $('input[name="editDictName"]').val();
                dict.dictCode = $('input[name="editDictNo"]').val();
                dict.remark = $('textarea[name="editRemark"]').val();
                dict.parentCode = $('input[name="parentCode"]').val();
                dict.id = row.id;
                dictService.updateDict(dict, row.id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#dict_table').bootstrapTable('updateRow', {index: index, row: dict});
                        //更新树
                        dictTree.altNode(dict);
                        //清空弹窗和验证
                        common.clearForm('editDictForm');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改成功');
                    } else {
                        //清空弹窗和验证
                        common.clearForm('editDictForm');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg(data.description);

                    }
                })
                return false;
            })
        }
        dictEdit.init = function (row, index) {
            //表单验证
            dictEdit.valia();
            //表单数据填充
            $('input[name="editDictName"]').val(row.dictName);
            $('input[name="editDictNo"]').val(row.dictCode);
            $('textarea[name="editRemark"]').val(row.remark);
            $('input[name="parentCode"]').val(row.dictParentCode);
            layer.open({
                type: 1,
                title: '修改字典',
                offset: '100px',
                skin: 'layui-layer-lan',
                area: '600px',
                resize: false,
                content: $('#edit_Dict')
            })
            dictEdit.submit(row, index);
        }
        /********************************* 删除字典 ***************************************/
        var dictDel = {};
        dictDel.init = function (row) {
            layer.confirm('确定删除?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                dictService.deleteDictByIds(row.id, function (data) {
                    if (data.result) {
                        layer.msg('删除成功');
                        //从表格中删除
                        $('#dict_table').bootstrapTable('remove',{field: 'id', values: [row.id]});
                        //从树中删除
                        dictTree.delNode(row.id);
                    } else {
                        layer.msg(data.description)
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 字典表格 ***************************************/
        var dictTable = {};
        $('#dict_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                visible: false
            }, {
                field: 'dictCode',
                title: '字典编号',
                align: 'center'
            }, {
                field: 'dictName',
                title: '字典名称',
                align: 'center'
            }, {
                field: 'dictParentCode',
                title: '上级字典编号',
                align: 'center'
            }, {
                field: 'remark',
                title: '描述信息',
                align: 'center'
            }, {
                title: '操作',
                align: "center",
                events: {
                    "click #edit": function (e, value, row, index) {
                        dictEdit.init(row, index);
                    },
                    "click #del": function (e, value, row, index) {
                        dictDel.init(row)
                    }
                },
                formatter: function () {
                    var icons = "<div class='button-group'><button id='edit' type='button' class='button button-tiny button-highlight'>" +
                        "<i class='fa fa-edit'></i>修改</button>" +
                        "<button id='del' type='button' class='button button-tiny button-caution'><i class='fa fa-remove'></i>刪除</button>" +
                        "</div>"
                    return icons;
                }
            }]
        })
        dictTable.init = function (dictCode) {
            dictService.getChildList(dictCode, function (data) {
                if (data.result) {
                    $('#dict_table').bootstrapTable('load', data.data);
                } else {
                    layer.msg(data.description);
                }
            })
        }
    })