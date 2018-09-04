require.config({
    shim: {
        'layx':{
            export: 'layx'
        }
    },
    paths: {
        "layx": "../lib/layx/layx"
    }
});
require(['layx'],function (layx) {
    layx.html('str','字符串文本','Hello Layx!');
});
