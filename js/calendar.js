class CalendarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="../css/main.css">
    <div id="logout">
        <img src="../img/log-out.png" alt="" id="log-out-image">
        <p id="logout-text">Logout</p>
    </div>
    <div id="search">
        <img src="../img/search.png" alt="" id="search-icon">
        <p id="search-text">Search</p>
    </div>
    <div id="plus">
        <img src="../img/plus.png" alt="" id="plus-icon">
        <p id="plus-text">Add Event</p>
    </div>
    <div class="calendar-container">
        <div class="calendar-header">
            <button id="prevMonth">previous month</button>
            <h2 id="monthYear"></h2>
            <button id="nextMonth">next month</button>
        </div>
        <div class="calendar-body">
            <div class="day-names">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
            </div>
            <div id="calendarDays" class="days"></div>
        </div>
        <div id="modal" class="modal">
            <div class="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <p id="modalDate"></p>
                <label for="eventName">Event Name:</label>
                <input type="text" id="eventName" name="eventName"><br>
                <label for="eventTime">Event Time:</label>
                <input type="time" id="eventTime" name="eventTime"><br>
                <button id="saveEvent">Save Event</button>
                <button id="changeEvent">save changes</button>
            </div>
        </div>
        <div id="eventModal" class="modal">
            <div class="modal-content">
                <span id="closeEventModal" class="close">&times;</span>
                <p id="eventModalDate"></p>
                <p id="eventModalName"></p>
                <p id="eventModalTime"></p>
                <button id="editEvent">Edit Event</button>
                <button id="deleteEvent">Delete Event</button>
            </div>
        </div>
        <div id="searchModal" class="modal">
            <div class="modal-content">
                <span id="closeSearchModal" class="close">&times;</span>
                <label for="searchDate">Date:</label>
                <input type="date" id="searchDate" name="searchDate"><br>
                <label for="searchName">Event Name:</label>
                <input type="text" id="searchName" name="searchName"><br>
                <button id="searchEventButton">Search</button>
            </div>
        </div>
    </div>
