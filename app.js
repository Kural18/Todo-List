var tasksArray = [];
var completedArray = [];
var categoriesArray = [];

var form = document.getElementById('input-form');
var list = document.getElementById('todo-list');
var input = document.getElementById('input');
var completedList = document.getElementById('completed-list');
var getDueDate = document.getElementById('inputDueDate');
var getPriority = document.getElementById('priority-dropdown');
var getCategory = document.getElementById('category');
var categoryList = document.getElementById('category-list');

var id_generator = 0;

function saveTasksToLocalStorage() {
  localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  localStorage.setItem('completedArray', JSON.stringify(completedArray));
}

function saveCategoriesToLocalStorage() {
  localStorage.setItem('categoriesArray', JSON.stringify(categoriesArray));
}

function deleteItem(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  if (index > -1) {
    tasksArray.splice(index, 1);
  }
  saveTasksToLocalStorage();
  display(tasksArray);

  const deletedCategory = deletedTask.category;
  const checkDuplicate = tasksArray.some(task => task.category === deletedCategory);

  if (!checkDuplicate) {
    removeCategory(deletedCategory);
    displayCategories(); 
    display(tasksArray);
  }
}

function markAsDone(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  if (index > -1) {
    const completedTask = tasksArray[index];
    tasksArray[index].is_completed = true;
    tasksArray.splice(index, 1);
    completedArray.push(completedTask);
    saveTasksToLocalStorage();
    display(tasksArray);
    displayCompleted();
  }
}

function unMarkAsDone(id) {
  const index = completedArray.findIndex(todo => todo.id === id);
  if (index > -1) {
    const unDoneTask = completedArray[index];
    completedArray[index].is_completed = false;
    completedArray.splice(index, 1);
    tasksArray.push(unDoneTask);
    saveTasksToLocalStorage();
    display(tasksArray);
    displayCompleted();
  }
}

function updateItem(id) {
  const index = tasksArray.findIndex(todo => todo.id === id);
  //console.log(index);
  //console.log(tasksArray[index].text);

  const liElem = document.querySelectorAll('#todo-list li')[index];
  const paraElem = liElem.querySelector('p');
  console.log(paraElem);
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.value = paraElem.textContent;
  liElem.replaceChild(inputElement, paraElem);

  inputElement.addEventListener('input', (event) => {
    paraElem.textContent = event.target.value;
  });
  
  inputElement.addEventListener('change', (event) => {
    const updatedText = event.target.value;
    liElem.replaceChild(paraElem, inputElement);
    if (updatedText !== paraElem.textContent) {
      tasksArray[index].text = updatedText;
      saveTasksToLocalStorage();
    }
  });
  
  inputElement.addEventListener('blur', (event) => {
    liElem.replaceChild(paraElem, inputElement);
  });
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
    console.log('hii');
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

    const textDiv = document.createElement('div');
    textDiv.className = 'list_items_div';

    const para = document.createElement('p');
    para.innerText = task.text;
    textDiv.appendChild(para);

    const divButtons = document.createElement('div');
    divButtons.className = 'div_buttons'

    const deleteButton = document.createElement('button'); // a button to delete tasks from the todo list
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash';
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function() {
      deleteItem(task.id);
    });
    divButtons.appendChild(deleteButton);

    const editButton = document.createElement('button'); // a button to edit tasks from the todo list
    const editIcon = document.createElement('i');
    editIcon.className = 'fa fa-edit';
    editButton.appendChild(editIcon);
    editButton.addEventListener('click', function() {
      updateItem(task.id);
    });
    divButtons.appendChild(editButton);

    const doneButton = document.createElement('button'); // a button to mark tasks as done
    const doneIcon = document.createElement('i');
    doneIcon.className = 'fa fa-check';
    doneButton.appendChild(doneIcon);
    doneButton.addEventListener('click', function() {
      markAsDone(task.id);
    });
    divButtons.appendChild(doneButton);
    textDiv.appendChild(divButtons);
    li.appendChild(textDiv);
    
    li.appendChild(secondDiv);

    list.appendChild(li);
  });
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
          category: getCategory.value || 'Default'
        }
        id_generator++;
        tasksArray.push(newItem);
        saveTasksToLocalStorage();
        input.value = '';
        getDueDate.value = '';
        getPriority.value = 'low';
        getCategory.value = '';
        
        categoriesArray = Array.from(new Set(tasksArray.map(task => task.category)));

        display(tasksArray);
        displayCategories();
    }
});


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

  console.log("hii");
  display(filteredTasks);
}

function unfilterTasks() {
  document.getElementById('dueDateFrom').value = '';
  document.getElementById('dueDateTo').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('priorityFilter').value = '';

  display(tasksArray);
}

document.getElementById('filterBtn').addEventListener('click', function() {
  applyFilters();
});

document.getElementById('unfilterBtn').addEventListener('click', function() {
  unfilterTasks();
});

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

function loadDataFromLocalStorage() {
  getTasksFromLocalStorage();

  // Initialize categoriesArray with unique categories from tasksArray
  categoriesArray = Array.from(new Set(tasksArray.map(task => task.category)));

  display(tasksArray);
  displayCompleted();
  displayCategories();
}


document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);
