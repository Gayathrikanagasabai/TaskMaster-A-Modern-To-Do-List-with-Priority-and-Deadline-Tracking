const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Timer Input Fields
const hoursBox = document.getElementById("hours-box");
const minutesBox = document.getElementById("minutes-box");
const secondsBox = document.getElementById("seconds-box");

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    console.log("no task added");
    return;
  }

  // Timer values
  const hours = parseInt(hoursBox.value) || 0;
  const minutes = parseInt(minutesBox.value) || 0;
  const seconds = parseInt(secondsBox.value) || 0;
  let totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds <= 0) {
    alert("Please set a valid timer duration!");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox">
      <span>${task}</span>
    </label>
    <span class="timer">Time Left: ${formatTime(totalSeconds)}</span>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    `;

  listContainer.appendChild(li);

  // Clear the input fields
  inputBox.value = "";
  hoursBox.value = "";
  minutesBox.value = "";
  secondsBox.value = "";

  // Attach event listeners to the new task
  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");
  const timerDisplay = li.querySelector(".timer");

  // Timer functionality
  const timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      timerDisplay.textContent = `Time Left: ${formatTime(totalSeconds)}`;

      // Warnings at specific intervals
      if (totalSeconds === 60) {
        alert(`Warning! Only 1 minute left for task: "${task}"`);
      } else if (totalSeconds === 30) {
        alert(`Warning! Only 30 seconds left for task: "${task}"`);
      } else if (totalSeconds === 10) {
        alert(`Hurry up! Only 10 seconds left for task: "${task}"`);
      }
    } else {
      clearInterval(timerInterval);
      alert(`Time's up for task: "${task}"`);
      timerDisplay.textContent = "Time's Up!";
    }
  }, 1000);

  // Task completed event
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    if (checkbox.checked) {
      clearInterval(timerInterval); // Stop timer
      timerDisplay.textContent = "Task Completed!";
      alert(`Task "${task}" is completed!`);
    }
    updateCounters();
  });

  editBtn.addEventListener("click", function () {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      clearInterval(timerInterval); // Stop timer
      li.remove();
      updateCounters();
    }
  });
  updateCounters();
}

// Add task when pressing Enter key
inputBox.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Helper function to format time
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}
