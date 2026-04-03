<<<<<<< HEAD
// ============================================
// WAIT FOR PAGE TO LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    initApp();
});

// ============================================
// TASK MANAGEMENT SYSTEM
// ============================================
let tasks = [];
let currentFilter = 'all';

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadTasks() {
    const saved = localStorage.getItem('taskify_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        console.log('Loaded tasks:', tasks);
    } else {
        // Create demo tasks
        tasks = [
            {
                id: Date.now() + 1,
                title: "Review Q4 Marketing Strategy",
                description: "Analyze campaign performance and plan next quarter",
                priority: "high",
                date: getTodayDate(),
                tag: "work",
                completed: false,
                starred: true
            },
            {
                id: Date.now() + 2,
                title: "Update Project Documentation",
                description: "Add API endpoints and usage examples",
                priority: "medium",
                date: getTodayDate(),
                tag: "work",
                completed: false,
                starred: false
            }
        ];
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem('taskify_tasks', JSON.stringify(tasks));
    console.log('Tasks saved:', tasks);
    updateUI();
}

// ============================================
// INITIALIZE APP
// ============================================
function initApp() {
    loadTasks();
    setupUserProfile();
    setupHeader();
    setupSidebar();
    setupModal();
    updateUI();
    console.log('App initialized!');
}

// ============================================
// POMODORO TIMER
// ============================================

let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60; // 25 minutes
let isPomodorRunning = false;
let pomodoroCount = parseInt(localStorage.getItem('pomodoroCount')) || 0;

const pomodoroModes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroSeconds / 60);
    const seconds = pomodoroSeconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.textContent = display;
    
    // Update count
    const countDisplay = document.getElementById('pomodoroCount');
    if (countDisplay) countDisplay.textContent = pomodoroCount;
}

function startPomodoro() {
    if (isPomodorRunning) return;
    
    isPomodorRunning = true;
    document.getElementById('startTimer').disabled = true;
    document.getElementById('pauseTimer').disabled = false;
    
    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;
        updatePomodoroDisplay();
        
        if (pomodoroSeconds <= 0) {
            stopPomodoro();
            pomodoroCount++;
            localStorage.setItem('pomodoroCount', pomodoroCount);
            updatePomodoroDisplay();
            alert('🎉 Pomodoro completed! Time for a break!');
        }
    }, 1000);
}

function pausePomodoro() {
    isPomodorRunning = false;
    clearInterval(pomodoroInterval);
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
}

function resetPomodoro() {
    pausePomodoro();
    const activeMode = document.querySelector('.mode-btn.active').dataset.mode;
    pomodoroSeconds = pomodoroModes[activeMode];
    updatePomodoroDisplay();
}

function stopPomodoro() {
    pausePomodoro();
    resetPomodoro();
}

// Pomodoro Modal
const pomodoroCard = document.getElementById('pomodoroCard');
const pomodoroModal = document.getElementById('pomodoroModal');
const closePomodoroModal = document.getElementById('closePomodoroModal');

if (pomodoroCard) {
    pomodoroCard.onclick = () => {
        pomodoroModal.classList.add('active');
        updatePomodoroDisplay();
    };
}

if (closePomodoroModal) {
    closePomodoroModal.onclick = () => {
        pomodoroModal.classList.remove('active');
        pausePomodoro();
    };
}

if (pomodoroModal) {
    pomodoroModal.onclick = (e) => {
        if (e.target === pomodoroModal) {
            pomodoroModal.classList.remove('active');
            pausePomodoro();
        }
    };
}

// Timer controls
const startTimer = document.getElementById('startTimer');
const pauseTimer = document.getElementById('pauseTimer');
const resetTimer = document.getElementById('resetTimer');

if (startTimer) startTimer.onclick = startPomodoro;
if (pauseTimer) pauseTimer.onclick = pausePomodoro;
if (resetTimer) resetTimer.onclick = resetPomodoro;

// Mode buttons
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = function() {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const mode = this.dataset.mode;
        pomodoroSeconds = pomodoroModes[mode];
        
        const labels = {
            focus: 'Focus Time',
            short: 'Short Break',
            long: 'Long Break'
        };
        
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) timerLabel.textContent = labels[mode];
        
        pausePomodoro();
        updatePomodoroDisplay();
    };
});

// Initialize
updatePomodoroDisplay();

// ============================================
// EXPORT TASKS
// ============================================

