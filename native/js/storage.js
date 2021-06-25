/**
 * LocalStorage:保证刷新后数据的保留
 **/
(function(){
    if(!window.localStorage){
        alert("Local Storage is not supported for your browser. Please change a browser to open this page.");
        return false;
    } else {
        let key = "todos";
        Object.assign(model, {
            /**
             * 刷新：读取LocalStorage
             * 初始化
             **/
            init: function(callback){
                let data = window.localStorage.getItem(key);
                if(data){ 
                    model.data = JSON.parse(data);
                }
                if(callback) { callback(); }
            },
            /**
             * 刷新前：写入LocalStorage
             * 持久化
             **/
            flush: function(callback){
                window.localStorage.setItem(key, JSON.stringify(model.data));
                if(callback) { callback(); }
            }
        });
    }
})();