define(['common'], function RoleController(common) {
    var RoleService = new Object();
    RoleService.url = common.host + "/auth" + "/role";
    /**
     *添加系统角色
     *@param role role 待添加的角色信息
     */
    RoleService.addRole = function (role, onSuccess) {
        var roleStr = JSON.stringify(role);
        var requestUrl = this.url + "/add";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                role: roleStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };
    /**
     *删除角色
     *@param roleId roleId 待删除角色的Id
     */
    RoleService.deleteRole = function (roleId, onSuccess) {
        var roleIdStr = roleId;
        var requestUrl = this.url + "/delete";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *加载角色列表
     */
    RoleService.getRoleList = function (onSuccess) {
        var requestUrl = this.url + "/list";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };
    /**
     *no comment for this interface
     */
    RoleService.updateRole = function (onSuccess) {
        var requestUrl = this.url + "/update";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            data: {},
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *授予角色权限
     *@param roleId roleId 待授予角色的Id
     *@param permissionIds permissionIds 待授予权限的Id集合
     */
    RoleService.grantPermission = function (roleId, permissionIds, onSuccess) {
        var roleIdStr = roleId;
        var permissionIdsStr = JSON.stringify(permissionIds);
        var requestUrl = this.url + "/permission/grant";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                permissionIds: permissionIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *重新授予角色权限,将会覆盖原有权限
     *@param roleId roleId 待重新授予目标角色的Id
     *@param permissionIds permissionIds 待重新授予权限的Id集合
     */
    RoleService.resetPermission = function (roleId, permissionIds, onSuccess) {
        var roleIdStr = roleId;
        var permissionIdsStr = JSON.stringify(permissionIds);
        var requestUrl = this.url + "/permission/reset";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                permissionIds: permissionIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *剥夺角色所拥有的权限
     *@param roleId roleId 带剥夺目标角色的Id
     *@param permissionIds permissionIds 带剥夺权限的Id集合
     */
    RoleService.deprivePermission = function (roleId, permissionIds, onSuccess) {
        var roleIdStr = roleId;
        var permissionIdsStr = JSON.stringify(permissionIds);
        var requestUrl = this.url + "/permission/deprive";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                permissionIds: permissionIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *授予角色菜单项
     *@param roleId  待授予角色的Id
     *@param menuIds  待授予菜单项的Id集合
     */
    RoleService.grantMenu = function (roleId, menuIds, onSuccess) {
        var roleIdStr = roleId;
        var menuIdsStr = JSON.stringify(menuIds);
        var requestUrl = this.url + "/menu/grant";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                menuIds: menuIdsStr
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *重新给角色分配菜单项
     *@param roleId  待重新授予角色的Id
     *@param menuIds  待重新授予菜单集合的Id
     */
    RoleService.resetMenu = function (roleId, menuIds, onSuccess) {
        var roleIdStr = roleId;
        var menuIdsStr = JSON.stringify(menuIds);
        var requestUrl = this.url + "/menu/reset";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                menuIds: menuIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *剥夺角色的菜单项
     *@param roleId  待剥夺角色的Id
     *@param menuIds  待剥夺菜单项集合的id集合
     */
    RoleService.depriveMenu = function (roleId, menuIds, onSuccess) {
        var roleIdStr = roleId;
        var menuIdsStr = JSON.stringify(menuIds);
        var requestUrl = this.url + "/menu/deprive";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                roleId: roleIdStr,
                menuIds: menuIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    return RoleService;
})