function exportTasksAsJSON() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskify-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportTasksAsCSV() {
    let csv = 'Title,Description,Priority,Due Date,Tag,Status\n';
    
    tasks.forEach(task => {
        const row = [
            `"${task.title}"`,
            `"${task.description || ''}"`,
            task.priority,
            task.date,
            task.tag,
            task.completed ? 'Completed' : 'Pending'
        ];
        csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskify-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.onclick = () => {
        const choice = confirm('Export as CSV?\n\nOK = CSV\nCancel = JSON');
        if (choice) {
            exportTasksAsCSV();
        } else {
            exportTasksAsJSON();
        }
    };
}

// ============================================
// USER PROFILE
// ============================================
function setupUserProfile() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('Welcome! What is your name?') || 'User';
        localStorage.setItem('userName', userName);
    }
    
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.textContent = userName.charAt(0).toUpperCase();
        profileBtn.onclick = function() {
            const newName = prompt('Enter your new name:', userName);
            if (newName && newName.trim()) {
                localStorage.setItem('userName', newName.trim());
                this.textContent = newName.charAt(0).toUpperCase();
            }
        };
    }
}

// ============================================
// HEADER BUTTONS
// ============================================
function setupHeader() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.onclick = () => sidebar.classList.toggle('closed');
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.onclick = function() {
            const query = prompt('Search tasks:');
            if (query) {
                const results = tasks.filter(t => 
                    t.title.toLowerCase().includes(query.toLowerCase())
                );
                alert(`Found ${results.length} task(s)`);
            }
        };
    }
    
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        notifBtn.onclick = function() {
            const overdue = tasks.filter(t => !t.completed && t.date < getTodayDate()).length;
            const today = tasks.filter(t => !t.completed && t.date === getTodayDate()).length;
            alert(`📋 ${today} tasks due today\n⚠️ ${overdue} overdue tasks`);
        };
    }
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        // Check if dark mode was previously enabled
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
        
        themeBtn.onclick = function() {
            this.style.transform = 'rotate(180deg)';
            setTimeout(() => this.style.transform = 'rotate(0deg)', 300);
            
            // Toggle dark mode
            document.body.classList.toggle('dark-mode');
            
            // Save preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                console.log('Dark mode enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                console.log('Light mode enabled');
            }
        };
    }
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };
    });
}

function updateMetrics() {
    const today = getTodayDate();
    
    // Tasks Today
    const todayTasks = tasks.filter(t => t.date === today && !t.completed).length;
    const metricTodayEl = document.getElementById('metricToday');
    if (metricTodayEl) metricTodayEl.textContent = todayTasks;
    
    // Weekly Progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekTasks = tasks.filter(t => t.date >= weekStartStr);
    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekProgress = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
    
    const metricWeeklyEl = document.getElementById('metricWeekly');
    if (metricWeeklyEl) metricWeeklyEl.textContent = weekProgress + '%';
    
    // Productivity (completed tasks in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const recentTasks = tasks.filter(t => t.date >= sevenDaysStr);
    const recentCompleted = recentTasks.filter(t => t.completed).length;
    const productivity = recentTasks.length > 0 ? Math.round((recentCompleted / recentTasks.length) * 100) : 0;
    
    const metricProductivityEl = document.getElementById('metricProductivity');
    if (metricProductivityEl) metricProductivityEl.textContent = productivity + '%';
    
    // Streak (consecutive days with completed tasks)
    let streak = calculateStreak();
    const metricStreakEl = document.getElementById('metricStreak');
    if (metricStreakEl) metricStreakEl.textContent = streak + ' days';
}

function calculateStreak() {
    if (tasks.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.date === dateStr);
        const dayCompleted = dayTasks.filter(t => t.completed);
        
        if (dayTasks.length > 0 && dayCompleted.length > 0) {
            streak++;
        } else if (i > 0) {
            break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

// ============================================
// SIDEBAR
// ============================================
function setupSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.onclick = function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const text = this.textContent.toLowerCase();
            if (text.includes('today')) currentFilter = 'today';
            else if (text.includes('important')) currentFilter = 'important';
            else if (text.includes('completed')) currentFilter = 'completed';
            else currentFilter = 'all';
            
            updateUI();
        };
    });
    
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(item => {
        item.onclick = function() {
            const tag = this.textContent.trim().toLowerCase();
            currentFilter = `tag-${tag}`;
            updateUI();
        };
    });
}

