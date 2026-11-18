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
const summary = document.getElementById("summary");
const empty = document.getElementById("empty");

function makeButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = `btn btn-sm ${className}`.trim();
  btn.addEventListener("click", onClick);
  return btn;
}

// Add a new task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  todos.push({ id: nextId, title, completed: false });
  input.value = "";
  render();
});

// View all tasks
function render() {
  list.innerHTML = "";

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
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      render();
    });
    li.appendChild(checkbox);

    if (editingId === todo.id) {
      // Edit a task (edit mode)
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "todo-title";
      editInput.value = todo.title;

      const save = () => {
        const newTitle = editInput.value.trim();
        if (newTitle) todo.title = newTitle;
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
      makeButton("Delete", "btn-danger", () => {
        todos = todos.filter((t) => t.id !== todo.id);
        render();
      })
    );

    li.append(title, actions);
    list.appendChild(li);
  });
}

render();
