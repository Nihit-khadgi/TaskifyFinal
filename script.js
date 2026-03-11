// ============================================
// MODERN TASKIFY - ENHANCED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Taskify Modern - Loaded!');
    initApp();
    
    // Add smooth page transitions
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
        // Create demo tasks with modern styling
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
    
    // Show save animation
    showNotification('Tasks updated!', 'success');
}

// ============================================
// MODERN NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `modern-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
        <div class="notification-message">${message}</div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
    setupKeyboardShortcuts();
    setupDragDrop();
    updateUI();
    console.log('🚀 App initialized!');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N for new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.querySelector('.new-task-btn')?.click();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('taskModal');
            if (modal?.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }
        
        // / to focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            showNotification('Press Ctrl+K to search', 'info');
        }
    });
}

// ============================================
// DRAG AND DROP FOR TASKS
// ============================================
function setupDragDrop() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    let draggedItem = null;
    
    taskList.addEventListener('dragstart', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            draggedItem = taskItem;
            taskItem.style.opacity = '0.5';
        }
    });
    
    taskList.addEventListener('dragend', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            taskItem.style.opacity = '1';
        }
    });
    
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (taskItem && taskItem !== draggedItem) {
            taskItem.style.border = '2px dashed #3b82f6';
        }
    });
    
    taskList.addEventListener('dragleave', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            taskItem.style.border = '';
        }
    });
    
    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (taskItem && taskItem !== draggedItem) {
            taskItem.style.border = '';
            
            // Reorder tasks (you can implement actual reordering logic here)
            showNotification('Task reordered!', 'success');
        }
    });
}

// ============================================
// USER PROFILE WITH AVATAR
// ============================================
function setupUserProfile() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('Welcome to Taskify Modern! What is your name?') || 'User';
        localStorage.setItem('userName', userName);
    }
    
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.textContent = userName.charAt(0).toUpperCase();
        
        // Add gradient background based on name
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