// ============================================
// MODAL
// ============================================
function setupModal() {
    const modal = document.getElementById('taskModal');
    const newTaskBtn = document.querySelector('.new-task-btn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelTask');
    const taskForm = document.getElementById('taskForm');
    const dateInput = document.getElementById('taskDate');
    
    if (!modal || !newTaskBtn || !taskForm) {
        console.error('Modal elements not found!');
        return;
    }
    
    // Set today's date
    if (dateInput) dateInput.value = getTodayDate();
    
    // Open modal
    newTaskBtn.onclick = function() {
        console.log('Opening modal...');
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
    };
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        taskForm.reset();
        if (dateInput) dateInput.value = getTodayDate();
    };
    
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    // Submit form
    taskForm.onsubmit = function(e) {
        e.preventDefault();
        
        const newTask = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value || '',
            priority: document.getElementById('taskPriority').value,
            date: document.getElementById('taskDate').value,
            tag: document.getElementById('taskTag').value,
            completed: false,
            starred: false
        };
        
        console.log('Creating task:', newTask);
        tasks.push(newTask);
        saveTasks();
        closeModal();
        alert('✅ Task created successfully!');
    };
    
    // Filter dropdown
    const filterSelect = document.querySelector('.task-filter');
    if (filterSelect) {
        filterSelect.onchange = function() {
            const value = this.value.toLowerCase();
            currentFilter = value === 'all tasks' ? 'all' : value;
            updateUI();
        };
    }
}

// ============================================
// UPDATE UI
// ============================================
function updateUI() {
    console.log('Updating UI...');
    updateStats();
    updateSidebarCounts();
    updateMetrics();
    renderTasks();
    renderCharts();
}

function updateStats() {
    const today = getTodayDate();
    
    // Today's tasks
    const todayTasks = tasks.filter(t => t.date === today && !t.completed);
    const todayCompleted = tasks.filter(t => t.date === today && t.completed);
    const todayTotal = todayTasks.length + todayCompleted.length;
    const todayProgress = todayTotal > 0 ? Math.round((todayCompleted.length / todayTotal) * 100) : 0;
    
    const todayCountEl = document.getElementById('todayCount');
    const todayProgressEl = document.getElementById('todayProgress');
    const todayBarEl = document.getElementById('todayProgressBar');
    
    if (todayCountEl) todayCountEl.textContent = todayTasks.length;
    if (todayProgressEl) todayProgressEl.textContent = todayProgress + '%';
    if (todayBarEl) todayBarEl.style.width = todayProgress + '%';
    
    // Overdue
    const overdue = tasks.filter(t => t.date < today && !t.completed);
    const overdueEl = document.getElementById('overdueCount');
    if (overdueEl) overdueEl.textContent = overdue.length;
    
    // Completed
    const completed = tasks.filter(t => t.completed);
    const completedProgress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    
    const completedCountEl = document.getElementById('completedCount');
    const completedProgressEl = document.getElementById('completedProgress');
    const completedBarEl = document.getElementById('completedProgressBar');
    
    if (completedCountEl) completedCountEl.textContent = completed.length;
    if (completedProgressEl) completedProgressEl.textContent = completedProgress + '%';
    if (completedBarEl) completedBarEl.style.width = completedProgress + '%';
    
    console.log('Stats updated:', { todayTasks: todayTasks.length, overdue: overdue.length, completed: completed.length });
}

function updateSidebarCounts() {
    const today = getTodayDate();
    const todayCount = tasks.filter(t => t.date === today && !t.completed).length;
    const importantCount = tasks.filter(t => t.starred && !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const countSpan = item.querySelector('.count');
        if (!countSpan) return;
        
        if (text.includes('today')) countSpan.textContent = todayCount;
        else if (text.includes('important')) countSpan.textContent = importantCount;
        else if (text.includes('completed')) countSpan.textContent = completedCount;
    });
}

