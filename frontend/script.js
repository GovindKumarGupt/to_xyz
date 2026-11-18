const API = "http://localhost:8000/todos";

let todos = [];

// Which task is currently being edited (null = none)
let editingId = null;

const list = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const summary = document.getElementById("summary");
const empty = document.getElementById("empty");
const error = document.getElementById("error");

// Any failed request (e.g. backend not running) shows the error message
window.addEventListener("unhandledrejection", () => {
  error.hidden = false;
});

function makeButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = `btn btn-sm ${className}`.trim();
  btn.addEventListener("click", onClick);
  return btn;
}

// Add a new task
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const res = await fetch(`${API}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  todos.push(await res.json());
  input.value = "";
  render();
});

// View all tasks
function render() {
  list.innerHTML = "";
  error.hidden = true;

  const done = todos.filter((t) => t.completed).length;
  summary.textContent = todos.length
    ? `${done} of ${todos.length} completed`
    : "";
  empty.hidden = todos.length > 0;

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " done" : "");

    // Mark a task as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", async () => {
      await updateTodo(todo, { completed: checkbox.checked });
      render();
    });
    li.appendChild(checkbox);

    if (editingId === todo.id) {
      // Edit a task (edit mode)
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "todo-title";
      editInput.value = todo.title;

      const save = async () => {
        const newTitle = editInput.value.trim();
        if (newTitle) await updateTodo(todo, { title: newTitle });
        editingId = null;
        render();
      };
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") {
          editingId = null;
          render();
        }
      });

      const actions = document.createElement("div");
      actions.className = "actions";
      actions.append(
        makeButton("Save", "btn-primary", save),
        makeButton("Cancel", "", () => {
          editingId = null;
          render();
        })
      );

      li.append(editInput, actions);
      list.appendChild(li);
      editInput.focus();
      return;
    }

    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.title;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      makeButton("Edit", "", () => {
        editingId = todo.id;
        render();
      }),
      // Delete a task
      makeButton("Delete", "btn-danger", async () => {
        await fetch(`${API}/${todo.id}`, { method: "DELETE" });
        todos = todos.filter((t) => t.id !== todo.id);
        render();
      })
    );

    li.append(title, actions);
    list.appendChild(li);
  });
}

// Send a change to the backend, then update the task shown on the page
async function updateTodo(todo, changes) {
  const res = await fetch(`${API}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  Object.assign(todo, await res.json());
}

// Load all tasks from the database when the page opens or refreshes
async function loadTodos() {
  const res = await fetch(`${API}/`);
  todos = await res.json();
  render();
}

loadTodos();
