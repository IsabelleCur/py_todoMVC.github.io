const dbltouch_interval = 800;        //双击：判定是否双击的时间间隔
const tolerateVerticalOffset = 20;    // 左右滑动时：上下移动距离偏差的容忍范围

/**
 * todo监听绑定
 * elem =>待绑定元素
 * index =>元素索引
 */
function initTodo(elem, index) {
    let touchStartTimer, touchEndTimer;

    elem.addEventListener("touchstart", function () {
        setStyle(this.firstElementChild, {
            transform: "rotateX(86deg)",
        });
        setStyle(this.firstElementChild.nextElementSibling.firstElementChild, {
            transform: "rotateX(var(--rotate-deg)) translate3d(0, 0, 0)"
        });
        setStyle(this.lastElementChild.firstElementChild, {
            transform: "rotateX(var(--rotate-deg)) translate3d(0, 0, 0)"
        });
    });
    elem.addEventListener("touchend", function () {
        setStyle(this.firstElementChild, {
            transform: "none",
        });
        setStyle(this.firstElementChild.nextElementSibling.firstElementChild, {
            transform: "none"
        });
        setStyle(this.lastElementChild.firstElementChild, {
            transform: "none"
        });
    });

    /**
     * 手机的双击和长按
     * 双击编辑todo
     * 长按切换todo的完成/未完成状态
     **/
    var click_counter = 0;
    elem.addEventListener("touchstart", function () {
        touchStartTimer = new Date();
        click_counter++;
        setTimeout(function () {
            click_counter = 0;
        }, dbltouch_interval);
        if (click_counter > 1) {
            console.log("simulate double touch on mobile...");

            click_counter = 0;

            if (!model.data.todos[index].completed) {
                /* 编辑todo */
                let todoContent = elem.lastElementChild.firstElementChild;
                let todoText = todoContent.firstElementChild;
                let currentText = todoText.innerHTML;
                let currentRotation = todoText.style.transform;
                todoText.style.display = "none";

                let todoEdit = $c('input');
                todoEdit.setAttribute("type", "text");
                todoEdit.value = currentText;
                todoEdit.classList.add("editing");
                todoEdit.style.transform = currentRotation;
                todoEdit.focus();

                todoEdit.addEventListener("blur", function () {
                    if (todoEdit.value !== "") {
                        todoText.innerHTML = todoEdit.value;
                        model.data.todos[index].content = todoEdit.value;
                        model.flush();
                        update();
                    } else {
                        alert("Invalid Input: TODO should not be empty!");
                    }
                    todoContent.removeChild(todoEdit);
                    todoText.style.display = "";
                }, false);

                todoEdit.addEventListener("keyup", function (event) {
                    if (event.keyCode != 13) {
                        return;
                    }
                    todoEdit.blur();
                }, false);

                todoContent.appendChild(todoEdit);
            }

        }
    });
    elem.addEventListener("touchend", function () {
        touchEndTimer = new Date();
        let deltaTime = touchEndTimer.getTime() - touchStartTimer.getTime();
        if (deltaTime > 500) {
            
            model.data.todos[index].completed = !model.data.todos[index].completed;
            model.flush();
            update();
        }
    });


    /**
     * 左右滑动
     * 删除单条todo
     */
    let oldTouch, touchObj;
    let isDelete = false;
    elem.addEventListener('touchstart', function (event) {
        oldTouch = event.touches[0];
        touchObj = event.currentTarget;
        isDelete = false;
    }, false);
    elem.addEventListener('touchmove', function (event) {
        let freshTouch = event.touches[0];
        let verticalOffset = freshTouch.clientY - oldTouch.clientY;

        if (Math.abs(verticalOffset) < tolerateVerticalOffset) {    // 上下滑动误差之内视作成功
            var horizontalOffset = freshTouch.clientX - oldTouch.clientX;
            touchObj.style.transition = ".2s linear";

            if (Math.abs(horizontalOffset) < deviceWidth / 3) {     //移动距离过短时不算做左滑/右滑：不判定为删除
                touchObj.style.left = horizontalOffset + 'px';
            } else {
                if (horizontalOffset < 0) {     //left
                    touchObj.style.left = -deviceWidth * 2 + 'px';
                } else {                        //right
                    touchObj.style.left = deviceWidth * 2 + 'px';
                }
                isDelete = true;
            }
        }
    }, false);
    elem.addEventListener('touchend', function (event) {
        
        if (isDelete && elem != null) {
            elem.parentNode.removeChild(elem);
            model.data.todos.splice(index, 1);

            model.flush();
            update();
        } else {
            touchObj.style.left = 0;
        }
    }, false);
}

/**
 * add todo
 **/
function addTodo(){
    let todoInput = $('todo-input')
    let inputText = todoInput.value;
    if(inputText != ""){
        todoInput.value = "";// clear input

        /* add todo in MODEL*/
        model.data.todos.push({
            content: inputText,
            time: new Date(),
            completed: false
        });

        model.flush();
        update();
    } else {
        alert("Invalid Input: TODO should not be empty!");
    }
}