function renderTasks() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    let filtered = [...tasks];
    const today = getTodayDate();
    
    // Filter
    if (currentFilter === 'today') {
        filtered = tasks.filter(t => t.date === today);
    } else if (currentFilter === 'important') {
        filtered = tasks.filter(t => t.starred);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    } else if (currentFilter.startsWith('tag-')) {
        const tag = currentFilter.replace('tag-', '');
        filtered = tasks.filter(t => t.tag === tag);
    }
    
    // Sort
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.date) - new Date(b.date);
    });
    
    taskList.innerHTML = '';
    
    if (filtered.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">No tasks found. Create one!</p>';
        return;
    }
    
    filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const priorityClass = task.priority;
        const date = new Date(task.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        div.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}"></label>
            </div>
            <div class="task-content">
                <h4>${task.title}</h4>
                <p>${task.description || 'No description'}</p>
                <div class="task-meta">
                    <span class="priority ${priorityClass}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        </svg>
                        ${task.priority}
                    </span>
                    <span class="task-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${dateStr}
                    </span>
                    <span class="task-tag">${task.tag}</span>
                </div>
            </div>
            <button class="task-star">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${task.starred ? '#f59e0b' : 'none'}" stroke="${task.starred ? '#f59e0b' : '#9ca3af'}" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </button>
        `;
        
        // Checkbox
        const checkbox = div.querySelector('input');
        checkbox.onchange = function() {
            task.completed = this.checked;
            saveTasks();
        };
        
        // Star
        const star = div.querySelector('.task-star');
        star.onclick = function() {
            task.starred = !task.starred;
            saveTasks();
        };
        
        taskList.appendChild(div);
    });
    
    console.log('Rendered', filtered.length, 'tasks');
}

// ============================================
// CHARTS
// ============================================
let completionChart = null;
let priorityChart = null;
let weeklyChart = null;

function renderCharts() {
    renderCompletionChart();
    renderPriorityChart();
    renderWeeklyChart();
}

function renderCompletionChart() {
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = tasks.filter(t => !t.completed).length;
    
    const options = {
        series: [completed, incomplete],
        chart: {
            type: 'donut',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        },
        labels: ['Completed', 'Incomplete'],
        colors: ['#10b981', '#f59e0b'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 600,
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Tasks',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6b7280',
                            formatter: function (w) {
                                return tasks.length;
                            }
                        },
                        value: {
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#1f2937',
                        }
                    }
                }
            }
        }
    };
    
    if (completionChart) {
        completionChart.destroy();
    }
    
    const chartEl = document.querySelector("#completionChart");
    if (chartEl) {
        completionChart = new ApexCharts(chartEl, options);
        completionChart.render();
    }
}

function renderPriorityChart() {
    const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const medium = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
    const low = tasks.filter(t => t.priority === 'low' && !t.completed).length;
    
    const options = {
        series: [{
            name: 'Tasks',
            data: [high, medium, low]
        }],
        chart: {
            type: 'bar',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: false,
                columnWidth: '60%',
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['High', 'Medium', 'Low'],
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Tasks',
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6b7280'
                }
            }
        },
        colors: ['#ef4444', '#f59e0b', '#0891b2'],
        legend: {
            show: false
        },
        grid: {
            borderColor: '#e5e7eb',
        }
    };
    
    if (priorityChart) {
        priorityChart.destroy();
    }
    
    const chartEl = document.querySelector("#priorityChart");
    if (chartEl) {
        priorityChart = new ApexCharts(chartEl, options);
        priorityChart.render();
    }
}

function renderWeeklyChart() {
    // Get last 7 days
    const days = [];
    const completed = [];
    const created = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push(dayName);
        
        const completedCount = tasks.filter(t => 
            t.completed && t.date === dateStr
        ).length;
        
        const createdCount = tasks.filter(t => 
            t.date === dateStr
        ).length;
        
        completed.push(completedCount);
        created.push(createdCount);
    }
    
    const options = {
        series: [
            {
                name: 'Tasks Created',
                data: created
            },
            {
                name: 'Tasks Completed',
                data: completed
            }
        ],
        chart: {
            type: 'area',
            height: 300,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#0891b2', '#10b981'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: days,
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    colors: '#6b7280'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Tasks',
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6b7280'
                }
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#6b7280'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '14px',
            fontWeight: 600,
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return value + ' tasks';
                }
            }
        }
    };
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const chartEl = document.querySelector("#weeklyChart");
    if (chartEl) {
        weeklyChart = new ApexCharts(chartEl, options);
        weeklyChart.render();
    }
=======
// ============================================
// MODERN TASKIFY - ENHANCED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Taskify Modern - Loaded!');
    initApp();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// TASK MANAGEMENT SYSTEM
// ============================================
let tasks = [];
let currentFilter = 'all';

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadTasks() {
    const saved = localStorage.getItem('taskify_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        console.log('📋 Loaded tasks:', tasks.length);
    } else {
        tasks = [
            {
                id: Date.now() + 1,
                title: "Design New Dashboard UI",
                description: "Create wireframes and mockups for the new modern interface",
                priority: "high",
                date: getTodayDate(),
                tag: "work",
                completed: false,
                starred: true
            },
            {
                id: Date.now() + 2,
                title: "Team Meeting",
                description: "Discuss Q4 goals and project timelines",
                priority: "medium",
                date: getTodayDate(),
                tag: "work",
                completed: false,
                starred: false
            },
            {
                id: Date.now() + 3,
                title: "Gym Session",
                description: "Evening workout routine",
                priority: "low",
                date: getTodayDate(),
                tag: "personal",
                completed: false,
                starred: false
            }
        ];
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem('taskify_tasks', JSON.stringify(tasks));
    updateUI();
    showNotification('Tasks updated!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; bottom: 24px; right: 24px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white; padding: 12px 24px; border-radius: 40px;
        font-weight: 600; font-size: 14px; z-index: 9999;
        transform: translateY(100px); opacity: 0;
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateY(0)'; notification.style.opacity = '1'; }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function initApp() {
    loadTasks();
    setupUserProfile();
    setupHeader();
    setupSidebar();
    setupModal();
    setupKeyboardShortcuts();
    setupDragDrop();
    updateUI();
    console.log('🚀 App initialized!');
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.querySelector('.new-task-btn')?.click();
        }
        if (e.key === 'Escape') {
            const modal = document.getElementById('taskModal');
            if (modal?.classList.contains('active')) modal.classList.remove('active');
        }
    });
}

function setupDragDrop() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    let draggedItem = null;
    taskList.addEventListener('dragstart', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) { draggedItem = taskItem; taskItem.style.opacity = '0.5'; }
    });
    taskList.addEventListener('dragend', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) taskItem.style.opacity = '1';
    });
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (taskItem && taskItem !== draggedItem) taskItem.style.border = '2px dashed #3b82f6';
    });
    taskList.addEventListener('dragleave', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) taskItem.style.border = '';
    });
    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (taskItem && taskItem !== draggedItem) {
            taskItem.style.border = '';
            showNotification('Task reordered!', 'success');
        }
    });
}

function setupUserProfile() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('Welcome to Taskify Modern! What is your name?') || 'User';
        localStorage.setItem('userName', userName);
    }
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.textContent = userName.charAt(0).toUpperCase();
        const hue = (userName.length * 10) % 360;
        profileBtn.style.background = `linear-gradient(135deg, hsl(${hue}, 80%, 60%), hsl(${hue + 30}, 80%, 60%))`;
        profileBtn.onclick = function() {
            const newName = prompt('Edit your name:', userName);
            if (newName && newName.trim()) {
                localStorage.setItem('userName', newName.trim());
                this.textContent = newName.charAt(0).toUpperCase();
                showNotification('Profile updated!', 'success');
            }
        };
    }
}

function setupHeader() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.onclick = () => {
            sidebar.classList.toggle('closed');
            showNotification(sidebar.classList.contains('closed') ? 'Sidebar hidden' : 'Sidebar shown', 'info');
        };
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.onclick = function() {
            const query = prompt('🔍 Search tasks:');
            if (query) {
                const results = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
                if (results.length > 0) {
                    showNotification(`Found ${results.length} task(s)`, 'success');
                    results.forEach(task => {
                        const taskEl = document.querySelector(`[data-task-id="${task.id}"]`);
                        if (taskEl) {
                            taskEl.style.boxShadow = '0 0 0 3px #3b82f6';
                            taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.task-item').forEach(item => item.style.boxShadow = '');
                    }, 3000);
                } else {
                    showNotification('No tasks found', 'info');
                }
            }
        };
    }
    
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        notifBtn.onclick = function() {
            const overdue = tasks.filter(t => !t.completed && t.date < getTodayDate()).length;
            const today = tasks.filter(t => !t.completed && t.date === getTodayDate()).length;
            this.style.transform = 'scale(1.1)';
            setTimeout(() => this.style.transform = '', 200);
            showNotification(`📋 ${today} tasks today • ⚠️ ${overdue} overdue`, 'info');
        };
    }
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            updateThemeIcon(themeBtn, true);
        }
        themeBtn.onclick = function() {
            this.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => this.style.transform = '', 300);
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            updateThemeIcon(this, isDark);
            showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
        };
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    targetElement.style.boxShadow = '0 0 0 3px #3b82f6';
                    setTimeout(() => targetElement.style.boxShadow = '', 1000);
                }
            }
        };
    });
}

function updateThemeIcon(btn, isDark) {
    btn.innerHTML = isDark ? 
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>' :
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function updateMetrics() {
    const today = getTodayDate();
    const todayTasks = tasks.filter(t => t.date === today && !t.completed).length;
    const metricTodayEl = document.getElementById('metricToday');
    if (metricTodayEl) metricTodayEl.textContent = todayTasks;
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekTasks = tasks.filter(t => t.date >= weekStartStr);
    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekProgress = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
    const metricWeeklyEl = document.getElementById('metricWeekly');
    if (metricWeeklyEl) metricWeeklyEl.textContent = weekProgress + '%';
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];
    const recentTasks = tasks.filter(t => t.date >= sevenDaysStr);
    const recentCompleted = recentTasks.filter(t => t.completed).length;
    const productivity = recentTasks.length > 0 ? Math.round((recentCompleted / recentTasks.length) * 100) : 0;
    const metricProductivityEl = document.getElementById('metricProductivity');
    if (metricProductivityEl) metricProductivityEl.textContent = productivity + '%';
    
    let streak = 0;
    let currentDate = new Date();
    for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.date === dateStr);
        const dayCompleted = dayTasks.filter(t => t.completed);
        if (dayTasks.length > 0 && dayCompleted.length > 0) streak++;
        else if (i > 0 && dayTasks.length > 0 && dayCompleted.length === 0) break;
        else if (i > 0) break;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    const metricStreakEl = document.getElementById('metricStreak');
    if (metricStreakEl) metricStreakEl.textContent = streak + ' days';
}

function setupSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.onclick = function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const text = this.textContent.toLowerCase();
            if (text.includes('today')) currentFilter = 'today';
            else if (text.includes('important')) currentFilter = 'important';
            else if (text.includes('completed')) currentFilter = 'completed';
            else currentFilter = 'all';
            updateUI();
            showNotification(`Showing ${currentFilter} tasks`, 'info');
        };
    });
    
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(item => {
        item.onclick = function() {
            const tag = this.textContent.trim().toLowerCase();
            currentFilter = `tag-${tag}`;
            updateUI();
            tagItems.forEach(t => t.style.background = '');
            this.style.background = 'rgba(59, 130, 246, 0.15)';
            showNotification(`Filtering by: ${tag}`, 'info');
        };
    });
}

// ============================================
// MODAL - WITH DATABASE SAVE
// ============================================
function setupModal() {
    const modal = document.getElementById('taskModal');
    const newTaskBtn = document.querySelector('.new-task-btn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelTask');
    const taskForm = document.getElementById('taskForm');
    const dateInput = document.getElementById('taskDate');
    
    if (!modal || !newTaskBtn || !taskForm) {
        console.error('Modal elements not found!');
        return;
    }
    
    // Set today's date and restrict past dates
    if (dateInput) {
        dateInput.value = getTodayDate();
        dateInput.min = getTodayDate();  // 👈 Prevents selecting past dates
        
        // Extra protection: if user manually types a past date
        dateInput.addEventListener('change', function() {
            if (this.value < getTodayDate()) {
                alert('❌ Cannot select past dates!');
                this.value = getTodayDate();
            }
        });
    }
    
    newTaskBtn.onclick = function() {
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    };
    
    const closeModal = () => {
        modal.classList.remove('active');
        taskForm.reset();
        if (dateInput) dateInput.value = getTodayDate();
    };
    
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    
    taskForm.onsubmit = function(e) {
        e.preventDefault();
        
        const taskTitle = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskPriority = document.getElementById('taskPriority').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskTag = document.getElementById('taskTag').value;
        
        // Check if date is past (extra validation)
        if (taskDate < getTodayDate()) {
            alert('❌ Cannot create task with past date!');
            return;
        }
        
        console.log('📝 Creating task:', taskTitle);
        
        const newTask = {
            id: Date.now(),
            title: taskTitle,
            description: taskDescription || '',
            priority: taskPriority,
            date: taskDate,
            tag: taskTag,
            completed: false,
            starred: false
        };
        tasks.push(newTask);
        saveTasks();
        
        fetch('tasks_api.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                title: taskTitle,
                description: taskDescription,
                priority: taskPriority,
                date: taskDate,
                tag: taskTag
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('✅ Task saved to DATABASE! ID:', data.task_id);
            } else {
                console.log('❌ Database error:', data.message);
            }
        })
        .catch(error => console.error('Fetch error:', error));
        
        closeModal();
        showNotification('✅ Task created successfully!', 'success');
    };
    
    const filterSelect = document.querySelector('.task-filter');
    if (filterSelect) {
        filterSelect.onchange = function() {
            const value = this.value.toLowerCase();
            currentFilter = value === 'all tasks' ? 'all' : value;
            updateUI();
        };
    }
}

function updateUI() {
    updateStats();
    updateSidebarCounts();
    updateMetrics();
    renderTasks();
    renderCharts();
}

function updateStats() {
    const today = getTodayDate();
    const todayTasks = tasks.filter(t => t.date === today && !t.completed);
    const todayCompleted = tasks.filter(t => t.date === today && t.completed);
    const todayTotal = todayTasks.length + todayCompleted.length;
    const todayProgress = todayTotal > 0 ? Math.round((todayCompleted.length / todayTotal) * 100) : 0;
    
    const todayCountEl = document.getElementById('todayCount');
    if (todayCountEl) todayCountEl.textContent = todayTasks.length;
    const todayProgressEl = document.getElementById('todayProgress');
    if (todayProgressEl) todayProgressEl.textContent = todayProgress + '%';
    const todayBarEl = document.getElementById('todayProgressBar');
    if (todayBarEl) todayBarEl.style.width = todayProgress + '%';
    
    const overdue = tasks.filter(t => t.date < today && !t.completed);
    const overdueEl = document.getElementById('overdueCount');
    if (overdueEl) overdueEl.textContent = overdue.length;
    
    const completed = tasks.filter(t => t.completed);
    const completedProgress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    const completedCountEl = document.getElementById('completedCount');
    if (completedCountEl) completedCountEl.textContent = completed.length;
    const completedProgressEl = document.getElementById('completedProgress');
    if (completedProgressEl) completedProgressEl.textContent = completedProgress + '%';
    const completedBarEl = document.getElementById('completedProgressBar');
    if (completedBarEl) completedBarEl.style.width = completedProgress + '%';
}

function updateSidebarCounts() {
    const today = getTodayDate();
    const todayCount = tasks.filter(t => t.date === today && !t.completed).length;
    const importantCount = tasks.filter(t => t.starred && !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const countSpan = item.querySelector('.count');
        if (!countSpan) return;
        if (text.includes('today')) countSpan.textContent = todayCount;
        else if (text.includes('important')) countSpan.textContent = importantCount;
        else if (text.includes('completed')) countSpan.textContent = completedCount;
    });
}

function renderTasks() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    let filtered = [...tasks];
    const today = getTodayDate();
    
    if (currentFilter === 'today') filtered = tasks.filter(t => t.date === today);
    else if (currentFilter === 'important') filtered = tasks.filter(t => t.starred);
    else if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
    else if (currentFilter.startsWith('tag-')) {
        const tag = currentFilter.replace('tag-', '');
        filtered = tasks.filter(t => t.tag === tag);
    }
    
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.date) - new Date(b.date);
    });
    
    taskList.innerHTML = '';
    
    if (filtered.length === 0) {
        taskList.innerHTML = `<div style="text-align: center; padding: 3rem; color: #94a3b8;"><h3>No tasks found</h3><p>Click "New Task" to create one!</p></div>`;
        return;
    }
    
    filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.setAttribute('draggable', 'true');
        div.setAttribute('data-task-id', task.id);
        
        const date = new Date(task.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        div.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}"></label>
            </div>
            <div class="task-content">
                <h4>${escapeHtml(task.title)}</h4>
                <p>${escapeHtml(task.description || 'No description')}</p>
                <div class="task-meta">
                    <span class="priority ${task.priority}">${task.priority}</span>
                    <span class="task-date">📅 ${dateStr}</span>
                    <span class="task-tag">${task.tag}</span>
                </div>
            </div>
            <div class="task-buttons">
                <button class="task-edit-btn" data-id="${task.id}">✏️ Edit</button>
                <button class="task-delete-btn" data-id="${task.id}">🗑️ Delete</button>
            </div>
            <button class="task-star">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${task.starred ? '#f59e0b' : 'none'}" stroke="${task.starred ? '#f59e0b' : '#94a3b8'}" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </button>
        `;
        
        const checkbox = div.querySelector('input');
        checkbox.onchange = function() {
            task.completed = this.checked;
            saveTasks();
            showNotification(this.checked ? '✅ Task completed!' : '🔄 Task reopened', 'success');
        };
        
        const star = div.querySelector('.task-star');
        star.onclick = function() {
            task.starred = !task.starred;
            saveTasks();
            showNotification(task.starred ? '⭐ Added to important' : '☆ Removed from important', 'info');
        };
        
        // Edit button
        const editBtn = div.querySelector('.task-edit-btn');
        editBtn.onclick = function() {
            const newTitle = prompt('Edit task title:', task.title);
            if (newTitle && newTitle.trim()) {
                task.title = newTitle.trim();
                saveTasks();
                showNotification('Task updated!', 'success');
            }
        };
        
        // Delete button
        const deleteBtn = div.querySelector('.task-delete-btn');
        deleteBtn.onclick = function() {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                showNotification('Task deleted!', 'success');
            }
        };
        
        // Keep double-click edit as backup
        div.ondblclick = function() {
            const newTitle = prompt('Edit task title:', task.title);
            if (newTitle && newTitle.trim()) {
                task.title = newTitle.trim();
                saveTasks();
                showNotification('Task updated!', 'success');
            }
        };
        
        taskList.appendChild(div);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Charts
