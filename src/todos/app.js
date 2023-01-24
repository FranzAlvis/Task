import todoStore, { Filters } from "../store/todo.store";
import html from "./app.html?raw";
import { renderTodos } from "./use-cases";
import { renderPending } from "./use-cases/render-pending";

const ElemenIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompletedButton: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count'
}

export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElemenIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElemenIDs.PendingCountLabel);
    }

    (() => {
        const app = document.createElement("div");
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //referencias HTML
    const newDescriptionInput = document.querySelector(ElemenIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElemenIDs.TodoList);
    const ClearCompletedButton = document.querySelector(ElemenIDs.ClearCompletedButton);
    const filterLIs = document.querySelectorAll(ElemenIDs.TodoFilters);

    //listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;
        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener("click", (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    todoListUL.addEventListener("click", (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if (!isDestroyElement || !element) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    ClearCompletedButton.addEventListener("click", () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filterLIs.forEach(element => {
        element.addEventListener("click", (element) => {
            filterLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');
            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }
            displayTodos();
        })
    });

}