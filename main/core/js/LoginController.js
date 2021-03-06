function LoginController(){
    var service=new Object();
    service.url=host+"/auth"+"/";
    /**
      *用户账号验证接口 
      *@param userName  登录账号名 
      *@param password  登录密码 
      *@param captchaId  验证码Id 
      *@param captcha  验证码的值 
      */
     service.login=function(userName,password,captchaId,captcha,onSuccess){
	     var userNameStr=userName;
	     var passwordStr=password;
	     var captchaIdStr=captchaId;
	     var captchaStr=captcha;
		 var requestUrl=this.url+"/login";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   userName:userNameStr,
                   password:passwordStr,
                   captchaId:captchaIdStr,
                   captcha:captchaStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *请求临时登录凭据 
      */
     service.getTempToken=function(onSuccess){
		 var requestUrl=this.url+"/token/temp";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *验证临时登录凭据, 
      *@param token token 
      */
     service.validateTempToken=function(token,onSuccess){
	     var tokenStr=token;
		 var requestUrl=this.url+"/token/temp/validate";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
                   token:tokenStr,
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *登出 
      */
     service.logout=function(onSuccess){
		 var requestUrl=this.url+"/logout";
         $.ajax({
             url:requestUrl,
             type:'Post',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断指定IP是否已经被锁定 
      */
     service.isIpAddressBlocked=function(onSuccess){
		 var requestUrl=this.url+"/is/ip/blocked";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *判断指定IP是否需要验证码登录 
      */
     service.isNeedCaptcha=function(onSuccess){
		 var requestUrl=this.url+"/is/need/captcha";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    /**
      *生成验证码 
      */
     service.generateCaptcha=function(onSuccess){
		 var requestUrl=this.url+"/captcha/generate";
         $.ajax({
             url:requestUrl,
             type:'Get',
             data:{
             },
             cache:false,
             success:onSuccess,
             error:common.onError
             });
    };
           
    return service;
}
