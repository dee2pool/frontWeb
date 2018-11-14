define(['common'], function DictController(common) {
    var dictService = new Object();
    dictService.url = common.host + "/base-data" + "/dict";
    /**
     *添加字典信息
     *@param dict dict
     */
    dictService.addDict = function (dict, onSuccess) {
        var dictStr = JSON.stringify(dict);
        var requestUrl = this.url + "/dict/add";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                dict: dictStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *判断字典信息的名称及code是否存在
     *@param name name
     *@param dictCode dictCode
     */
    dictService.existName = function (name, dictCode, onSuccess) {
        var nameStr = name;
        var dictCodeStr = dictCode;
        var requestUrl = this.url + "/dict/exist";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                name: nameStr,
                dictCode: dictCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据id修改字典信息
     *@param dict dict
     *@param id id
     */
    dictService.updateDict = function (dict, id, onSuccess) {
        var dictStr = JSON.stringify(dict);
        var idStr = id;
        var requestUrl = this.url + "/dict/update";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                dict: dictStr,
                id: idStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据id删除字典信息
     *@param ids ids
     */
    dictService.deleteDictByIds = function (ids, onSuccess) {
        var requestUrl = this.url + "/dict/delete";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                codes: ids,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *分页查询字典信息
     *@param pageNo pageNo
     *@param pageSize pageSize
     *@param dictCode dictCode
     *@param name name
     */
    dictService.getDictList = function (pageNo, pageSize, dictCode, name, onSuccess) {
        var pageNoStr = pageNo;
        var pageSizeStr = pageSize;
        var dictCodeStr = dictCode;
        var nameStr = name;
        var requestUrl = this.url + "/dict/list";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                pageNo: pageNoStr,
                pageSize: pageSizeStr,
                dictCode: dictCodeStr,
                name: nameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据字典code,获取该子节点信息
     *@param dictCode dictCode
     */
    dictService.getChildList = function (dictCode, onSuccess) {
        var dictCodeStr = dictCode;
        var requestUrl = this.url + "/" + dictCodeStr + "/child";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            async:false,
            data: {
                dictCode: dictCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *添加字典详情信息
     *@param dictDetail dictDetail
     */
    dictService.addDictDetail = function (dictDetail, onSuccess) {
        var dictDetailStr = JSON.stringify(dictDetail);
        var requestUrl = this.url + "/dictDetail/add";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                dictDetail: dictDetailStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *判断字典详情的名称及code是否存在
     *@param name name
     *@param detailCode detailCode
     */
    dictService.existDetailName = function (name, detailCode, onSuccess) {
        var nameStr = name;
        var detailCodeStr = detailCode;
        var requestUrl = this.url + "/dictDetail/exist";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                name: nameStr,
                detailCode: detailCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *修改字典详情信息
     *@param dictDetail dictDetail
     *@param id id
     */
    dictService.updateDictDetail = function (dictDetail, id, onSuccess) {
        var dictDetailStr = JSON.stringify(dictDetail);
        var idStr = id;
        var requestUrl = this.url + "/dictDetail/update";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                dictDetail: dictDetailStr,
                id: idStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *删除字典详情信息
     *@param ids ids
     */
    dictService.deleteDcitDetailByIds = function (ids, onSuccess) {
        var idsStr = JSON.stringify(ids);
        var requestUrl = this.url + "/dictDetail/delete";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                ids: idsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *分页查询字典详情信息
     *@param pageNo pageNo
     *@param pageSize pageSize
     *@param dictCode dictCode
     *@param name name
     */
    dictService.getDictDetailInfoList = function (pageNo, pageSize, dictCode, name, onSuccess) {
        var pageNoStr = pageNo;
        var pageSizeStr = pageSize;
        var dictCodeStr = dictCode;
        var nameStr = name;
        var requestUrl = this.url + "/dictDetail/list";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                pageNo: pageNoStr,
                pageSize: pageSizeStr,
                dictCode: dictCodeStr,
                name: nameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据字典code查询字典详细信息
     *@param dictCode dictCode
     */
    dictService.DictDetailByDictCode = function (dictCode, onSuccess) {
        var dictCodeStr = dictCode;
        var requestUrl = this.url + "/DictDetailByDictCode";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                dictCode: dictCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };
    /**
     *根据字典code查询设备类型列表
     *@param dictCode  字典code
     */
    dictService.DeviceTypeByDictCode = function (dictCode, onSuccess) {
        var dictCodeStr = dictCode;
        var requestUrl = this.url + "/device/typeByDictCode";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                dictCode: dictCodeStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据字典code查询设备大类列表
     */
    dictService.DeviceTypeByparentCode = function (parentCode,onSuccess) {
        var requestUrl = this.url + "/device/typeByparentCode";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                parentCode:parentCode
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };
    return dictService;
})
