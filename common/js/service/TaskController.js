define(['common'],function TaskController(common){
    var taskService=new Object();
    taskService.url=common.task+"/task";

    /*
    添加任务
     */
    taskService.addTask=function (task,onSuccess) {
        var requestUrl=this.url+"/add";
        $.ajax({
            url:requestUrl,
            type:'POST',
            data:{
                task:JSON.stringify(task)
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        })
    }
    /*
    删除任务
     */
    taskService.deleteTask=function (taskId,onSuccess) {
        var requestUrl=this.url+"/delete";
        $.ajax({
            url:requestUrl,
            type:'POST',
            data:{
                taskId:taskId
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        })
    }
    /*
    重试任务
     */
    taskService.retryTask=function (taskId,onSuccess) {
        var requesturl=this.url+"/retry";
        $.ajax({
            url:requesturl,
            type:'POST',
            data:{
                taskId:taskId
            },
            cache:false,
            success:onSuccess,
            error:common.onError
        })

    }
    return taskService;
})
