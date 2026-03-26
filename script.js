let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let searchQuery = "";

// Load dark mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    let matchesFilter =
      filter === "all" ||
      (filter === "completed" && t.completed) ||
      (filter === "pending" && !t.completed);

    let matchesSearch =
      t.text.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  filtered.forEach((task, i) => {
    const li = document.createElement("li");
    li.draggable = true;

    li.innerHTML = `
      <div onclick="toggle(${i})">
        ${task.text}<br>
        <small>${task.date || ""}</small>
      </div>
      <div>
        <button onclick="edit(${i})">✏️</button>
        <button onclick="del(${i})">❌</button>
      </div>
    `;

    li.className = task.completed ? "completed" : "";

    li.ondragstart = () => dragStart(i);
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = () => dropTask(i);

    list.appendChild(li);
  });

  document.getElementById("counter").innerText =
    "Tasks: " + tasks.length;
}

let dragIndex;

function dragStart(i) {
  dragIndex = i;
}

function dropTask(i) {
  let temp = tasks[dragIndex];
  tasks[dragIndex] = tasks[i];
  tasks[i] = temp;
  save();
  render();
}

function addTask() {
  let text = document.getElementById("taskInput").value;
  let date = document.getElementById("dueDate").value;

  if (!text) return;

  tasks.push({ text, date, completed: false });
  save();
  render();
  showToast("Task Added 🚀");

  document.getElementById("taskInput").value = "";
}

function del(i) {
  tasks.splice(i, 1);
  save();
  render();
  showToast("Deleted ❌");
}

function toggle(i) {
  tasks[i].completed = !tasks[i].completed;
  save();
  render();
}

function edit(i) {
  let newText = prompt("Edit task:", tasks[i].text);
  if (newText) {
    tasks[i].text = newText;
    save();
    render();
  }
}

function filterTasks(type) {
  filter = type;
  render();
}

// ✅ FIXED SEARCH
function searchTasks() {
  searchQuery = document.getElementById("search").value.toLowerCase();
  render();
}

// 🌙 SAVE DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
}

render();