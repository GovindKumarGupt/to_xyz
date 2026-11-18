// Sample data for now. Later, replace this with data fetched from the backend.
let todos = [
  { id: 1, title: "Learn FastAPI", completed: false },
  { id: 2, title: "Build the frontend", completed: true },
  { id: 3, title: "Build the backend", completed: false },
];

// Which task is currently being edited (null = none)
let editingId = null;

const list = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");

// 5. Add a new task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  todos.push({ id: nextId, title, completed: false });
  input.value = "";
  render();
});

// 1. View all tasks
function render() {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("done");

    // 2. Mark a task as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      render();
    });
    li.appendChild(checkbox);

    if (editingId === todo.id) {
      // 3. Edit a task (edit mode)
      const editInput = document.createElement("input");
      editInput.className = "edit-input";
      editInput.value = todo.title;

      const save = document.createElement("button");
      save.textContent = "Save";
      save.addEventListener("click", () => {
        const newTitle = editInput.value.trim();
        if (newTitle) todo.title = newTitle;
        editingId = null;
        render();
      });

      const cancel = document.createElement("button");
      cancel.textContent = "Cancel";
      cancel.addEventListener("click", () => {
        editingId = null;
        render();
      });

      li.append(editInput, save, cancel);
    } else {
      const span = document.createElement("span");
      span.textContent = todo.title;

      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.addEventListener("click", () => {
        editingId = todo.id;
        render();
      });

      // 4. Delete a task
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        todos = todos.filter((t) => t.id !== todo.id);
        render();
      });

      li.append(span, edit, del);
    }

    list.appendChild(li);
  });
}

render();
