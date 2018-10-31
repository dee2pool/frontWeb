require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
        },
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
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "domainService": "../../../common/js/service/DomainController",
        "orgService": "../../../common/js/service/OrgController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap', 'topBar', 'domainService', 'orgService', 'ztree'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrap, topBar, domainService, orgService, ztree) {
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
        /********************************* 管理域树 ***************************************/
        var domainTree = {};
        domainTree.setting = {
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
                    if (treeNode.type && treeNode.type === 'org') {
                        domainTree.selOrg=treeNode;
                        if(domainTree.selDomain){
                            domainTree.selDomain=null;
                        }
                        $('#alertOrg').show();
                        $('#alertDomain').hide();
                        $('input[name="orgCode"]').val(treeNode.code);
                        $('input[name="orgpCode"]').val(treeNode.parentCode);
                        $('input[name="orgName"]').val(treeNode.name);
                        $('input[name="orgPersion"]').val(treeNode.creatorId);
                        $('input[name="orgTime"]').val(treeNode.createTime);
                        $('textarea[name="orgRemark"]').val(treeNode.description);
                    } else {
                        domainTree.selDomain = treeNode;
                        if(domainTree.selOrg){
                            domainTree.selOrg=null;
                        }
                        $('#alertDomain').show();
                        $('#alertOrg').hide();
                        $('input[name="dCode"]').val(treeNode.code);
                        $('input[name="pCode"]').val(treeNode.parentCode);
                        $('input[name="dName"]').val(treeNode.name);
                        $('input[name="dPersion"]').val(treeNode.creatorId);
                        $('input[name="dTime"]').val(treeNode.createTime);
                        $('textarea[name="dRemark"]').val(treeNode.description);
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    domainTree.obj.removeChildNodes(treeNode);
                    //如果节点是组织，获取组织下的子组织
                    if (treeNode.type && treeNode.type === 'org') {
                        //获得组织下的子组织
                        orgService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/org.png";
                                        data.data[i].type = 'org';
                                        data.data[i].domainCode=treeNode.domainCode;
                                    }
                                    var newNodes = data.data;
                                    console.log(newNodes);
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            }
                        })
                    } else {
                        //判断域下是否有组织
                        domainService.getDomainOrg(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        //根据组织code查找组织名称 TODO:修改
                                        orgService.getOrgByCode(data.data[i].orgCode, function (orgData) {
                                            if (orgData.result) {
                                                data.data[i].isParent = true;
                                                data.data[i].icon = "../img/org.png";
                                                data.data[i].name = orgData.data.name;
                                                data.data[i].parentCode = orgData.data.parentCode;
                                                data.data[i].createTime = orgData.data.createTime;
                                                data.data[i].creatorId = orgData.data.creatorId;
                                                data.data[i].description = orgData.data.description;
                                                data.data[i].type = 'org';
                                                data.data[i].code = data.data[i].orgCode;
                                            } else {
                                                layer.msg('获取组织节点失败');
                                            }
                                        })
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得组织节点失败')
                            }
                        })
                        domainService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/domain.png";
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得子域节点失败')
                            }
                        })
                    }
                }
            }
        };
        domainTree.zNode = function () {
            var treeNode;
            domainService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/domain.png";
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        domainTree.init = function () {
            domainTree.obj = $.fn.zTree.init($("#domaintree"), domainTree.setting, domainTree.zNode());
        }
        domainTree.init();
        /********************************* 修改管理域 ***************************************/
        var domainEdit = {};
        domainEdit.valia = function () {
            $('#alertDomain').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    dName: {
                        validators: {
                            notEmpty: {
                                message: '域名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        domainEdit.submit = function () {
            $('#alertDomain').on('success.form.bv', function () {
                var domain = {};
                //TODO 修改时不需要获得所有信息,不需要orderNo
                domain.code = $('input[name="dCode"]').val();
                domain.name = $('input[name="dName"]').val();
                domain.createTime = $('input[name="dTime"]').val();
                domain.creatorId = $('input[name="dPersion"]').val();
                domain.description = $('textarea[name="dRemark"]').val();
                domain.parentCode = $('input[name="pCode"]').val();
                domainService.updateDomain(domain.code, domain, function (data) {
                    if (data.result) {
                        //更新树
                        if (domainTree.obj) {
                            var node = domainTree.obj.getNodeByTId(domain.code);
                            node.name = domain.name;
                            node.description = domain.description;
                            domainTree.obj.updateNode(node);
                        }
                        layer.msg('修改管理域成功');
                        $('button[type="submit"]').removeAttr('disabled');
                    } else {
                        layer.msg('修改管理域失败');
                        $('button[type="submit"]').removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        domainEdit.valia();
        domainEdit.submit();
        /********************************* 修改组织 ***************************************/
        var orgEdit = {};
        orgEdit.valia = function () {
            $('#alertOrg').bootstrapValidator({
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
                    }
                }
            })
        }
        orgEdit.submit = function () {
            $('#alertOrg').on('success.form.bv', function () {
                var org = {};
                //TODO 修改时不需要获得所有信息,不需要orderNo,areaCode
                org.code = $('input[name="orgCode"]').val();
                org.name = $('input[name="orgName"]').val();
                org.createTime = $('input[name="orgTime"]').val();
                org.creatorId = $('input[name="orgPersion"]').val();
                org.description = $('textarea[name="orgRemark"]').val();
                org.parentCode = $('input[name="orgpCode"]').val();
                orgService.updateOrg(org.code, org, function (data) {
                    if (data.result) {
                        if (domainTree.obj) {
                            var node = domainTree.obj.getNodeByTId(org.code);
                            node.name = org.name;
                            node.description = org.description;
                            domainTree.obj.updateNode(node);
                        }
                        layer.msg('修改组织成功');
                        $('button[type="submit"]').removeAttr('disabled');
                    } else {
                        layer.msg('修改组织失败');
                        $('button[type="submit"]').removeAttr('disabled');
                    }
                })
                return false;
            })
        }
        orgEdit.valia();
        orgEdit.submit();
        /********************************* 添加管理域 ***************************************/
        var domainAdd = {};
        domainAdd.valia = function () {
            $('#domainForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    domainName: {
                        validators: {
                            notEmpty: {
                                message: '域名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        domainAdd.submit = function () {
            $('#domainForm').on('success.form.bv', function () {
                var domain = {};
                domain.name = $('input[name="domainName"]').val();
                domain.parentCode = $('input[name="parentDoaminCode"]').val();
                domain.remark = $('textarea[name="domainRemark"]').val();
                domainService.addDomain(domain, function (data) {
                    if (data.result) {
                        //刷新树
                        domainTree.init();
                        //清空表单和验证
                        common.clearForm('domainForm');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('添加成功')
                    } else {
                        layer.closeAll();
                        //清空表单和验证
                        common.clearForm('domainForm');
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        domainAdd.init = function () {
            $('#addDomain').click(function () {
                if (domainTree.selDomain) {
                    $('input[name="parentDoamin"]').val(domainTree.selDomain.name);
                    $('input[name="parentDoaminCode"]').val(domainTree.selDomain.code);
                } else {
                    $('input[name="parentDoamin"]').val('无');
                    $('input[name="parentDoaminCode"]').val('-1');
                }
                //表单验证
                domainAdd.valia();
                layer.open({
                    type: 1,
                    title: '添加管理域',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_Domain')
                })
                //表单提交
                domainAdd.submit();
            })
        }
        domainAdd.init();
        /********************************* 初始化区域树 ***************************************/
        var areaTree={};
        areaTree.setting={
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
        orgService.getChildArea('000000', function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    data.data[i].isParent = true;
                }
                areaTree.treeNode = data.data;
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
        var treeObj = $.fn.zTree.init($("#areatree"),areaTree.setting,areaTree.treeNode);
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
                    oName: {
                        validators: {
                            notEmpty: {
                                message: '组织名称不能为空'
                            }
                        }
                    },
                    areaCode:{
                        validators: {
                            notEmpty: {
                                message: '区域编码不能为空'
                            }
                        }
                    }
                }
            })
        }
        orgAdd.submit = function () {
            $('#orgForm').on('success.form.bv', function () {
                var org = {};
                org.name = $('input[name="oName"]').val();
                org.description = $('textarea[name="oRemark"]').val();
                var domainCode;
                if(domainTree.selDomain){
                    org.parentCode = '-1';
                    domainCode=$('input[name="pOrgCode"]').val();
                }else{
                    org.parentCode = $('input[name="pOrgCode"]').val();
                    domainCode=domainTree.selOrg.domainCode;
                }
                var areaCode=$('input[name="areaCode"]').val();
                orgService.addOrg(org,areaCode,domainCode,function (data) {
                    if (data.result) {
                        //刷新树
                        domainTree.init();
                        //清空表单和验证
                        common.clearForm('orgForm');
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('添加成功')
                    } else {
                        $('button[type="submit"]').removeAttr('disabled');
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        orgAdd.init = function () {
            //TODO 接口不符合
            $('#addOrg').click(function () {
                var isSel=false;
                if (domainTree.selDomain) {
                    $('input[name="pOrg"]').val(domainTree.selDomain.name);
                    $('input[name="pOrgCode"]').val(domainTree.selDomain.code);
                    isSel=true;
                } else if(domainTree.selOrg) {
                    $('input[name="pOrg"]').val(domainTree.selOrg.name);
                    $('input[name="pOrgCode"]').val(domainTree.selOrg.code);
                    isSel=true;
                }else{
                    layer.msg('请选择组织或管理域')
                }
                if(isSel){
                    //表单验证
                    orgAdd.valia();
                    layer.open({
                        type: 1,
                        title: '添加管理域',
                        skin: 'layui-layer-lan',
                        offset: '100px',
                        area: '600px',
                        resize: false,
                        content: $('#add_org')
                    })
                    //表单提交
                    orgAdd.submit();
                }
            })
        }
        orgAdd.init();
        /********************************* 刪除管理域或组织 ***************************************/
        var del={};
        del.init=function () {
            $('#del').click(function () {
                if(domainTree.selOrg){
                    //删除组织操作
                    layer.confirm('确定删除 '+domainTree.selOrg.name+' ?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        orgService.deleteOrgByCode(domainTree.selOrg.code,function (data) {
                            if(data.result){
                                //更新树
                                domainTree.init();
                                layer.closeAll();
                                layer.msg('删除组织成功');
                            }else{
                                layer.msg(data.description);
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }else if(domainTree.selDomain){
                    //删除管理域操作
                    layer.confirm('确定删除 '+domainTree.selDomain.name+' ?', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        domainService.deleteDomainByCode(domainTree.selDomain.code,function (data) {
                            if(data.result){
                                //更新树
                                domainTree.init();
                                layer.closeAll();
                                layer.msg('删除管理域成功');
                            }else{
                                layer.msg(data.description);
                            }
                        })
                    }, function () {
                        layer.closeAll();
                    });
                }else{
                    layer.msg('请选择要删除的组织或管理域')
                }
            })
        }
        del.init();
    })