define(['./../../../config/common/js/util'], function UserController(common) {
    var UserService = new Object();
    UserService.url = common.host + "/auth" + "/user";
    /**
     *添加用户账号信息
     *@param user  待添加的用户账号信息
     */
    UserService.add=function(user,roleIds,onSuccess){
        var userStr=JSON.stringify(user);
        var roleIdsStr=JSON.stringify(roleIds);
        var requestUrl=this.url+"/add";
        $.ajax({
            url:requestUrl,
            type:'Get',
            data:{
                user:userStr,
                roleIds:roleIdsStr
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    /**
     *删除用户账号
     *@param userId  待删除用户账号的Id
     */
    UserService.delete = function (userId, onSuccess) {
        var userIdStr = userId;
        var requestUrl = this.url + "/delete";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userId: userIdStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *no comment for this interface
     *@param pageNo no comment
     *@param pageSize no comment
     *@param userName no comment
     */
    UserService.getUserList = function (pageNo, pageSize, userName, onSuccess) {
        var pageNoStr = pageNo;
        var pageSizeStr = pageSize;
        var userNameStr = userName;
        var requestUrl = this.url + "/list";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {
                pageNo: pageNoStr,
                pageSize: pageSizeStr,
                userName: userNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *更改用户账号状态
     *@param userId  账号Id
     *@param userState  更改后的用户状态
     */
    UserService.updateUserState = function (userId, userState, onSuccess) {
        var userIdStr = userId;
        var userStateStr = userState;
        var requestUrl = this.url + "/update/state";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userId: userIdStr,
                userState: userStateStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *修改当前用户的用户密码
     *@param oldPassword  旧密码
     *@param newPassword  新密码
     */
    UserService.updatePassword = function (oldPassword, newPassword, onSuccess) {
        var oldPasswordStr = oldPassword;
        var newPasswordStr = newPassword;
        var requestUrl = this.url + "/update/password";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                oldPassword: oldPasswordStr,
                newPassword: newPasswordStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *判断用户登录名是否已存在
     *@param loginName  登录账号名
     */
    UserService.isLoginNameExist = function (loginName, onSuccess) {
        var loginNameStr = loginName;
        var requestUrl = this.url + "/name/exist";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            data: {
                loginName: loginNameStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *验证指定身份令牌是否有权限访问特定路径资源
     *@param token  身份令牌
     *@param path  路径
     */
    UserService.isValid = function (token, path, onSuccess) {
        var tokenStr = token;
        var pathStr = path;
        var requestUrl = this.url + "/validate";
        $.ajax({
            url: requestUrl,
            type: 'Get',
            data: {
                token: tokenStr,
                path: pathStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *给指定用户,授予角色
     *@param userId  指定用户的Id
     *@param roleIds  待授予角色集合的Id集合
     */
    UserService.grantRole = function (userId, roleIds, onSuccess) {
        var userIdStr = userId;
        var roleIdsStr = JSON.stringify(roleIds);
        var requestUrl = this.url + "/grant/role";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userId: userIdStr,
                roleIds: roleIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *给指定用户,重新授予角色
     *@param userId  指定用户的Id
     *@param roleIds  待重新授予角色集合的Id集合
     */
    UserService.resetRole = function (userId, roleIds, onSuccess) {
        var userIdStr = userId;
        var roleIdsStr = JSON.stringify(roleIds);
        var requestUrl = this.url + "/reset/role";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userId: userIdStr,
                roleIds: roleIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *给指定用户,剥夺角色
     *@param userId  指定用户的Id
     *@param roleIds  待剥夺角色集合的Id集合
     */
    UserService.depriveRole = function (userId, roleIds, onSuccess) {
        var userIdStr = userId;
        var roleIdsStr = JSON.stringify(roleIds);
        var requestUrl = this.url + "/deprive/role";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userId: userIdStr,
                roleIds: roleIdsStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };
    //修改用户用户组
    UserService.updateGroupIdByUserId = function (userIds, groupId, onSuccess) {
        var userIdsStr = JSON.stringify(userIds);
        var groupIdStr = groupId;
        var requestUrl = this.url + "/update/groupId";
        $.ajax({
            url: requestUrl,
            type: 'Post',
            data: {
                userIds: userIdsStr,
                groupId: groupIdStr,
            },
            cache: false,
            success: onSuccess,
            error: common.onError
        });
    };

    /**
     *根据用户id修改用户信息
     *@param user user
     *@param userId  用户id
     */
    UserService.updateUserById=function(user,userId,onSuccess){
        var userStr=JSON.stringify(user);
        var userIdStr=userId;
        var requestUrl=this.url+"/update";
        $.ajax({
            url:requestUrl,
            type:'POST',
            data:{
                user:userStr,
                userId:userIdStr,
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    /**
     *获取用户所配置的角色
     *@param roleIds  角色id集合
     *@param userId   用户id
     */
    UserService.getUserRoleById=function(roleIds,userId,onSuccess){
        var roleIdsStr=JSON.stringify(roleIds);
        var userIdStr=userId;
        var requestUrl=this.url+"/user/userRoleList";
        $.ajax({
            url:requestUrl,
            type:'Get',
            async:false,
            data:{
                roleIds:roleIdsStr,
                userId:userIdStr,
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        });
    };

    return UserService;
})
