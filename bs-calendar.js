const calendarGrid = document.getElementById('calendar-grid');
const eventList = document.getElementById('event-list');
const weekdaysContainer = document.querySelector('.calendar-weekdays');
const bsMonthHeader = document.getElementById('bs-month');

// Weekdays
const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
weekdays.forEach(day => {
    const div = document.createElement('div');
    div.textContent = day;
    div.style.fontWeight = 'bold';
    div.style.textAlign = 'center';
    weekdaysContainer.appendChild(div);
});

// Events
function loadEvents() { return JSON.parse(localStorage.getItem('taskify-events')) || {}; }
function saveEvent(date, text) {
    const events = loadEvents();
    if (!events[date]) events[date] = [];
    events[date].push(text);
    localStorage.setItem('taskify-events', JSON.stringify(events));
}
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

// Get today's Nepali date
const todayAD = new Date();
const todayBS = NepaliDateConverter.AD2BS(todayAD.getFullYear(), todayAD.getMonth() + 1, todayAD.getDate());
const bsYear = todayBS.bsYear;
const bsMonth = todayBS.bsMonth;

// Show current BS month
bsMonthHeader.textContent = `${bsYear} - ${todayBS.bsMonthName}`;

// Fetch JSON dynamically for this month
fetch(`data/${bsYear}/${bsMonth}.json`)
.then(res => res.json())
.then(data => {
    renderCalendar(data.days);
    renderEvents();
})
.catch(err => {
    console.error(err);
    // fallback 1-30
    const fallback = [];
    for (let i=1; i<=30; i++) fallback.push({np: i, Tithi: '', weekday: (i-1)%7+1});
    renderCalendar(fallback);
    renderEvents();
});

function renderCalendar(daysData) {
    calendarGrid.innerHTML = '';
    const events = loadEvents();

    daysData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day.np;

        // Tithi
        if(day.Tithi) {
            const tithiDiv = document.createElement('div');
            tithiDiv.textContent = day.Tithi;
            tithiDiv.style.fontSize = '12px';
            tithiDiv.style.color = '#555';
            dayDiv.appendChild(tithiDiv);
        }

        // Highlight today
        if(day.np == todayBS.bsDate) dayDiv.classList.add('today');

        // Highlight Saturday (Nepali weekday: 7 = Saturday)
        if(day.weekday == 7) dayDiv.classList.add('saturday');

        // Event dot
        const dateKey = `${bsYear}-${bsMonth}-${day.np}`;
        if(events[dateKey]) {
            const dot = document.createElement('div');
            dot.classList.add('event-dot');
            dayDiv.appendChild(dot);
        }

        // Click to add event
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
}