`;

        this.initElements();
        this.initEventListeners();
        this.currentDate = new Date();
        this.chosenDate = null;
        this.currentEvent = null;
        this.currentPointerEvent = null;
        this.currentUser = JSON.parse(sessionStorage.getItem('current-user'));
        this.currentMonth = null;
        this.currentYear = null;
    }

    initElements() {
        this.monthYearElement = this.shadowRoot.getElementById("monthYear");
        this.calendarDaysElement = this.shadowRoot.getElementById("calendarDays");
        this.prevMonthButton = this.shadowRoot.getElementById("prevMonth");
        this.nextMonthButton = this.shadowRoot.getElementById("nextMonth");
        this.modal = this.shadowRoot.getElementById("modal");
        this.closeModalButton = this.shadowRoot.getElementById("closeModal");
        this.modalDateElement = this.shadowRoot.getElementById("modalDate");
        this.eventNameInput = this.shadowRoot.getElementById("eventName");
        this.eventTimeInput = this.shadowRoot.getElementById("eventTime");
        this.saveEventButton = this.shadowRoot.getElementById("saveEvent");
        this.changeEventButton = this.shadowRoot.getElementById("changeEvent");
        this.logOutElement = this.shadowRoot.getElementById('log-out-image');
        this.searchElement = this.shadowRoot.getElementById('search-icon');
        this.plusElement = this.shadowRoot.getElementById('plus-icon');
        this.eventModal = this.shadowRoot.getElementById("eventModal");
        this.closeEventModalButton = this.shadowRoot.getElementById("closeEventModal");
        this.eventModalDateElement = this.shadowRoot.getElementById("eventModalDate");
        this.eventModalNameElement = this.shadowRoot.getElementById("eventModalName");
        this.eventModalTimeElement = this.shadowRoot.getElementById("eventModalTime");
        this.editEventButton = this.shadowRoot.getElementById("editEvent");
        this.deleteEventButton = this.shadowRoot.getElementById("deleteEvent");
        this.searchModal = this.shadowRoot.getElementById("searchModal");
        this.closeSearchModalButton = this.shadowRoot.getElementById("closeSearchModal");
        this.searchDateInput = this.shadowRoot.getElementById("searchDate");
        this.searchNameInput = this.shadowRoot.getElementById("searchName");
        this.searchEventButton = this.shadowRoot.getElementById("searchEventButton");
    }

    initEventListeners() {
        this.prevMonthButton.addEventListener("click", () => this.changeMonth(-1));
        this.nextMonthButton.addEventListener("click", () => this.changeMonth(1));
        this.closeModalButton.addEventListener("click", () => this.closeModal());
        this.saveEventButton.addEventListener("click", () => this.saveEvent());
        this.closeEventModalButton.addEventListener("click", () => this.closeEventModal());
        this.editEventButton.addEventListener("click", () => this.editEvent());
        this.deleteEventButton.addEventListener("click", () => this.deleteEvent());
        this.changeEventButton.addEventListener("click", () => this.changeEvent());
        this.logOutElement.addEventListener("click", this.logOut);
        this.searchElement.addEventListener("click", () => this.openSearchModal());
        this.plusElement.addEventListener("click", ()=>this.addEvent());
        this.closeSearchModalButton.addEventListener("click", () => this.closeSearchModal());
        this.searchEventButton.addEventListener("click", () => this.searchEvent());
    }

    connectedCallback() {
        this.renderCalendar();
    }

    renderCalendar() {
        this.calendarDaysElement.innerHTML = "";
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        let eventsArr = this.getAllEvents(this.currentMonth + 1, this.currentYear);
        this.monthYearElement.textContent = `${this.currentDate.toLocaleString('en-US', { month: 'long' })} ${this.currentYear}`;
        let firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
        let daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        for (let i = 0; i < firstDayOfMonth; i++) {
            this.calendarDaysElement.appendChild(document.createElement('div')).className = 'day';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            let targetDate = `${this.currentYear}/${this.currentMonth + 1}/${day}`;
            let dayElement = document.createElement('div');
            dayElement.className = 'day';
            let dayElementNumber = document.createElement('p');
            dayElementNumber.className = 'day-number';
            dayElementNumber.textContent = day;
            if (new Date().getDate() === day && new Date().getMonth() === this.currentMonth && new Date().getFullYear() === this.currentYear) {
                dayElementNumber.classList.add('current-day');
            }
            dayElement.appendChild(dayElementNumber)
            if (eventsArr) {
                Object.entries(eventsArr).forEach(([key, value]) => {
                    if (value.date === targetDate) {
                        this.presentingEvents(dayElement, key, value);
                    }
                });
            }
            dayElement.addEventListener('click', (e) => this.openEditWindow(day, this.currentMonth + 1, this.currentYear));
            this.calendarDaysElement.appendChild(dayElement);
        }
    }

    presentingEvents(dayElement, key, value) {
        let eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.textContent = value.event;
        eventElement.dataset.id = key;
        eventElement.addEventListener('click', (e) => this.openEventDetails(e));
        dayElement.appendChild(eventElement);
    }

    getAllEvents(month, year) {
        let myData;
        let url = `/${this.currentUser}?year=${year}&&month=${month}`
        let body = {}
        client.createNewRequest("GET-ALL", url, body, (err, data) => {
            if (!err) {
                console.log('GET ALL request succed');
            }
            myData = data;
        });
        return myData;
    }

    openEditWindow(day, month, year) {
        this.modalDateElement.textContent = `Date: ${day}/${month}/${year}`;
        this.eventNameInput.value = "";
        this.eventTimeInput.value = "";
        this.modal.style.display = "block";
        this.chosenDate = `${year}/${month}/${day}`;
    }

    saveEvent() {
        let eventName = this.eventNameInput.value;
        let eventTime = this.eventTimeInput.value;
        if (eventName && eventTime) {
            let body = { event: { 'event': eventName, 'time': eventTime, 'date': this.chosenDate } };
            this.setEvent(body);
            this.closeModal();
        } else {
            alert("Please fill in both the event name and time.");
        }
    }

    setEvent(body) {
        let url = `/${this.currentUser}/events/${this.chosenDate}`;
        client.createNewRequest('POST', url, body, (err, data) => {
            if (!err) {
                this.updateDayWithEvent(body, data);
            }
        });
    }

    updateDayWithEvent(body, id) {
        const [year, month, day] = this.chosenDate.split('/');
        const dayElements = this.shadowRoot.querySelectorAll('.day');
        dayElements.forEach(dayElement => {
            let dayNumber;
            if (dayElement.querySelector('p'))
                dayNumber = dayElement.querySelector('p').textContent;
            if (dayNumber === day) {
                let eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = body.event.event;
                eventElement.dataset.id = id;
                eventElement.addEventListener('click', (e) => this.openEventDetails(e));
                dayElement.appendChild(eventElement);
            }
        });
    }

    openEventDetails(e) {
        e.stopPropagation();
        this.chosenDate = `${this.currentYear}/${this.currentMonth + 1}/${e.target.parentElement.querySelector('p').textContent}`;
        this.currentPointerEvent = e.target.dataset.id;
        this.getEvent(this.fillTheEventDetails.bind(this));
        this.eventModal.style.display = "block";
    }

    getEvent(callback) {
        let url = `/${this.currentUser}?month=${this.chosenDate.split('/')[1]}&id=${this.currentPointerEvent}`
        client.createNewRequest('GET', url, {}, (err, data) => {
            if (!err) {
                callback(data);
            }
            else {
                alert('No Such Event')
            }
        });
    }

    fillTheEventDetails(event) {
        this.eventModalDateElement.textContent = `Date: ${event.date}`;
        this.eventModalNameElement.textContent = `Event: ${event.event}`;
        this.eventModalTimeElement.textContent = `Time: ${event.time}`;
        this.currentEvent = event;
    }

    changeEvent() {
        let eventName = this.eventNameInput.value;
        let eventTime = this.eventTimeInput.value;
        if (eventName && eventTime) {
            this.closeModal();
        } else {
            alert("Please fill in both the event name and time.");
        }
        let url = `/${this.currentUser}/events/${this.currentPointerEvent}/${this.currentEvent.date}`;
        let body = { event: { 'event': eventName, 'time': eventTime, 'date': this.currentEvent.date } };
        client.createNewRequest('PUT', url, body, (err, data) => {
            if (!err) {
                this.shadowRoot.querySelector(`[data-id="${this.currentPointerEvent}"]`).innerHTML = data.event;
            }
        });
        this.saveEventButton.style.display = "block";
        this.changeEventButton.style.display = "none";
    }

    editEvent() {
        this.changeEventButton.style.display = "block";
        this.eventNameInput.value = this.currentEvent.event;
        this.eventTimeInput.value = this.currentEvent.time;
        this.modal.style.display = "block";
        this.eventModal.style.display = "none";
        this.saveEventButton.style.display = "none";
    }

    deleteEvent() {
        let url = `/${this.currentUser}/${this.currentMonth + 1}/${this.currentPointerEvent}`;
        client.createNewRequest('DELETE', url, {}, (err, data) => {
            if (!err) {
                this.closeEventModal();
                let eventElement = this.shadowRoot.querySelector(`[data-id="${this.currentPointerEvent}"]`);
                if (eventElement) {
                    eventElement.remove();
                }
            }
        });
    }

    openSearchModal() {
        this.searchModal.style.display = "block";
    }

    closeSearchModal() {
        this.searchModal.style.display = "none";
    }

    searchEvent() {
        let searchDate = this.searchDateInput.value.replace(/-/g, '/');
        let searchName = this.searchNameInput.value.toLowerCase();
        if (!searchDate && !searchName) {
            alert("Please provide a date or event name to search.");
            return;
        }
        let dateParts = searchDate.split('/');
        let year = dateParts[0];
        let month = dateParts[1].replace(/^0+/, '');
        let day = dateParts[2].replace(/^0+/, '');
        this.chosenDate =`${year}/${month}/${day}`;
        let url =`/${this.currentUser}?month=${month}&event=${searchName}`;
        client.createNewRequest('GET', url, {'event':{ 'event': searchName, 'date': this.chosenDate }}, (err, data) => {
            if (!err) {
                this.currentDate.setMonth(month-1);
                this.renderCalendar();
            }
            else {
                alert('No Such Event');
            }
        });
        this.closeSearchModal();
    }

    addEvent() {
        let date = new Date();
        this.openEditWindow(date.getDate(), date.getMonth()+1, date.getFullYear());
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }

    openModal() {
        this.modal.style.display = "block";
    }

    closeModal() {
        this.modal.style.display = "none";
    }

    closeEventModal() {
        this.eventModal.style.display = "none";
    }

    logOut() {
        location.hash = '#form';
        location.reload();
    }
}

customElements.define('calendar-component', CalendarComponent);
let calendar = new CalendarComponent();