let completionChart = null, priorityChart = null, weeklyChart = null;

function renderCharts() {
    renderCompletionChart();
    renderPriorityChart();
    renderWeeklyChart();
}

function renderCompletionChart() {
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = tasks.filter(t => !t.completed).length;
    const chartEl = document.querySelector("#completionChart");
    if (!chartEl) return;
    if (completionChart) completionChart.destroy();
    completionChart = new ApexCharts(chartEl, {
        series: [completed, incomplete],
        chart: { type: 'donut', height: 280 },
        labels: ['Completed', 'Incomplete'],
        colors: ['#10b981', '#f59e0b']
    });
    completionChart.render();
}

function renderPriorityChart() {
    const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const medium = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
    const low = tasks.filter(t => t.priority === 'low' && !t.completed).length;
    const chartEl = document.querySelector("#priorityChart");
    if (!chartEl) return;
    if (priorityChart) priorityChart.destroy();
    priorityChart = new ApexCharts(chartEl, {
        series: [{ name: 'Tasks', data: [high, medium, low] }],
        chart: { type: 'bar', height: 280 },
        xaxis: { categories: ['High', 'Medium', 'Low'] },
        colors: ['#ef4444', '#f59e0b', '#10b981']
    });
    priorityChart.render();
}

function renderWeeklyChart() {
    const days = [];
    const completed = [];
    const created = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        completed.push(tasks.filter(t => t.completed && t.date === dateStr).length);
        created.push(tasks.filter(t => t.date === dateStr).length);
    }
    const chartEl = document.querySelector("#weeklyChart");
    if (!chartEl) return;
    if (weeklyChart) weeklyChart.destroy();
    weeklyChart = new ApexCharts(chartEl, {
        series: [{ name: 'Created', data: created }, { name: 'Completed', data: completed }],
        chart: { type: 'area', height: 300 },
        colors: ['#3b82f6', '#10b981'],
        xaxis: { categories: days }
    });
    weeklyChart.render();
}

