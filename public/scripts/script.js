document.addEventListener('DOMContentLoaded', function () {
    // Get references to the form and input elements
    const todoForm = document.getElementById('todoForm');
    const todoList = document.getElementById('todoList');
    const taskInput = document.getElementById('task');

    // Function to render Todos
    function renderTodos() {
        axios.get('/todos')
            .then(response => {
                todoList.innerHTML = '';
                response.data.forEach(todo => {
                    const listItem = document.createElement('li');
                    listItem.textContent = todo.task;
                    if (todo.completed) {
                        listItem.classList.add('completed');
                    }
                    listItem.addEventListener('click', () => toggleComplete(todo.completed, todo.id));
                    todoList.appendChild(listItem);
                });
            })
            .catch(error => console.error(error));
    }

    function toggleComplete(completed, id) {
        console.log("================================================");
        console.log("Current Status : ",completed);
        console.log("Should be updated to Status : ",!completed);
        console.log("================================================");
        axios.put(`/todos/${id}`, { completed: !completed })
            .then(response => {
                console.log("Response : ",response);
                // Reload the page or update the UI as needed
                location.reload();
            })
            .catch(error => {
                console.error('Error marking todo as completed:', error);
            });
    }

    // Event listener for form submission
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Get the task from the input field
        const task = taskInput.value;
        axios.post('/todos', { task: task })
            .then(function (response) {
                // handle success
                console.log(response);
                taskInput.value = ''; // Clear the input field
                // Re-render todos
                renderTodos();
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    });

    // Initial rendering of Todos
    renderTodos();
});
