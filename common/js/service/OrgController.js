define(['common'], function OrgController(common) {
    var orgService = new Object();
    orgService.url = common.host + "/base-data" + "/org";
    /**
     *添加组织
     *@param org org 待添加组织的信息
     *@param areaCode areaCode 地区代码
     */
    orgService.addOrg = function (org, areaCode, onSuccess) {
        var orgStr = JSON.stringify(org);
        var areaCodeStr = areaCode;
        var requestUrl = this.url + "/add";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                org: orgStr,
                areaCode: areaCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *判断组织名称orgName是否已存在
     *@param orgName orgName 组织名称
     */
    orgService.existOrgName = function (orgName, onSuccess) {
        var orgNameStr = orgName;
        var requestUrl = this.url + "/name/exist";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                orgName: orgNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据组织编码更新组织信息
     *@param orgCode orgCode 待修改组织的代码
     *@param org org 待修改组织的修改后的信息
     */
    orgService.updateOrg = function (orgCode, org, onSuccess) {
        var orgCodeStr = orgCode;
        var orgStr = JSON.stringify(org);
        var requestUrl = this.url + "/update";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                orgCode: orgCodeStr,
                org: orgStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *分页 多条件 排序查询组织信息
     *@param pageNo page 查询分装对象
     *@param pageSize no comment
     *@param orgName no comment
     */
    orgService.getOrgList = function (pageNo, pageSize, orgName, onSuccess) {
        var pageNoStr = pageNo;
        var pageSizeStr = pageSize;
        var orgNameStr = orgName;
        var requestUrl = this.url + "/list";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                pageNo: pageNoStr,
                pageSize: pageSizeStr,
                orgName: orgNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据组织代码,查询该组织的直接子组织节点
     *@param orgCode orgCode 组织代码,访问根节点请传入"-1"
     */
    orgService.getChildList = function (orgCode, onSuccess) {
        var orgCodeStr = orgCode;
        var requestUrl = this.url + "/" + orgCodeStr + "/chidlren";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                orgCode: orgCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据组织代码删除组织,包括其所有子节点,其以及其所有子节点所含有的资源(服务,用户,设备等一切资源)
     *@param orgCode orgCode 组织代码
     */
    orgService.deleteOrgByCode = function (orgCode, onSuccess) {
        var orgCodeStr = orgCode;
        var requestUrl = this.url + "/delete";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                orgCode: orgCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *获取当前行政地区的子行政地区
     *@param areaCode areaCode 当前行政地区编码，省级政地区的父编码为000000，
     */
    orgService.getChildArea = function (areaCode, onSuccess) {
        var areaCodeStr = areaCode;
        var requestUrl = this.url + "/area/" + areaCodeStr + "/children";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            async: false,
            data: {
                areaCode: areaCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *一次查询所有组织信息
     */
    orgService.listAllOrg = function (onSuccess) {
        var requestUrl = this.url + "/list/all";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            async: false,
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *查询一个组织信息
     *@param orgCode orgCode 查询对象code
     */
    orgService.getOrgByCode = function (orgCode, onSuccess) {
        var orgCodeStr = orgCode;
        var requestUrl = this.url + "/" + orgCodeStr + "";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            async:false,
            data: {
                orgCode: orgCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    return orgService;
})