// ============================================
// HEADER BUTTONS WITH ENHANCED INTERACTIONS
// ============================================
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
                const results = tasks.filter(t => 
                    t.title.toLowerCase().includes(query.toLowerCase()) ||
                    t.description?.toLowerCase().includes(query.toLowerCase())
                );
                
                if (results.length > 0) {
                    showNotification(`Found ${results.length} task(s)`, 'success');
                    
                    // Highlight matching tasks
                    document.querySelectorAll('.task-item').forEach(item => {
                        item.style.transition = 'all 0.3s';
                        item.style.boxShadow = 'none';
                    });
                    
                    setTimeout(() => {
                        results.forEach(task => {
                            const taskEl = document.querySelector(`[data-task-id="${task.id}"]`);
                            if (taskEl) {
                                taskEl.style.boxShadow = '0 0 0 3px #3b82f6';
                                taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                    }, 100);
                    
                    setTimeout(() => {
                        document.querySelectorAll('.task-item').forEach(item => {
                            item.style.boxShadow = '';
                        });
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
            
            // Animate button
            this.style.transform = 'scale(1.1)';
            setTimeout(() => this.style.transform = '', 200);
            
            showNotification(`📋 ${today} tasks today • ⚠️ ${overdue} overdue`, 'info');
        };
    }
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        // Check if dark mode was previously enabled
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            updateThemeIcon(themeBtn, true);
        }
        
        themeBtn.onclick = function() {
            // Rotate animation
            this.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => this.style.transform = '', 300);
            
            // Toggle dark mode
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            // Save preference
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            
            // Update icon
            updateThemeIcon(this, isDark);
            
            showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
        };
    }
    
    // Navigation links with smooth scroll
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
                    
                    // Highlight section
                    targetElement.style.transition = 'box-shadow 0.3s';
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

// ============================================
// UPDATE METRICS
// ============================================
function updateMetrics() {
    const today = getTodayDate();
    
    // Tasks Today
    const todayTasks = tasks.filter(t => t.date === today && !t.completed).length;
    const metricTodayEl = document.getElementById('metricToday');
    if (metricTodayEl) {
        animateNumber(metricTodayEl, parseInt(metricTodayEl.textContent) || 0, todayTasks);
    }
    
    // Weekly Progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekTasks = tasks.filter(t => t.date >= weekStartStr);
    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekProgress = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
    
    const metricWeeklyEl = document.getElementById('metricWeekly');
    if (metricWeeklyEl) {
        const current = parseInt(metricWeeklyEl.textContent) || 0;
        animateNumber(metricWeeklyEl, current, weekProgress, '%');
    }
    
    // Productivity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const recentTasks = tasks.filter(t => t.date >= sevenDaysStr);
    const recentCompleted = recentTasks.filter(t => t.completed).length;
    const productivity = recentTasks.length > 0 ? Math.round((recentCompleted / recentTasks.length) * 100) : 0;
    
    const metricProductivityEl = document.getElementById('metricProductivity');
    if (metricProductivityEl) {
        const current = parseInt(metricProductivityEl.textContent) || 0;
        animateNumber(metricProductivityEl, current, productivity, '%');
    }
    
    // Streak
    let streak = calculateStreak();
    const metricStreakEl = document.getElementById('metricStreak');
    if (metricStreakEl) {
        const current = parseInt(metricStreakEl.textContent) || 0;
        animateNumber(metricStreakEl, current, streak, ' days');
    }
}

function animateNumber(element, start, end, suffix = '') {
    if (start === end) {
        element.textContent = end + suffix;
        return;
    }
    
    const duration = 500;
    const steps = 20;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            element.textContent = end + suffix;
        } else {
            element.textContent = Math.round(current) + suffix;
        }
    }, stepTime);
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
        } else if (i > 0 && dayTasks.length > 0 && dayCompleted.length === 0) {
            break;
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
            showNotification(`Showing ${currentFilter} tasks`, 'info');
        };
    });
    
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(item => {
        item.onclick = function() {
            const tag = this.textContent.trim().toLowerCase();
            currentFilter = `tag-${tag}`;
            updateUI();
            
            // Highlight selected tag
            tagItems.forEach(t => t.style.background = '');
            this.style.background = 'rgba(59, 130, 246, 0.15)';
            
            showNotification(`Filtering by: ${tag}`, 'info');
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
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
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
        
        tasks.push(newTask);
        saveTasks();
        closeModal();
        showNotification('✅ Task created successfully!', 'success');
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
    
    if (todayCountEl) animateNumber(todayCountEl, parseInt(todayCountEl.textContent) || 0, todayTasks.length);
    if (todayProgressEl) todayProgressEl.textContent = todayProgress + '%';
    if (todayBarEl) todayBarEl.style.width = todayProgress + '%';
    
    // Overdue
    const overdue = tasks.filter(t => t.date < today && !t.completed);
    const overdueEl = document.getElementById('overdueCount');
    if (overdueEl) animateNumber(overdueEl, parseInt(overdueEl.textContent) || 0, overdue.length);
    
    // Completed
    const completed = tasks.filter(t => t.completed);
    const completedProgress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    
    const completedCountEl = document.getElementById('completedCount');
    const completedProgressEl = document.getElementById('completedProgress');
    const completedBarEl = document.getElementById('completedProgressBar');
    
    if (completedCountEl) animateNumber(completedCountEl, parseInt(completedCountEl.textContent) || 0, completed.length);
    if (completedProgressEl) completedProgressEl.textContent = completedProgress + '%';
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
        taskList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #94a3b8;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 1rem;">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 0.5rem;">No tasks found</h3>
                <p style="font-size: 14px;">Click "New Task" to create one!</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.setAttribute('draggable', 'true');
        div.setAttribute('data-task-id', task.id);
        
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${task.starred ? '#f59e0b' : 'none'}" stroke="${task.starred ? '#f59e0b' : '#94a3b8'}" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </button>
        `;
        
        // Checkbox
        const checkbox = div.querySelector('input');
        checkbox.onchange = function() {
            task.completed = this.checked;
            saveTasks();
            showNotification(this.checked ? '✅ Task completed!' : '🔄 Task reopened', 'success');
        };
        
        // Star
        const star = div.querySelector('.task-star');
        star.onclick = function() {
            task.starred = !task.starred;
            saveTasks();
            showNotification(task.starred ? '⭐ Added to important' : '☆ Removed from important', 'info');
        };
        
        // Double click to edit
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
            height: 280,
            fontFamily: 'Inter, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        labels: ['Completed', 'Incomplete'],
        colors: ['#10b981', '#f59e0b'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
            fontWeight: 600,
            markers: {
                width: 10,
                height: 10,
                radius: 6
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 700,
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
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#64748b',
                            formatter: function (w) {
                                return tasks.length;
                            }
                        },
                        value: {
                            fontSize: '28px',
                            fontWeight: 800,
                            color: '#0f172a',
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return value + ' tasks';
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
            height: 280,
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
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
                    fontWeight: 600,
                }
            }
        },
        yaxis: {
            title: {
                text: 'Tasks',
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            }
        },
        colors: ['#ef4444', '#f59e0b', '#10b981'],
        legend: {
            show: false
        },
        grid: {
            borderColor: '#e2e8f0',
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
                name: 'Created',
                data: created
            },
            {
                name: 'Completed',
                data: completed
            }
        ],
        chart: {
            type: 'area',
            height: 300,
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#3b82f6', '#10b981'],
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
                    colors: '#64748b'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Tasks',
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#64748b'
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
            borderColor: '#e2e8f0',
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
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Particle System
const canvas = document.getElementById('particleCanvas');
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
