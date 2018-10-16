define(["domainService","orgService"], function (domainService,orgService) {
    var orgTree = {};
    orgTree.setting = {};
    orgTree.zNodes = function () {
        var zNodes;
        //获得所有域信息
        domainService.listAllDomain(function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    //设置域的图标
                    data.data[i]['icon']="../../domain/media/domain-img2.png";
                    //获得域下的组织
                    domainService.getDomainOrg(data.data[i].code, function (domainOrgData) {
                        if (domainOrgData.result) {
                            if(domainOrgData.dataSize>0){
                                //域下的组织列表
                                var orgList=new Array();
                                //获得单个域所拥有的组织列表
                                for(var j=0;j<domainOrgData.dataSize;j++){
                                    //根据组织code查询组织信息
                                    orgService.getOrgByCode(domainOrgData.data[j].orgCode,function (orgData) {
                                        if(orgData.result){
                                            //设置组织图标
                                            orgData.data['icon']="../../org/media/org.png";
                                            //添加到列表
                                            orgList.push(orgData.data);
                                        }
                                    })
                                }
                                data.data[i]["children"]=orgList;
                            }
                        }

                    })
                }
                zNodes=data.data;
            }
        })
        return zNodes;
    }
    return orgTree;
})