require.config({
    shim: {
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
        },
        'ztree': {
            deps: ['jquery']
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
        "orgService": "../../../common/js/service/OrgController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'topBar', 'orgService', 'ztree'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrapTableZhcN, bootstrap, topBar, orgService, ztree) {
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
        /********************************* 组织树 ***************************************/
        var orgTree = {};
        orgTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
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
                    orgTree.nodeSelected = treeNode;
                    $('#org_table').bootstrapTable('refresh',{silent:true,query:{orgCode:treeNode.code}});
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    orgTree.obj.removeChildNodes(treeNode);
                    orgService.getChildList(treeNode.code, function (data) {
                        if (data.result) {
                            if (data.result) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/org.png";
                                }
                                var newNodes = data.data;
                                //添加节点
                                orgTree.obj.addNodes(treeNode, newNodes);
                            } else {
                                layer.msg('加载组织树失败');
                            }
                        }
                    })
                }
            }
        };
        orgTree.zNode = function () {
            var treeNode;
            orgService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/org.png";
                    }
                    treeNode = data.data;
                } else {
                    layer.msg('加载组织树失败');
                }
            })
            return treeNode;
        }
        orgTree.init = function () {
            orgTree.obj = $.fn.zTree.init($("#orgtree"), orgTree.setting, orgTree.zNode());
        }
        //动态添加节点
        orgTree.addNode = function (newNode) {
            if (orgTree.obj) {
                //获取当前选中的节点
                var selected = orgTree.obj.getSelectedNodes();
                if (selected.length > 0&&selected[0].open) {
                    //在节点下添加节点
                    orgTree.obj.addNodes(selected[0], newNode);
                }
            }
        }
        orgTree.updateNode = function (newNode) {
            if (orgTree.obj) {
                var node = orgTree.obj.getNodeByParam('code',newNode.code);
                if (node) {
                    node.name = newNode.name;
                    node.description = newNode.description;
                    orgTree.obj.updateNode(node);
                }
            }
        }
        orgTree.delNode=function(code){
            var node=orgTree.obj.getNodeByParam('code',code,null);
            if(node){
                orgTree.obj.removeNode(node);
            }
        }
        orgTree.init();
        /********************************* 组织表格 ***************************************/
        var orgTable = {};
        orgTable.init = function () {
            var queryUrl = common.host + "/base-data" + "/org" + "/list";
            $('#org_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'name',
                    title: '组织名称',
                    align: 'center'
                }, {
                    field: 'code',
                    visible: false

                }, {
                    field: 'parentCode',
                    visible: false
                }, {
                    field: 'createTime',
                    visible: false
                }, {
                    field: 'creatorId',
                    visible: false
                }, {
                    field: 'areaCode',
                    visible: false
                }, {
                    field: 'description',
                    title: '备注',
                    align: 'center'
                }, {
                    title: '操作',
                    align: 'center',
                    events: {
                        "click #edit": function (e, value, row, index) {
                            orgEdit.init(row,index);
                        },
                        "click #del": function (e, value, row, index) {
                            orgDel.init(row)
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
                        pageSize: params.pageSize,
                        orgName: params.searchText
                    }
                    return temp
                }
            })
        }
        orgTable.init();
        //初始化表格高度
        $('#org_table').bootstrapTable('resetView',{height:$(window).height()-135});
        //自适应表格高度
        common.resizeTableH('#org_table');
        /********************************* 添加组织 ***************************************/
        var orgAdd = {};
        orgAdd.valia = function () {
            $('#orgForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    orgName: {
                        validators: {
                            notEmpty: {
                                message: '组织名称不能为空'
                            }
                        }
                    },
                    areaCode: {
                        validators: {
                            notEmpty: {
                                message: '区域编码不能为空'
                            }
                        }
                    },
                    orderNo: {
                        validators: {
                            notEmpty: {
                                message: '展示序号不能为空'
                            },
                            numeric: {
                                message: '展示序号只能为数字'
                            }
                        }
                    }
                }
            })
        }
        orgAdd.submit = function () {
            $('#orgForm').on('success.form.bv', function () {
                var org = {};
                org.name = $.trim($('input[name="orgName"]').val());
                org.parentCode = $.trim($('input[name="orgParentCode"]').val());
                org.description = $.trim($('textarea[name="orgRemark"]').val());
                areaCode = $('input[name="areaCode"]').val();
                orgService.addOrg(org, areaCode, function (data) {
                    if (data.result) {
                        //清空表单和验证
                        common.clearForm('orgForm');
                        //在树节点中添加节点
                        org.id = data.data;
                        org.icon = "../img/org.png";
                        orgTree.addNode(org);
                        //刷新表格
                        $('#org_table').bootstrapTable('refresh', {silent: true});
                        layer.closeAll();
                        layer.msg('添加组织成功')
                    } else {
                        layer.msg(data.description)
                    }
                })
                return false;
            })
        }
        orgAdd.init = function () {
            $('#addOrg').click(function () {
                //表单填充
                if (!orgTree.nodeSelected) {
                    layer.msg('请选择上级组织')
                } else {
                    $('input[name="orgParentName"]').val(orgTree.nodeSelected.name);
                    $('input[name="orgParentCode"]').val(orgTree.nodeSelected.code);
                    //开启验证
                    orgAdd.valia();
                    //打开弹窗
                    layer.open({
                        type: 1,
                        title: '添加组织',
                        offset: '100px',
                        skin: 'layui-layer-lan',
                        area: '600px',
                        resize: false,
                        content: $('#add_org'),
                        cancel: function (index, layero) {
                            common.clearForm('orgForm');
                        }
                    })
                    //关闭弹窗
                    $('.btn-cancel').click(function () {
                        layer.closeAll();
                        common.clearForm('orgForm');
                    })
                    orgAdd.submit();
                }
            })
        }
        orgAdd.init();
        /********************************* 修改组织 ***************************************/
        var orgEdit = {};
        orgEdit.valia = function () {
            $('#altorgForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    altorgName: {
                        validators: {
                            notEmpty: {
                                message: '组织名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        orgEdit.submit = function (row, index) {
            $('#altorgForm').on('success.form.bv', function () {
                var org = {};
                org.code = row.code;
                org.name = $('input[name="altorgName"]').val();
                org.description = $('textarea[name="altorgRemark"]').val();
                orgService.updateOrg(row.code, org, function (data) {
                    if (data.result) {
                        //清空表格和验证
                        common.clearForm('altorgForm');
                        //更新表格
                        $('#org_table').bootstrapTable('updateCell', {index: index, field:"name", value: org.name});
                        $('#org_table').bootstrapTable('updateCell', {
                            index: index,
                            field: 'description',
                            value: org.description
                        });
                        //更新树节点
                        orgTree.updateNode(org);
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改组织成功')
                    } else {
                        layer.msg("修改组织失败");
                    }
                })
                return false;
            })
        }
        orgEdit.init = function (row, index) {
            //表单验证
            orgEdit.valia();
            $('input[name="altorgName"]').val(row.name);
            $('textarea[name="altorgRemark"]').val(row.description);
            layer.open({
                type: 1,
                title: '修改组织',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#alt_org'),
                cancel: function (index, layero) {
                    common.clearForm('altorgForm');
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('altorgForm');
            })
            //表单提交
            orgEdit.submit(row,index);
        }
        /********************************* 删除组织 ***************************************/
        var orgDel={};
        orgDel.init=function (row) {
            //删除组织操作
            layer.confirm('确定删除 '+row.name+' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                orgService.deleteOrgByCode(row.code,function (data) {
                    if(data.result){
                        //更新表格
                        $('#org_table').bootstrapTable('remove', {
                            field: 'code',
                            values: [row.code]
                        })
                        //更新树
                        orgTree.delNode(row.code);
                        layer.closeAll();
                        layer.msg('删除组织成功');
                    }else{
                        layer.msg(data.description);
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 初始化区域树 ***************************************/
        var treeNode;
        orgService.getChildArea('000000', function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    data.data[i].isParent = true;
                }
                treeNode = data.data;
            } else {
                layer.msg(data.description);
            }
        })
        //选择区域
        var areaLayer;
        $('#choseArea').click(function () {
            areaLayer = layer.open({
                type: 1,
                title: '区域编码树',
                skin: 'layui-layer-rim',
                offset: '100px',
                area: ['300px', '450px'],
                resize: false,
                content: $('#areatree')
            })
        })
        var setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
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
                    $('input[name="areaCode"]').val(treeNode.code);
                    //去除验证
                    $('#orgForm').data('bootstrapValidator')
                        .updateStatus('areaCode', 'NOT_VALIDATED', null)
                        .validateField('areaCode');
                    layer.close(areaLayer)
                },
                onExpand: function (event, treeId, treeNode) {
                    orgService.getChildArea(treeNode.code, function (data) {
                        if (data.result) {
                            for (var i = 0; i < data.dataSize; i++) {
                                data.data[i].isParent = true;
                            }
                            var newNodes = data.data;
                            //添加节点
                            treeObj.addNodes(treeNode, newNodes);
                        }
                    })
                }
            }
        }
        var treeObj = $.fn.zTree.init($("#areatree"), setting, treeNode);
    })