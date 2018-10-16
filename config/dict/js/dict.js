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
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "dictService": "../../../common/js/service/DictController"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap', 'topBar', 'dictService'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrap, topBar, dictService) {
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
                dict.remark = $('textarea[name="remark"]').val();
                dict.showOrder = $('input[name="showOrder"]').val();
                dictService.addDict(dict, function (data) {
                    if (data.result) {
                        //向表格中添加
                        dict.id = data.data;
                        $('#dict_table').bootstrapTable('append', dict);
                        //清空表单和验证
                        common.clearForm('addDictForm');
                        layer.msg('添加成功')
                        //关闭弹窗
                        layer.close(layerId);
                    } else {
                        layer.msg(data.description)
                    }
                })
                return false;
            })
        }
        dictAdd.init = function () {
            $('#addDict').click(function () {
                //表单验证
                dictAdd.valia();
                var layerId = layer.open({
                    type: 1,
                    title: '添加字典',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_Dict')
                })
                //表单提交
                dictAdd.submit(layerId);
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
        dictEdit.submit = function (id, index, layerId) {
            $('#editDictForm').on('success.form.bv', function () {
                var dict = {};
                dict.dictName = $('input[name="editDictName"]').val();
                dict.dictCode = $('input[name="editDictNo"]').val();
                dict.remark = $('textarea[name="editRemark"]').val();
                dict.showOrder = $('input[name="editShowOrder"]').val();
                dict.id = id;
                dictService.updateDict(dict, id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#dict_table').bootstrapTable('updateRow', {index: index, row: dict});
                        //清空弹窗和验证
                        common.clearForm('editDictForm')
                        layer.msg('修改成功')
                        //关闭弹窗
                        layer.close(layerId);
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        dictEdit.init = function () {
            //表单验证
            dictEdit.valia();
            $('#editDict').click(function () {
                var selected = $('#dict_table').bootstrapTable('getSelections');
                if (selected.length == 0) {
                    layer.msg('请选择要修改的字典信息')
                } else if (selected.length > 1) {
                    layer.msg('一次只能修改一条')
                } else {
                    //表单数据填充
                    $('input[name="editDictName"]').val(selected[0].dictName);
                    $('input[name="editDictNo"]').val(selected[0].dictCode);
                    $('textarea[name="editRemark"]').val(selected[0].remark);
                    $('input[name="editShowOrder"]').val(selected[0].showOrder);
                    var layerId = layer.open({
                        type: 1,
                        title: '修改字典',
                        offset: '100px',
                        area: '600px',
                        resize: false,
                        content: $('#edit_Dict')
                    })
                    //获得选中行的index
                    var indexs = common.getTableIndex('dict_table');
                    dictEdit.submit(selected[0].id, indexs[0], layerId)
                }
            })
        }
        dictEdit.init();
        /********************************* 删除字典 ***************************************/
        var dictDel = {};
        dictDel.init = function () {
            $('#delDict').click(function () {
                //获得选择的行
                var selected = $('#dict_table').bootstrapTable('getSelections');
                if (selected.length == 0) {
                    layer.msg('请选择要删除的字典信息')
                } else {
                    layer.confirm('确定删除?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        var ids = new Array();
                        for (var i = 0; i < selected.length; i++) {
                            ids.push(selected[i].id);
                        }
                        dictService.deleteDictByIds(ids, function (data) {
                            if (data.result) {
                                layer.msg('删除成功');
                                //从表格中删除
                                $('#dict_table').bootstrapTable('remove', {
                                    field: 'id',
                                    values: ids
                                })
                            } else {
                                layer.msg(data.description)
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }
            })
        }
        dictDel.init();
        /********************************* 字典表格 ***************************************/
        var dictTable = {};
        dictTable.pageNo = 1;
        dictTable.pageSize = 10;
        dictTable.init = function () {
            dictService.getDictList(dictTable.pageNo, dictTable.pageSize, null, null, function (data) {
                if (data.result) {
                    $('#dict_table').bootstrapTable({
                        columns: [{
                            checkbox: true
                        }, {
                            field: 'id',
                            visible: false
                        }, {
                            field: 'dictName',
                            title: '字典名称',
                            align: 'center'
                        }, {
                            field: 'dictCode',
                            title: '字典编号',
                            align: 'center'
                        }, {
                            field: 'remark',
                            title: '备注',
                            align: 'center'
                        }],
                        data: data.data,
                        onClickRow: function (row, $element, field) {
                            dictDetailTable.init(row.dictCode);
                        }
                    })
                }
            })
        }
        dictTable.init();
        /********************************* 字典详情表格 ***************************************/
        $('#dictDetail_table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'dictCode',
                visible: false
            }, {
                field: 'detailValue',
                title: '字典详情名称',
                align: 'center'
            }, {
                field: 'detailCode',
                title: '字典详情编号',
                align: 'center'
            }, {
                field: 'remark',
                title: '备注',
                align: 'center'
            }]
        })
        var dictDetailTable = {};
        dictDetailTable.init = function (code) {
            dictService.DictDetailByDictCode(code, function (data) {
                if (data.result) {
                    $('#dictDetail_table').bootstrapTable('load',data.data)
                }
            })
        }
        /********************************* 添加字典详情 ***************************************/
        var dictDetailAdd = {};
        dictDetailAdd.valia = function () {
            $('#addDictDetailForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    detailValue: {
                        validators: {
                            notEmpty: {
                                message: '字典详情名称不能为空'
                            }
                        }
                    }, detailCode: {
                        validators: {
                            notEmpty: {
                                message: '字典详情编号不能为空'
                            }
                        }
                    }
                }
            })
        }
        dictDetailAdd.submit = function (layerId) {
            $('#addDictDetailForm').on('success.form.bv',function () {
                var dictDetail = {};
                dictDetail.dictCode = $('input[name="dictCode"]').val();
                dictDetail.detailValue = $('input[name="detailValue"]').val();
                dictDetail.remark = $('textarea[name="remark"]').val();
                dictDetail.detailCode = $('input[name="detailCode"]').val();
                dictService.addDictDetail(dictDetail,function (data) {
                    if (data.result) {
                        //向表格中添加
                        dictDetail.id = data.data;
                        $('#dictDetail_table').bootstrapTable('append', dictDetail);
                        //清空表单和验证
                        common.clearForm('addDictDetailForm');
                        layer.msg('添加成功')
                        //关闭弹窗
                        layer.close(layerId);
                    } else {
                        layer.msg(data.description)
                    }
                })
                return false;
            })
        }
        dictDetailAdd.init = function () {
            $('#addDictDetail').click(function () {
                var selected = $('#dict_table').bootstrapTable('getSelections');
                if (selected.length==0) {
                    layer.msg('请选择左侧字典')
                } else if(selected.length>1){
                    layer.msg('只能选择一个节点')
                } else {
                    //表单验证
                    console.log(selected)
                    dictDetailAdd.valia();
                    $('input[name="dictCode"]').val(selected[0].dictCode);
                    $('input[name="dictName"]').val(selected[0].dictName);
                    var layerId = layer.open({
                        type: 1,
                        title: '添加字典详情',
                        offset: '100px',
                        area: '600px',
                        resize: false,
                        content: $('#add_DictDetail')
                    })
                    //表单提交
                    dictDetailAdd.submit(layerId);
                }
            })
        }
        dictDetailAdd.init();
        /********************************* 修改字典详情 ***************************************/
        var dictDetailEdit = {};
        dictDetailEdit.valia = function () {
            $('#editDictDetailForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    editDictDetailName: {
                        validators: {
                            notEmpty: {
                                message: '字典详情名称不能为空'
                            }
                        }
                    }, editDictDetailNo: {
                        validators: {
                            notEmpty: {
                                message: '字典详情编号不能为空'
                            }
                        }
                    }
                }
            })
        }
        dictDetailEdit.submit = function (id, index, layerId) {
            $('#editDictDetailForm').on('success.form.bv', function () {
                var dictDetail = {};
                dictDetail.detailValue = $('input[name="editDictDetailName"]').val();
                dictDetail.detailCode=$('input[name="editDictDetailNo"]').val();
                dictDetail.remark = $('textarea[name="editRemark"]').val();
                dictDetail.id = id;
                dictService.updateDictDetail(dictDetail,id, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#dictDetail_table').bootstrapTable('updateRow',{index: index, row: dictDetail});
                        //清空弹窗和验证
                        common.clearForm('editDictDetailForm')
                        layer.msg('修改成功')
                        //关闭弹窗
                        layer.close(layerId);
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        dictDetailEdit.init = function () {
            //表单验证
            dictDetailEdit.valia();
            $('#editDictDetail').click(function () {
                var selected = $('#dictDetail_table').bootstrapTable('getSelections');
                if (selected.length == 0) {
                    layer.msg('请选择要修改的字典详情信息')
                } else if (selected.length > 1) {
                    layer.msg('一次只能修改一条')
                } else {
                    console.log(selected)
                    //表单数据填充
                    $('input[name="editDictDetailName"]').val(selected[0].detailValue);
                    $('input[name="editDictDetailNo"]').val(selected[0].detailCode);
                    $('textarea[name="editRemark"]').val(selected[0].remark);
                    var layerId = layer.open({
                        type: 1,
                        title: '修改字典详情',
                        offset: '100px',
                        area: '600px',
                        resize: false,
                        content: $('#edit_DictDetail')
                    })
                    //获得选中行的index
                    var indexs = common.getTableIndex('dict_table');
                    dictDetailEdit.submit(selected[0].id, indexs[0], layerId)
                }
            })
        }
        dictDetailEdit.init();
        /********************************* 删除字典详情 ***************************************/
        var dictDetailDel = {};
        dictDetailDel.init = function () {
            $('#delDict').click(function () {
                //获得选择的行
                var selected = $('#dict_table').bootstrapTable('getSelections');
                if (selected.length == 0) {
                    layer.msg('请选择要删除的字典信息')
                } else {
                    layer.confirm('确定删除?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        var ids = new Array();
                        for (var i = 0; i < selected.length; i++) {
                            ids.push(selected[i].id);
                        }
                        dictService.deleteDictByIds(ids, function (data) {
                            if (data.result) {
                                layer.msg('删除成功');
                                //从表格中删除
                                $('#dict_table').bootstrapTable('remove', {
                                    field: 'id',
                                    values: ids
                                })
                            } else {
                                layer.msg(data.description)
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }
            })
        }
        dictDetailDel.init();
    })