// 3D Tilt Effect
document.querySelectorAll('.stat-card, .metric-card, .access-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Particle System
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(59, 130, 246, ${Math.random() * 0.3})`
        });
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

async function fetchNotifications() {
    try {
        const response = await fetch('get_notifications.php');
        const data = await response.json();
        const badge = document.getElementById('notificationBadge');
        if (badge && data.unread_count) {
            if (data.unread_count > 0) {
                badge.textContent = data.unread_count > 9 ? '9+' : data.unread_count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (error) { console.error('Failed to fetch notifications:', error); }
}

function setupNotifications() {
    const notifBtn = document.getElementById('notificationBtn');
    const panel = document.getElementById('notificationPanel');
    if (!notifBtn) return;
    fetchNotifications();
    setInterval(fetchNotifications, 30000);
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (panel && !panel.contains(e.target) && e.target !== notifBtn) panel.style.display = 'none';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNotifications);
} else {
    setupNotifications();
}

// ============================================
// WORKING EXPORT BUTTON (near logout)
// ============================================

function exportTasksToText() {
    if (!tasks || tasks.length === 0) {
        alert('No tasks to export!');
        return;
    }
    
    let content = "TASKIFY EXPORT\n";
    content += "Date: " + new Date().toLocaleString() + "\n";
    content += "================================\n\n";
    
    tasks.forEach((task, index) => {
        content += (index + 1) + ". " + task.title + "\n";
        content += "   Due: " + task.date + "\n";
        content += "   Priority: " + task.priority + "\n";
        content += "   Status: " + (task.completed ? "COMPLETED" : "PENDING") + "\n";
        content += "   Tag: " + task.tag + "\n\n";
    });
    
    content += "Total: " + tasks.length + " tasks\n";
    content += "Completed: " + tasks.filter(t => t.completed).length + "\n";
    content += "Pending: " + tasks.filter(t => !t.completed).length;
    
    const blob = new Blob([content], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "taskify_tasks_" + new Date().toISOString().slice(0,10) + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
    
    alert("✅ Exported " + tasks.length + " tasks!");
}

// Add export button near logout
const exportBtn = document.createElement('button');
exportBtn.innerHTML = '📄 Export';
exportBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-left: 10px;';
exportBtn.onclick = exportTasksToText;

const profileSection = document.querySelector('.profile-section');
if (profileSection) {
    profileSection.appendChild(exportBtn);
} else {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        headerActions.appendChild(exportBtn);
    }
>>>>>>> nolanding-version
}