// Get DOM elements
const calendar = document.querySelector('.calendar');
const monthEl = document.querySelector('#month');
const yearEl = document.querySelector('#year');
const daysEl = document.querySelector('.calendar-days');
const prevMonthBtn = document.querySelector('#prev-month');
const nextMonthBtn = document.querySelector('#next-month');
const prevYearBtn = document.querySelector('#prev-year');
const nextYearBtn = document.querySelector('#next-year');
const darkModeSwitch = document.querySelector('.dark-mode-switch');
const addEventBtn = document.querySelector('.add-event-btn');
const addEventWrapper = document.querySelector('.add-event-wrapper');
const addEventCloseBtn = document.querySelector('.close');
const addEventTitle = document.querySelector('.event-name');
const addEventTime = document.querySelector('.event-time');
const eventsContainer = document.querySelector('.events');

// Initialize variables
let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let selectedDate = date;
let events = localStorage.getItem('events') ? 
    JSON.parse(localStorage.getItem('events')) : [];

// Month names array
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Function to generate calendar
function generateCalendar(month, year) {
    daysEl.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const lastDay = new Date(year, month, lastDate).getDay();
    const lastDateOfLastMonth = new Date(year, month, 0).getDate();
    
    // Update month and year in header
    monthEl.textContent = months[month];
    yearEl.textContent = year;
    
    // Previous month's days
    for (let i = firstDay; i > 0; i--) {
        const day = document.createElement('div');
        day.classList.add('prev-date');
        day.textContent = lastDateOfLastMonth - i + 1;
        daysEl.appendChild(day);
    }
    
    // Current month's days
    for (let i = 1; i <= lastDate; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        
        // Check if it's today
        if (i === date.getDate() && 
            month === date.getMonth() && 
            year === date.getFullYear()) {
            day.classList.add('curr-date');
        }
        
        // Check if it's selected date
        if (i === selectedDate.getDate() && 
            month === selectedDate.getMonth() && 
            year === selectedDate.getFullYear()) {
            day.classList.add('selected');
        }
        
        // Check if day has events
        if (hasEvent(i, month, year)) {
            day.classList.add('has-event');
        }
        
        day.addEventListener('click', () => {
            // Remove active class from previously selected day
            document.querySelector('.selected')?.classList.remove('selected');
            day.classList.add('selected');
            
            selectedDate = new Date(year, month, i);
            showEvents();
        });
        
        daysEl.appendChild(day);
    }
    
    // Next month's days
    for (let i = lastDay; i < 6; i++) {
        const day = document.createElement('div');
        day.classList.add('next-date');
        day.textContent = i - lastDay + 1;
        daysEl.appendChild(day);
    }
}

// Function to check if a day has events
function hasEvent(day, month, year) {
    return events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
    });
}

// Function to show events for selected date
function showEvents() {
    const eventsList = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDate.getDate() && 
               eventDate.getMonth() === selectedDate.getMonth() && 
               eventDate.getFullYear() === selectedDate.getFullYear();
    });
    
    eventsContainer.innerHTML = '';
    
    if (eventsList.length === 0) {
        eventsContainer.innerHTML = '<div class="no-event">No events for this day</div>';
        return;
    }
    
    eventsList.forEach(event => {
        const div = document.createElement('div');
        div.classList.add('event');
        div.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-delete" onclick="deleteEvent('${event.date}', '${event.title}')">
                <i class="fas fa-trash"></i>
            </div>
        `;
        eventsContainer.appendChild(div);
    });
}

// Function to delete event
function deleteEvent(date, title) {
    events = events.filter(event => 
        !(event.date === date && event.title === title)
    );
    localStorage.setItem('events', JSON.stringify(events));
    showEvents();
    generateCalendar(currentMonth, currentYear);
}

// Function to add new event
function addEvent() {
    const title = addEventTitle.value.trim();
    const time = addEventTime.value.trim();
    
    if (title === '' || time === '') {
        alert('Please fill all fields');
        return;
    }
    
    const event = {
        title: title,
        time: time,
        date: selectedDate.toISOString()
    };
    
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
    
    addEventWrapper.classList.remove('active');
    addEventTitle.value = '';
    addEventTime.value = '';
    
    generateCalendar(currentMonth, currentYear);
    showEvents();
}

// Event Listeners
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

prevYearBtn.addEventListener('click', () => {
    currentYear--;
    generateCalendar(currentMonth, currentYear);
});

nextYearBtn.addEventListener('click', () => {
    currentYear++;
    generateCalendar(currentMonth, currentYear);
});

darkModeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // Save dark mode preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
}

addEventBtn.addEventListener('click', addEvent);

addEventCloseBtn.addEventListener('click', () => {
    addEventWrapper.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-event')) {
        addEventWrapper.classList.add('active');
    }
});

// Initialize calendar
generateCalendar(currentMonth, currentYear);
showEvents();
