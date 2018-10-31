define(['common'], function GBCatalogController(common) {
    var gbc = new Object();
    gbc.url = common.host + "/mgc" + "/GBCatalogService";
    /**
     *添加组织信息
     *@param GBCatalog GBCatalog
     *@param orgCode orgCode
     */
    gbc.addArea = function (GBCatalog, orgCode, onSuccess) {
        var GBCatalogStr = JSON.stringify(GBCatalog);
        var orgCodeStr = orgCode;
        var requestUrl = this.url + "/addArea";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                GBCatalog: GBCatalogStr,
                orgCode: orgCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *删除
     *@param ids ids
     */
    gbc.deleteGBCatalogs = function (ids, onSuccess) {
        var idsStr = JSON.stringify(ids);
        var requestUrl = this.url + "/deleteGBCatalogs";
        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: {
                ids: idsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *分页查询
     *@param page page
     *@param id no comment
     *@param name no comment
     */
    gbc.getGBCatalogList = function (page, id, name, onSuccess) {
        var pageStr = JSON.stringify(page);
        var idStr = id;
        var nameStr = name;
        var requestUrl = this.url + "/getGBCatalogList";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                page: pageStr,
                id: idStr,
                name: nameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据id获取详细信息
     *@param id id
     */
    gbc.getGBCatalogById = function (id, onSuccess) {
        var idStr = id;
        var requestUrl = this.url + "/getGBCatalogById";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                id: idStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *no comment for this interface
     *@param page no comment
     */
    gbc.getAareaCode = function (page, onSuccess) {
        var pageStr = JSON.stringify(page);
        var requestUrl = this.url + "/getAareaCode";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                page: pageStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据serverId查询Gb配置信息
     *@param serverId  服务ID(Gb28181Catalog表中GB28181媒体网关Code)
     */
    gbc.getGbConfigByServerId = function (serverId, onSuccess) {
        var serverIdStr = serverId;
        var requestUrl = this.url + "/getGbConfig/serviceId";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                serverId: serverIdStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *获取媒体网关Code
     */
    gbc.getGB28181AMGCode = function (onSuccess) {
        var requestUrl = this.url + "/getGB28181AMGCode";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据设备id与通道号查询gb28181code
     *@param deviceId  设备id
     *@param srcsUri   通道号
     */
    gbc.getGb28181Code = function (deviceId, srcsUri, onSuccess) {
        var deviceIdStr = deviceId;
        var srcsUriStr = srcsUri;
        var requestUrl = this.url + "/getGb28181Code";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                deviceId: deviceIdStr,
                srcsUri: srcsUriStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    return gbc;
});
