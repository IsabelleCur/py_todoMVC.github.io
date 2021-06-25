const longtouch_interval = 500;     //区分是否长按的时间间隔

/**
 * 浮动球样式：四个球并排
 * 监听绑定
 **/
function initBtnGroup(){
    let btnGroup = $('btn-group');

    let oldTouch;
    let touchStartTimer, touchEndTimer;
    btnGroupTouchHandler = {
        start: function(event){
            touchStartTimer = new Date();
            event.preventDefault();
            $('ButtonGroup-click').checked = !$('ButtonGroup-click').checked; 
            oldTouch = event.touches[0];
        },
        move: function(event){
            event.preventDefault();
            touchStartTimer = new Date();
            $('ButtonGroup-click').checked = false;

            let freshTouch = event.touches[0];

            let deltaRight = oldTouch.clientX - freshTouch.clientX;
            let deltaBottom = oldTouch.clientY - freshTouch.clientY;
            let right = parseFloat(btnGroup.style.right || 0) + deltaRight;
            let bottom = parseFloat(btnGroup.style.bottom || 0) + deltaBottom;

            /* 手指的移动：浮动球坐标改变 */
            if(right < deviceWidth - 60 && right > 0 
                && bottom < deviceHeight - 300 && bottom > 0){
                setStyle(btnGroup, {
                    right: right + "px",
                    bottom: bottom + "px"
                });
            }
            
            oldTouch = freshTouch;
        },
        end: function(event){
            event.preventDefault();
            touchEndTimer = new Date();
            let deltaTime = touchEndTimer.getTime() - touchStartTimer.getTime();
            
            /* 长按判定 （时间间隔）*/
            if(deltaTime > longtouch_interval){
                showPopUp();
            }
        },
        cancel: function(event){
            event.preventDefault();
            $('ButtonGroup-click').checked = false;
        }
    };

    btnGroup.addEventListener("touchstart", btnGroupTouchHandler.start);
    btnGroup.addEventListener("touchmove", btnGroupTouchHandler.move);
    btnGroup.addEventListener("touchend", btnGroupTouchHandler.end);
    btnGroup.addEventListener("touchcancel", btnGroupTouchHandler.cancel);
}

/**
 * filter筛选
 * 监听绑定
 **/
function initFilter(){
    let flts = $('.filters a');

    let oldTouch;
    let touchStartTimer, touchEndTimer;
    
    Array.from($all(".filters a")).forEach(function(filter, index){
        filter.addEventListener("touchstart", function(event){
            touchStartTimer = new Date();
            event.preventDefault();
            oldTouch = event.touches[0];
        });
        filter.addEventListener("touchmove", function(event){
            event.preventDefault();
            touchStartTimer = new Date();

            let freshTouch = event.touches[0];

            let deltaRight = oldTouch.clientX - freshTouch.clientX;
            let deltaBottom = oldTouch.clientY - freshTouch.clientY;
            let right = parseFloat(filter.style.right || 0) + deltaRight;
            let bottom = parseFloat(filter.style.bottom || 0) + deltaBottom;

            /* 手指拖动：浮动球跟随手指移动 */
            if(right < deviceWidth - 60 && right > 0        // 检查边界是否出界
                && bottom < deviceHeight - 300 && bottom > 0){
                setStyle(filter, {
                    right: right + "px",
                    bottom: bottom + "px"
                });
            }
            oldTouch = freshTouch;
        });
        filter.addEventListener("touchend", function(){
            switch(index){
                case 0:
                    model.data.filter = "All";
                    break;
                case 1:
                    model.data.filter = "Active";
                    break;
                case 2:
                    model.data.filter = "Completed";
                    break;
                default:
                    model.data.filter = "All"
            }
            update();
        });
    });
}

/**
 * 右上方白色文字对应的功能的监听绑定
 **/
function initTool(){
    let tools = $('tools');
    let finishAll = tools.firstElementChild.firstElementChild;
    let deleteCompleted = tools.lastElementChild.firstElementChild;

    /* all complete/uncomplete */
    finishAll.addEventListener("click", function(){
       if(this.innerHTML === "全部完成"){
           this.innerHTML = "全部未完成";
           model.data.todos.forEach(todo => {
                todo.completed = true;
           });
       } else {
            this.innerHTML = "全部完成";
            model.data.todos.forEach(todo => {
                todo.completed = false;
           });
       }
       model.flush();
       update();
    });

    /* delete all completed */
    deleteCompleted.addEventListener("click", function(){
        model.data.todos.forEach((todo, index) => {
            if(todo.completed){
                model.data.todos.splice(index, 1);
            }
        });
        if(model.data.todos.length!=0 && model.data.todos[0].completed){
            model.data.todos.splice(0,1);
        }
        model.flush();
        update();
    });
}