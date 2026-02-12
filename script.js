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
}