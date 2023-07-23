var tasksArray = [];
var completedArray = [];
var categoriesArray = [];
var activityLogs = [];

var form = document.getElementById('input-form');
var list = document.getElementById('todo-list');
var input = document.getElementById('input');
var completedList = document.getElementById('completed-list');
var getDueDate = document.getElementById('inputDueDate');
var getPriority = document.getElementById('priority-dropdown');
var getCategory = document.getElementById('category');
var categoryList = document.getElementById('category-list');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

var id_generator = 0;
var subtask_id_generator = 0;

function saveTasksToLocalStorage() {
  localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  localStorage.setItem('completedArray', JSON.stringify(completedArray));
}

function saveCategoriesToLocalStorage() {
  localStorage.setItem('categoriesArray', JSON.stringify(categoriesArray));
}

function saveActivitiesToLocalStorage() {
  localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
}

function deleteItem(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  const deletedTask = tasksArray[index];
  if (index > -1) {
    tasksArray.splice(index, 1);
  }
  saveTasksToLocalStorage();
  display(tasksArray);

  const deletedCategory = deletedTask.text;
  const checkDuplicate = tasksArray.some(task => task.category === deletedCategory);

  if (!checkDuplicate) {
    removeCategory(deletedCategory);
    displayCategories(); 
    display(tasksArray);
  }
  logActivity('Deleted', deletedTask);
}

function markAsDone(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  const logTask = tasksArray[index];
  if (index > -1) {
    const completedTask = tasksArray[index];
    tasksArray[index].is_completed = true;
    tasksArray.splice(index, 1);
    completedArray.push(completedTask);
    saveTasksToLocalStorage();
    display(tasksArray);
    displayCompleted();
  }
  logActivity('Mark As Done', logTask);
}

function unMarkAsDone(id) {
  const index = completedArray.findIndex(todo => todo.id === id);
  const logTask = tasksArray[index];
  if (index > -1) {
    const unDoneTask = completedArray[index];
    completedArray[index].is_completed = false;
    completedArray.splice(index, 1);
    tasksArray.push(unDoneTask);
    saveTasksToLocalStorage();
    display(tasksArray);
    displayCompleted();
  }
  logActivity('Un mark as done', logTask);
}

function updateItem(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  const logTask = tasksArray[index];
  //console.log(index);
  //console.log(tasksArray[index].text);

  const liElem = document.querySelectorAll('#todo-list li')[index];
  console.log(liElem);
  const divElem = liElem.querySelectorAll('div')[0];
  const paraElem = divElem.querySelector('p');
  console.log(paraElem);
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.value = paraElem.textContent;
  divElem.replaceChild(inputElement, paraElem);

  inputElement.addEventListener('input', (event) => {
    paraElem.textContent = event.target.value;
  });
  
  inputElement.addEventListener('change', (event) => {
    const updatedText = event.target.value;
    tasksArray[index].text = updatedText;
    saveTasksToLocalStorage();
    divElem.replaceChild(paraElem, inputElement);
  });
  
  inputElement.addEventListener('blur', (event) => {
    divElem.replaceChild(paraElem, inputElement);
  });
  logActivity('Updated', logTask);
}

function getTodayDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function removeCategory(category) {
  const index = categoriesArray.indexOf(category);
  if (index > -1) {
    categoriesArray.splice(index, 1);
    saveCategoriesToLocalStorage();
  }
}

function displayCategories() {
  categoryList.innerHTML = '';
  categoriesArray.forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    categoryList.appendChild(li);
  });
}


