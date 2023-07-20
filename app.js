var Array = [];

var form = document.getElementById('input-form');
var list = document.getElementById('todo-list');
var input = document.getElementById('input');

var id_generator = 0;



function deleteItem(id) {
  const index = Array.findIndex(todo => todo.id === id);
  if (index > -1) {
    Array.splice(index, 1);
  }
}

function updateItem(id) {
  const index = Array.findIndex(todo => todo.id === id);
  //console.log(index);
  //console.log(Array[index].text);

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
      Array[index].text = updatedText;
    }
  });
  
  inputElement.addEventListener('blur', (event) => {
    liElem.replaceChild(paraElem, inputElement);
  });
}

fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => {
    // Process the received data
    data.forEach((item) => {
      const newItem = {
        id : id_generator,
        text : item.title
      }
      id_generator++;
      Array.push(newItem);
      const li = document.createElement('li');
      li.className = 'list_items';
      const para = document.createElement('p');
      para.innerText = newItem.text;

      li.appendChild(para);

      const button = document.createElement('button');
      const icon = document.createElement('i');
      icon.className = 'fa fa-trash';
      button.appendChild(icon);
      button.addEventListener('click', function () {
        deleteItem(newItem.id);
        li.remove();
      })

      li.appendChild(button);

      const editButton = document.createElement("button");
        const Updateicon = document.createElement('i');
        Updateicon.className = 'fa fa-edit';
        editButton.appendChild(Updateicon);
        editButton.addEventListener("click", function() {
          updateItem(newItem.id);
        });
        li.appendChild(editButton);

      list.appendChild(li);
    })
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request
    console.log('Error:', error.message);
  });



form.addEventListener('submit', function(event) {
    event.preventDefault();

    var item = document.getElementById('input').value;
    if(item!="") {
        const newItem = {
          id : id_generator,
          text : item
        }
        id_generator++;
        Array.push(newItem);

        const li = document.createElement('li');
        li.className = 'list_items'
        const para = document.createElement('p');
        para.innerText = item;

        li.appendChild(para);
        
        const button = document.createElement('button');
        const icon = document.createElement('i');
        icon.className = 'fa fa-trash';
        button.appendChild(icon);
        button.addEventListener('click', function() {
          deleteItem(newItem.id);
          li.remove();
        });
        li.appendChild(button);
        
        input.value = '';

        const editButton = document.createElement("button");
        const Updateicon = document.createElement('i');
        Updateicon.className = 'fa fa-edit';
        editButton.appendChild(Updateicon);
        editButton.addEventListener("click", function() {
          updateItem(newItem.id)
        });
        li.appendChild(editButton);

        list.appendChild(li);
    }
});


