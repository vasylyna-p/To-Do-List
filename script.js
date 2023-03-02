const listContainer = document.querySelector('.all-lists');
const addListInput = document.querySelector('.add-list-input');
const addListButton = document.querySelector('#add-list-btn');
const deleteListButton = document.querySelector('#delete-list-btn');
const displayContainer = document.querySelector('#display-container');
const listTitleElement = document.querySelector('#selected-list-title');
const tasksCountElement = document.querySelector('#tasks-count-element')
const tasksContainer = document.querySelector('#tasks');
const addTaskButton = document.querySelector('#add-task-button');
const addTaskInput = document.querySelector('.add-task-input');
const clearCompletedTasksButton = document.querySelector('#clear-completed-tasks-btn');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let myLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.id;
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = myLists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTasksCount(selectedList);
    }
})

addListButton.addEventListener('click', e => {
    e.preventDefault();
    const newListName = addListInput.value;
    if (newListName === null || newListName === '') {
        return;
    }
    const list = createList(newListName);
    myLists.push(list);
    addListInput.value = '';
    saveAndRender();
}
);

addTaskButton.addEventListener('click', e => {
    e.preventDefault();
    const newTaskName = addTaskInput.value;
    if (newTaskName === null || newTaskName === '') {
        return;
    }
    const newTask = createTask(newTaskName);
    const selectedList = myLists.find(list => list.id === selectedListId);
    selectedList.tasks.push(newTask);
    addTaskInput.value = '';
    saveAndRender();
})

deleteListButton.addEventListener('click', () => {
    myLists = myLists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

clearCompletedTasksButton.addEventListener('click', () => {
    const selectedList = myLists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
};

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}


function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myLists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElement(listContainer);
    renderLists();

    const selectedList = myLists.find(list => list.id === selectedListId);
    if (selectedListId == null) {
        displayContainer.style.display = "none";
    }
    else {
        displayContainer.style.display = "";
        listTitleElement.innerText = selectedList.name;
        renderTasksCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    const tasks = selectedList.tasks;
    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task';
        tasksContainer.appendChild(taskContainer);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        taskContainer.appendChild(checkbox);
        const taskLabel = document.createElement('label');
        taskLabel.htmlFor = task.id;
        taskLabel.innerHTML = `<span class="custom-checkbox"></span> ${task.name}`;
        taskContainer.appendChild(taskLabel);
    })
}

function renderTasksCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
    tasksCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
    myLists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.id = list.id;
        listElement.classList.add('list-title');
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        listContainer.appendChild(listElement);
    })
};

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    };
};

render();