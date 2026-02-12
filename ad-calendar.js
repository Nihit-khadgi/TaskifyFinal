const calendarGrid = document.getElementById('calendar-grid');
const eventList = document.getElementById('event-list');
const monthYearTitle = document.getElementById('month-year');

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0-11
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
monthYearTitle.textContent = `${monthNames[month]} ${year}`;

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Render weekday headers
weekdays.forEach(day => {
    const div = document.createElement('div');
    div.textContent = day;
    div.classList.add('weekday');
    calendarGrid.appendChild(div);
});

// Get total days in month
const totalDays = new Date(year, month+1, 0).getDate();

// Get weekday of 1st day of month
const firstDayWeekday = new Date(year, month, 1).getDay(); // 0-6

function loadEvents() { return JSON.parse(localStorage.getItem('taskify-events')) || {}; }
function saveEvent(date, text) {
    const events = loadEvents();
    if(!events[date]) events[date] = [];
    events[date].push(text);
    localStorage.setItem('taskify-events', JSON.stringify(events));
}

function renderEvents() {
    eventList.innerHTML = '';
    const events = loadEvents();
    for(const date in events){
        events[date].forEach(text=>{
            const div = document.createElement('div');
            div.classList.add('event-item');
            div.textContent = `${date}: ${text}`;
            eventList.appendChild(div);
        });
    }
}

// Fill empty slots before 1st day
for(let i=0;i<firstDayWeekday;i++){
    const emptyDiv = document.createElement('div');
    calendarGrid.appendChild(emptyDiv);
}

// Fill actual days
for(let day=1; day<=totalDays; day++){
    const div = document.createElement('div');
    div.textContent = day;
    div.classList.add('day');

    const dateObj = new Date(year, month, day);
    const weekday = dateObj.getDay();

    if(weekday === 6) div.classList.add('saturday'); // Saturday highlight
    if(day === today.getDate()) div.classList.add('today');

    const dateKey = `${year}-${month+1}-${day}`;
    const events = loadEvents();
    if(events[dateKey]){
        const dot = document.createElement('div');
        dot.classList.add('event-dot');
        div.style.position='relative';
        div.appendChild(dot);
    }

    div.addEventListener('click', ()=>{
        const text = prompt('Enter your reminder:');
        if(text){
            saveEvent(dateKey,text);
            renderEvents();
            location.reload();
        }
    });

    calendarGrid.appendChild(div);
}

renderEvents();