function display(tasksToDisplay) {
  list.innerHTML = '';

  tasksToDisplay.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'list_items';

    const secondDiv = document.createElement('div');
    secondDiv.className = 'second_child_li'
    const categoryDiv = document.createElement('div');
    categoryDiv.innerText = 'Category: ' + task.category; 
    categoryDiv.className = 'category_name_in_task';
    secondDiv.appendChild(categoryDiv);
    const dueDateDiv = document.createElement('div');
    dueDateDiv.innerText = `Due Date: ${task.dueDate}`; 
    dueDateDiv.className = 'due-date';
    secondDiv.appendChild(dueDateDiv);
    const tagsDiv = document.createElement('div');
    tagsDiv.innerText = `Tags: `;
    task.tags.forEach((tag) => tagsDiv.innerText +=(tag + ', '));
    secondDiv.appendChild(tagsDiv);

    const textDiv = document.createElement('div');
    textDiv.className = 'list_items_div';

    const para = document.createElement('p');
    para.innerText = task.text;
    textDiv.appendChild(para);

    const divButtons = document.createElement('div');
    divButtons.className = 'div_buttons';

    const deleteButton = document.createElement('button'); // a button to delete tasks from the todo list
    deleteButton.className = 'task_all_buttons'
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash';
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function() {
      deleteItem(task.id);
    });
    divButtons.appendChild(deleteButton);

    const editButton = document.createElement('button'); // a button to edit tasks from the todo list
    editButton.className = 'task_all_buttons';
    const editIcon = document.createElement('i');
    editIcon.className = 'fa fa-edit';
    editButton.appendChild(editIcon);
    editButton.addEventListener('click', function() {
      updateItem(task.id);
    });
    divButtons.appendChild(editButton);

    const doneButton = document.createElement('button'); // a button to mark tasks as done
    doneButton.className = 'task_all_buttons';
    const doneIcon = document.createElement('i');
    doneIcon.className = 'fa fa-check';
    doneButton.appendChild(doneIcon);
    doneButton.addEventListener('click', function() {
      markAsDone(task.id);
    });
    divButtons.appendChild(doneButton);
    
    const subtaskBtn = document.createElement('button');
    subtaskBtn.className = 'task_all_buttons';
    const addIcon = document.createElement('i');
    addIcon.className = 'fa fa-plus';
    subtaskBtn.appendChild(addIcon);
    subtaskBtn.addEventListener('click', function() {
      const subtaskInput = document.createElement('input');
      subtaskInput.type = 'text';
      subtaskInput.placeholder = 'Enter subtask';
      subtaskInput.className = 'subtask-input';

      const subtaskSubmitBtn = document.createElement('button');
      subtaskSubmitBtn.textContent = 'Submit';
      subtaskSubmitBtn.className = 'btn btn-primary';
      subtaskSubmitBtn.addEventListener('click', function() {
        const subtaskText = subtaskInput.value.trim();
        if (subtaskText !== '') {
          addSubtask(task.id, subtaskText);
          li.removeChild(subtaskInput);
          li.removeChild(subtaskSubmitBtn);
        }
      });

      divButtons.appendChild(subtaskInput);
      divButtons.appendChild(subtaskSubmitBtn);
    });
    divButtons.appendChild(subtaskBtn);
    textDiv.appendChild(divButtons);
    
    li.appendChild(textDiv);
    li.appendChild(secondDiv);
    list.appendChild(li);

    if (task.subtasks.length > 0) {
      const subtasksList = document.createElement('ul');
      subtasksList.className = 'subtasks-list';

      task.subtasks.forEach(subtask => {
        const subtaskLi = document.createElement('li');
        
        const subtaskCheckbox = document.createElement('input');
        subtaskCheckbox.type = 'checkbox';
        subtaskCheckbox.checked = subtask.is_completed;
        subtaskCheckbox.addEventListener('change', function () {
          markOrDeleteSubtask(task.id, subtask.id, this.checked);
        });
        subtaskLi.appendChild(subtaskCheckbox);

        const subtaskText = document.createElement('span');
        subtaskText.textContent = subtask.text;
        subtaskLi.appendChild(subtaskText);

        subtasksList.appendChild(subtaskLi);
      });

      li.appendChild(subtasksList);
    }
  });
}


function addSubtask(mainTaskId, subtaskText) {
  const mainTask = tasksArray.find(task => task.id === mainTaskId);
  if (mainTask) {
    const subtask = {
      id: subtask_id_generator,
      text: subtaskText,
      is_completed: false 
    };
    mainTask.subtasks.push(subtask);
    subtask_id_generator++; 
    saveTasksToLocalStorage();
    display(tasksArray);
    logActivity('Subtask Added', mainTask);
  }
}

