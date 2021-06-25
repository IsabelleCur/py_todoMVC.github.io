/**
 * 长按add后：打开输入框
 * 监听绑定
 **/
function initPopUp(){
    Array.from($all(".rubber-band")).forEach(function(btn, index){
        btn.addEventListener("click", function(){
            this.style.animation = "rubberBandAnimation 1s"; 
            setTimeout(function () {
                btn.style.animation = "none";
            }, 1000);

            if(index === 0){
                addTodo();
            }
            hidePopUp();
        }, false);
    });
    /* 键盘输入todo内容 */
    $('todo-input').addEventListener('keyup', function(){
        if (event.keyCode != 13){
            return;
        }
        addTodo();
        hidePopUp();
    }, false);

    hidePopUp();
}

/**
 * 显示弹出框
 **/
function showPopUp(){
    setStyle($("popup-box"), {
        opacity: "1",
        zIndex: "999",
    });
    
    // 将所有元素disable
    $('todo-input').disabled = false;
    Array.from($all('.InputBtnGroup .rubber-band')).forEach(elem => {
        elem.disabled = false;
    });

    $('todo-input').focus();
}

/**
 * 按下quit键后隐藏弹出框
 **/
function hidePopUp(){
    setStyle($("popup-box"), {
        opacity: "0",
        zIndex: "-100",
    });

    // 将所有元素disable
    $('todo-input').disabled = true;
    Array.from($all('.InputBtnGroup .rubber-band')).forEach(elem => {
        elem.disabled = true;
    });
}