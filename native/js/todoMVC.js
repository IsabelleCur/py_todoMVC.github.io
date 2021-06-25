window.onload = function(){
    $('bg').style.height = deviceHeight + "px";
    //不禁用这个菜单的话长按功能会出问题！
    document.oncontextmenu = function(){
        event.returnValue = false;
    }
    model.init(function(){
        initModel();
    });

    initBtnGroup();

    initPopUp();

    initFilter();

    initTool();
};