function markOrDeleteSubtask(mainTaskId, subtaskId, isCompleted) {
  const mainTask = tasksArray.find(task => task.id === mainTaskId);
  if (mainTask) {
    const subtaskIndex = mainTask.subtasks.findIndex(subtask => subtask.id === subtaskId);
    if (subtaskIndex !== -1) {
      if (isCompleted) {
        mainTask.subtasks.splice(subtaskIndex, 1);
      } else {
        mainTask.subtasks[subtaskIndex].is_completed = false;
      }
      saveTasksToLocalStorage();
      display(tasksArray);
      logActivity('Subtask Marked As Undone', mainTask);
    }
  }
}


function displayCompleted() {
  completedList.innerHTML = '';

  completedArray.forEach(task => {
    const li = document.createElement('li');
    li.className = 'completed_items';
    const para = document.createElement('p');
    para.textContent = task.text;
    li.appendChild(para);

    const unDoneButton = document.createElement('button'); // a button to mark tasks as done
    const unDoneIcon = document.createElement('i');
    unDoneIcon.className = 'fa fa-check';
    unDoneButton.appendChild(unDoneIcon);
    unDoneButton.addEventListener('click', function() {
      unMarkAsDone(task.id);
    });
    li.appendChild(unDoneButton);
    completedList.appendChild(li);
  })
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    var item = document.getElementById('input').value;
    if(item!="") {
        const newItem = {
          id : id_generator,
          text : item,
          is_completed: false,
          priority: getPriority.value || "low",
          dueDate: getDueDate.value || getTodayDate(),
          category: getCategory.value || 'Default',
          tags: getTagsArrayFromInput(),
          subtasks: []
        }
        id_generator++;
        tasksArray.push(newItem);
        saveTasksToLocalStorage();
        input.value = '';
        getDueDate.value = '';
        getPriority.value = 'low';
        getCategory.value = '';
        document.getElementById('tags').value = '';
        
        categoriesArray = Array.from(new Set(tasksArray.map(task => task.category)));

        display(tasksArray);
        displayCategories();
        logActivity('Added', tasksArray[id_generator-1]);
    }
});

function getTagsArrayFromInput() {
  const tagsInputValue = document.getElementById('tags').value;
  return tagsInputValue.split(',').map(tag => tag.trim());
}


function applyFilters() {
  const dueDateFromValue = document.getElementById('dueDateFrom').value;
  const dueDateToValue = document.getElementById('dueDateTo').value;
  const categoryFilterValue = document.getElementById('categoryFilter').value.trim().toLowerCase(); 
  const priorityFilterValue = document.getElementById('priorityFilter').value;

  const filteredTasks = tasksArray.filter(task => {
    const dueDateMatch = (
      (!dueDateFromValue || task.dueDate >= dueDateFromValue) &&
      (!dueDateToValue || task.dueDate <= dueDateToValue)
    );
    const categoryMatch = categoryFilterValue === '' || task.category.toLowerCase().includes(categoryFilterValue); 
    const priorityMatch = priorityFilterValue === '' || task.priority === priorityFilterValue;
    return dueDateMatch && categoryMatch && priorityMatch;
  });

  display(filteredTasks);
}

function unfilterTasks() {
  document.getElementById('dueDateFrom').value = '';
  document.getElementById('dueDateTo').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('priorityFilter').value = '';

  display(tasksArray);
}

function sortTasks(sortOption) {
  switch (sortOption) {
    case 'dueDate':
      tasksArray.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case 'priority':
      tasksArray.sort((a, b) => {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      break;
    case 'Created first':
      tasksArray.sort((a, b) => a.id - b.id);
      break;
    default:
      tasksArray.sort((a, b) => a.id - b.id);
  }
}

function displayBacklogs() {
  const today = new Date();
  const filteredTasks = tasksArray.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return !task.is_completed && dueDate < today;
  });

  display(filteredTasks);
}

