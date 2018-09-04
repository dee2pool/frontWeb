/**
 * 基于websocket的数据交互
 * @type {string}
 */
define('client',function () {
    var client={};
    var wsHost="ws://"+"192.168.0.239:8087";
    var msg={
        type:"onMessage",
        from:"name1",
        to:"nam2",
        content:"data"
    };
    var onMessageListener;

    client.messageClient = function(userName,messageListener){
        var chat=new Object();
        onMessageListener=messageListener;
        chat.userName=userName;
        chat.url=wsHost+"/websocket";

        chat.connect=function(){
            this.websocket=new WebSocket(this.url+"/"+this.userName);
            this.websocket.onopen=function(event){
                var eventStr=JSON.stringify(event);
                console.log("on open event: "+eventStr);
            };
            this.websocket.onmessage=function(event){
                var msg=event.data;
                // console.log(event.data);
                var msg=JSON.parse(event.data);
                var messageType=msg.type;
                if(onMessageListener!=undefined){
                    onMessageListener(msg);
                    return ;
                }
            };
            this.websocket.onclose=function(event){
                if(event.code==4741  || ""!=event.reason){
                    msg.type=MessageType.logout;
                    msg.content=event.reason;
                    msg.from="SERVER";
                    msg.to="you"
                    onMessageListener(msg);
                }
                var eventStr=JSON.stringify(event);
                console.log("on  close event: "+eventStr);
            };
            this.websocket.onerror=function(event){
                var eventStr=JSON.stringify(event);
                console.log("on  error event: "+eventStr);
            };
            chat.sendText=function(msg){
                console.log("send msg: "+msg);
                this.websocket.send(msg);
            };
        };
        chat.disconnect=function(){
            this.websocket.close();
        };
        return chat;
    };

    return client;
});

