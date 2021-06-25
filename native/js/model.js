/**
 * MVC架构
 * Model层
 **/
window.model = {
    data: {
        todos: [
            /**
             * Todo MODEL：存储实例
             */
        ],
        filter: "All",
    }
}

let guid = 0;   // 序号标志（全局）

/**
 * first load
 **/
function initModel(){
    update();
}

/**
 * View层
 **/
function update() {
    let activeNum = 0;
    let todoList = $('todos');
    todoList.innerHTML = '';

    model.data.todos.forEach((todo, todoIndex) => {
        if(!todo.completed){
            activeNum++;
        }

        /* filter筛选 */
        if(model.data.filter === "All" || 
          (model.data.filter === "Active" && !todo.completed) || 
          (model.data.filter === "Completed" && todo.completed)){

            var min = -3, max = 3;
            var id = guid++;
            var randRotation = parseFloat(Math.random()*(min - max + 1) + max);

            /* 通过长按add按钮，动态生成todo */
            let todoGroup = $c('div');
            todoGroup.classList.add('todo-group');
            todoGroup.setAttribute('id', "todo-" + id);
            let todoShadow = $c('div');
            todoShadow.classList.add('todo-shadow');
            let todoPaper = $c('div');
            todoPaper.classList.add('todo-paper');
            setStyle(todoPaper, {
                transform: "rotate(" + randRotation + "deg)"
            });
            let todoPaperBg = $c('div');
            todoPaperBg.classList.add('todo-paper-bg');
            todoPaper.appendChild(todoPaperBg);

            let coverContentContainer = $c('div');
            coverContentContainer.classList.add('cover-content-container');
            let coverContent = $c('div');
            coverContent.classList.add('cover-content');
            let textP = $c('p');
            textP.setAttribute('id', "todo-text-" + id);
            textP.classList.add("todo-text");
            if(todo.completed){
                textP.classList.add('completed');
            }
            setStyle(textP, {
                transform: "rotate(" + randRotation + "deg)"
            });
            textP.innerHTML = todo.content;
            coverContent.appendChild(textP);
            coverContentContainer.appendChild(coverContent);

            todoGroup.appendChild(todoShadow);
            todoGroup.appendChild(todoPaper);
            todoGroup.appendChild(coverContentContainer);

            /* 绑定监听器，每一个todo的初始化工作 */
            initTodo(todoGroup, todoIndex);

            /* 每次新增的todo插入到todo list最前面 */
            todoList.insertBefore(todoGroup, todoList.firstElementChild);
        }
    });

    /* 更新todos left计数器 */
    let todoCounter = $('todo-counter');
    todoCounter.innerHTML = (activeNum || 'No') + ' ' + (activeNum > 1 ? 'todos' : 'todo') + ' left'
}