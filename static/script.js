// Chatbot
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  chatbox.innerHTML += `<div><strong>Bot:</strong> ${data.response}</div>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ToDo List
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  if (taskInput.value.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = taskInput.value;
    li.onclick = () => li.remove();
    taskList.appendChild(li);
    taskInput.value = "";
  }
}

// Pomodoro Timer
let timer;
let time = 25 * 60;

function updateTimer() {
  const min = String(Math.floor(time / 60)).padStart(2, "0");
  const sec = String(time % 60).padStart(2, "0");
  document.getElementById("timer").innerText = `${min}:${sec}`;
  if (time > 0) time--;
  else clearInterval(timer);
}

function startPomodoro() {
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function resetPomodoro() {
  clearInterval(timer);
  time = 25 * 60;
  updateTimer();
}

updateTimer(); // show default time