function displayActivityLogs() {
  const activityLogsList = document.getElementById('activity-logs');
  activityLogsList.innerHTML = '';
  activityLogs.forEach(log => {
    const li = document.createElement('li');
    li.textContent = `${log.timestamp} - ${log.action}: ${log.task.text}`;
    activityLogsList.appendChild(li);
  });
}

function logActivity(action, task) {
  const timestamp = new Date().toLocaleString();
  const activity = {
    timestamp: timestamp,
    action: action,
    task: task
  };
  activityLogs.push(activity);
  displayActivityLogs();
  saveActivitiesToLocalStorage();
}

function toggleActivityLogs() {
  const activityLogsList = document.getElementById('activity-logs');
  const logsButton = document.getElementById('toggleLogsBtn');
  if (activityLogsList.style.display === 'none') {
    activityLogsList.style.display = 'block';
    logsButton.textContent = 'Hide Activity Logs';
  } else {
    activityLogsList.style.display = 'none';
    logsButton.textContent = 'Show Activity Logs';
  }
}

function handleSearch() {
  const searchText = searchInput.value.toLowerCase().trim();
  const filteredTasks = tasksArray.filter(task => {
  const taskName = task.text.toLowerCase();
  const subtask = task.subtasks.map(subtask => subtask.text.toLowerCase()).join(' ');
  const tags = task.tags.join(' ').toLowerCase();
  const taskMatches = taskName === searchText;
  const subtaskMatches = subtask.includes(searchText);
  const tagsMatches = tags.includes(searchText);
  return taskMatches || subtaskMatches || tagsMatches;
});

  display(filteredTasks);
}

document.getElementById('filterBtn').addEventListener('click', function() {
  if(filterBtn.textContent === 'Filter'){
    applyFilters();
    filterBtn.textContent = 'View All Tasks';
  } else {
    display(tasksArray);
    filterBtn.textContent = 'Filter';
  }
});

document.getElementById('sortBtn').addEventListener('click', function() {
  const sortOption = document.getElementById('sort-dropdown').value;
  sortTasks(sortOption);
  display(tasksArray);
});

document.getElementById('viewBacklogsBtn').addEventListener('click', function() {
  const viewBacklogsBtn = document.getElementById('viewBacklogsBtn');
  if (viewBacklogsBtn.textContent === 'View Backlogs') {
    displayBacklogs();
    viewBacklogsBtn.textContent = 'View All Tasks';
  } else {
    display(tasksArray); 
    viewBacklogsBtn.textContent = 'View Backlogs';
  }
});

searchButton.addEventListener('click', function(){
  if(searchButton.textContent === 'Search'){
    searchButton.textContent = 'Cancel';
    handleSearch();
  } else {
    searchButton.textContent = 'Search';
    display(tasksArray);
  }
});

document.getElementById('toggleLogsBtn').addEventListener('click', toggleActivityLogs);

function getTasksFromLocalStorage() {
  const tasksArrayString = localStorage.getItem('tasksArray');
  if (tasksArrayString) {
    tasksArray = JSON.parse(tasksArrayString);
    id_generator = tasksArray.length > 0 ? tasksArray[tasksArray.length - 1].id + 1 : 0;
    display(tasksArray);
  }

  const completedArrayString = localStorage.getItem('completedArray');
  //console.log(completedArrayString);
  if (completedArrayString) {
    completedArray = JSON.parse(completedArrayString);
    displayCompleted();
  }
}

function loadActivityLogsFromLocalStorage() {
  const activityLogsString = localStorage.getItem('activityLogs');
  if (activityLogsString) {
    activityLogs = JSON.parse(activityLogsString);
    displayActivityLogs();
  }
}

function loadDataFromLocalStorage() {
  getTasksFromLocalStorage();
  loadActivityLogsFromLocalStorage();

  // Initialize categoriesArray with unique categories from tasksArray
  categoriesArray = Array.from(new Set(tasksArray.map(task => task.category)));

  display(tasksArray);
  displayCompleted();
  displayCategories();
}


document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);
