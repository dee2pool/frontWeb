define(['common'],function DomainController(common) {
    var domainService = new Object();
    domainService.url = common.host + "/auth" + "/domain";
    /**
     *添加域
     *@param domain domain 待添加域的信息
     */
    domainService.addDomain = function (domain, onSuccess) {
        var domainStr = JSON.stringify(domain);
        var requestUrl = this.url + "/add";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                domain: domainStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *判断域名称domainName是否已存在
     *@param domainName domainName 域名称
     */
    domainService.existDomainName = function (domainName, onSuccess) {
        var domainNameStr = domainName;
        var requestUrl = this.url + "/name/exist";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            data: {
                domainName: domainNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据域编码更新域信息
     *@param domainCode domainCode 待修改域的代码
     *@param domain domain 待修改域的修改后的信息
     */
    domainService.updateDomain = function (domainCode, domain, onSuccess) {
        var domainCodeStr = domainCode;
        var domainStr = JSON.stringify(domain);
        var requestUrl = this.url + "/update";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                domainCode: domainCodeStr,
                domain: domainStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *分页 多条件 排序查询域信息
     *@param pageNo page 查询分装对象
     *@param pageSize no comment
     *@param domainName no comment
     */
    domainService.getDomainList = function (pageNo, pageSize, domainName, onSuccess) {
        var pageNoStr = pageNo;
        var pageSizeStr = pageSize;
        var domainNameStr = domainName;
        var requestUrl = this.url + "/list";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                pageNo: pageNoStr,
                pageSize: pageSizeStr,
                domainName: domainNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据域代码,查询该域的直接子域节点
     *@param domainCode domainCode 域代码,访问根节点请传入"-1"
     */
    domainService.getChildList = function (domainCode, onSuccess) {
        var domainCodeStr = domainCode;
        var requestUrl = this.url + "/" + domainCodeStr + "/chidlren";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                domainCode: domainCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据域代码删除域,包括其所有子节点,其以及其所有子节点所含有的资源(服务,用户,设备等一切资源)
     *@param domainCode domainCode 域代码
     */
    domainService.deleteDomainByCode = function (domainCode, onSuccess) {
        var domainCodeStr = domainCode;
        var requestUrl = this.url + "/delete";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                domainCode: domainCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *一次查询所有域信息
     */
    domainService.listAllDomain = function (onSuccess) {
        var requestUrl = this.url + "/list/all";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            async:false,
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *查询一个域信息
     *@param domainCode domainCode 查询对象code
     */
    domainService.getDomainByCode = function (domainCode, onSuccess) {
        var domainCodeStr = domainCode;
        var requestUrl = this.url + "/" + domainCodeStr + "";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                domainCode: domainCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *给指定域分配组织
     *@param domainCode  指定域的域编码
     *@param orgCodes  待分配组织集合的代码集合
     */
    domainService.assignOrgToDomain = function (domainCode, orgCodes, onSuccess) {
        var domainCodeStr = domainCode;
        var orgCodesStr = JSON.stringify(orgCodes);
        var requestUrl = this.url + "/assign/org";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                domainCode: domainCodeStr,
                orgCodes: orgCodesStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *剥夺指定域已拥有的组织
     *@param domainCode  指定域的域编码
     *@param orgCodes  待剥夺组织集合的代码集合
     */
    domainService.depriveDomainOfOrg = function (domainCode, orgCodes, onSuccess) {
        var domainCodeStr = domainCode;
        var orgCodesStr = JSON.stringify(orgCodes);
        var requestUrl = this.url + "/deprive/org";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                domainCode: domainCodeStr,
                orgCodes: orgCodesStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *给指定域重新分配组织,会覆盖原有分配
     *@param domainCode  指定域的域编码
     *@param orgCodes  待重新分配组织集合的代码集合
     */
    domainService.reassignOrgToDomain = function (domainCode, orgCodes, onSuccess) {
        var domainCodeStr = domainCode;
        var orgCodesStr = JSON.stringify(orgCodes);
        var requestUrl = this.url + "/reassign/org";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                domainCode: domainCodeStr,
                orgCodes: orgCodesStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    return domainService;
})
