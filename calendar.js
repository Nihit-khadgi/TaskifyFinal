const calendarGrid = document.getElementById('calendar-grid');
const weekdaysContainer = document.querySelector('.calendar-weekdays');
const monthContainer = document.getElementById('calendar-month');
const eventList = document.getElementById('event-list');

// Weekdays
const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
weekdays.forEach(d => {
    const div = document.createElement('div');
    div.textContent = d;
    weekdaysContainer.appendChild(div);
});

// Load and save events
function loadEvents() {
    return JSON.parse(localStorage.getItem('taskify-events')) || {};
}

function saveEvent(date, text) {
    const events = loadEvents();
    if (!events[date]) events[date] = [];
    events[date].push(text);
    localStorage.setItem('taskify-events', JSON.stringify(events));
}

// Render events
function renderEvents() {
    eventList.innerHTML = '';
    const events = loadEvents();
    for (const date in events) {
        events[date].forEach(text => {
            const div = document.createElement('div');
            div.classList.add('event-item');
            div.textContent = `${date}: ${text}`;
            eventList.appendChild(div);
        });
    }
}

// Render BS calendar
function renderCalendar(daysData) {
    calendarGrid.innerHTML = '';

    // Get current Nepali date for highlight
    const today = new Date();
    const todayAd = today.getDate(); // temp highlight logic

    // Month name
    if(daysData.length) monthContainer.textContent = "Month: " + daysData[0].npMonth;

    daysData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');

        // Day number
        dayDiv.textContent = day.np;

        // Tithi
        const tithiDiv = document.createElement('div');
        tithiDiv.textContent = day.Tithi;
        tithiDiv.style.fontSize = '0.7rem';
        tithiDiv.style.marginTop = '3px';
        dayDiv.appendChild(tithiDiv);

        // Highlight current date
        if(day.isToday) dayDiv.classList.add('today');

        // Saturday highlight
        if(day.weekday === 7) dayDiv.classList.add('saturday');

        // Event dot click
        const dateKey = `${day.npMonth}-${day.np}`;
        if(loadEvents()[dateKey]) {
            const dot = document.createElement('div');
            dot.classList.add('event-dot');
            dayDiv.appendChild(dot);
        }

        dayDiv.addEventListener('click', () => {
            const eventText = prompt('Enter your reminder:');
            if(eventText) {
                saveEvent(dateKey, eventText);
                renderCalendar(daysData);
                renderEvents();
            }
        });

        calendarGrid.appendChild(dayDiv);
    });
    renderEvents();
}

// Fetch Nepali JSON for current month
fetch('data/2083/10.json')
.then(res => res.json())
.then(data => {
    // Mark current Nepali date (dummy logic: match today AD day to BS day)
    const today = new Date();
    data.days.forEach(d => {
        d.isToday = (d.en == today.getDate()); 
        d.npMonth = data.metadata.np; 
    });
    renderCalendar(data.days);
})
.catch(err => console.error(err));
