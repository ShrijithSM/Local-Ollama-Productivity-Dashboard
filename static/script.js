// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      // Update active nav item
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Show active section (mobile only)
      const sectionId = item.dataset.section;
      document.querySelectorAll('.mobile-sections .section').forEach(section => section.classList.remove('active'));
      
      // Map navigation to mobile sections
      let targetSection;
      if (sectionId === 'youtube') {
        targetSection = document.getElementById('youtube-mobile');
      } else {
        targetSection = document.getElementById(sectionId + '-mobile');
      }
      
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  // Handle Enter key in inputs
  const userInput = document.getElementById('userInput');
  const userInputMobile = document.getElementById('userInput-mobile');
  const taskInput = document.getElementById('taskInput');
  const taskInputMobile = document.getElementById('taskInput-mobile');

  if (userInput) {
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  if (userInputMobile) {
    userInputMobile.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessageMobile();
    });
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }

  if (taskInputMobile) {
    taskInputMobile.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }

  // Initialize
  updateTimer();
  renderTodos();
  renderTodosMobile();
});

// Chatbot
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  const button = document.querySelector('.chat-input button');
  const spinner = button.querySelector('.loading-spinner');
  const btnText = button.querySelector('.btn-text');

  try {
    // Show loading state
    input.disabled = true;
    button.disabled = true;
    spinner.style.display = 'block';
    btnText.style.display = 'none';

    chatbox.innerHTML += `<div class="message user"><strong>You:</strong> ${message}</div>`;
    input.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error('Failed to get response');

    const data = await res.json();
    chatbox.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${data.response}</div>`;
  } catch (error) {
    chatbox.innerHTML += `<div class="message error"><strong>Error:</strong> ${error.message}</div>`;
  } finally {
    // Reset loading state
    input.disabled = false;
    button.disabled = false;
    spinner.style.display = 'none';
    btnText.style.display = 'block';
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}

// Mobile chat functionality
async function sendMessageMobile() {
  const input = document.getElementById("userInput-mobile");
  const message = input.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox-mobile");
  const button = document.querySelector('#chatbot-mobile .chat-input button');
  const spinner = button.querySelector('.loading-spinner');
  const btnText = button.querySelector('.btn-text');

  try {
    // Show loading state
    input.disabled = true;
    button.disabled = true;
    spinner.style.display = 'block';
    btnText.style.display = 'none';

    chatbox.innerHTML += `<div class="message user"><strong>You:</strong> ${message}</div>`;
    input.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error('Failed to get response');

    const data = await res.json();
    chatbox.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${data.response}</div>`;
  } catch (error) {
    chatbox.innerHTML += `<div class="message error"><strong>Error:</strong> ${error.message}</div>`;
  } finally {
    // Reset loading state
    input.disabled = false;
    button.disabled = false;
    spinner.style.display = 'none';
    btnText.style.display = 'block';
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}

// ToDo List with Local Storage
const todos = JSON.parse(localStorage.getItem('todos') || '[]');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  
  if (taskText !== "") {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    
    todos.push(task);
    saveTodos();
    renderTodos();
    renderTodosMobile();
    taskInput.value = "";
  }
}

function toggleTask(id) {
  const task = todos.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTodos();
    renderTodos();
    renderTodosMobile();
  }
}

function deleteTask(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    renderTodosMobile();
  }
}

function renderTodos() {
  const taskList = document.getElementById("taskList");
  if (taskList) {
    taskList.innerHTML = todos.map(task => `
      <li class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
        <span>${task.text}</span>
        <button onclick="event.stopPropagation(); deleteTask(${task.id})" class="btn-secondary">
          ❌
        </button>
      </li>
    `).join('');
  }
}

function renderTodosMobile() {
  const taskList = document.getElementById("taskList-mobile");
  if (taskList) {
    taskList.innerHTML = todos.map(task => `
      <li class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
        <span>${task.text}</span>
        <button onclick="event.stopPropagation(); deleteTask(${task.id})" class="btn-secondary">
          ❌
        </button>
      </li>
    `).join('');
  }
}

// Pomodoro Timer
let timer;
let time = 25 * 60;
let isRunning = false;

function updateTimer() {
  const min = String(Math.floor(time / 60)).padStart(2, "0");
  const sec = String(time % 60).padStart(2, "0");
  
  // Update both desktop and mobile timers
  const desktopTimer = document.getElementById("timer");
  const mobileTimer = document.getElementById("timer-mobile");
  
  if (desktopTimer) desktopTimer.innerText = `${min}:${sec}`;
  if (mobileTimer) mobileTimer.innerText = `${min}:${sec}`;
  
  if (time > 0) {
    time--;
  } else {
    clearInterval(timer);
    isRunning = false;
    if (Notification.permission === "granted") {
      new Notification("Time's up!", {
        body: "Your Pomodoro session is complete!",
        icon: "🍅"
      });
    }
  }
}

function startPomodoro() {
  if (!isRunning) {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    isRunning = true;
    
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

function resetPomodoro() {
  clearInterval(timer);
  isRunning = false;
  time = 25 * 60;
  updateTimer();
}
