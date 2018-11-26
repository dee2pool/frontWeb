define(['common'],function TaskController(common){
    var taskService=new Object();
    taskService.url=common.task+"/task";

    taskService.addTask=function (task,onSuccess) {
        console.log(task);
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
    
    return taskService;
})
