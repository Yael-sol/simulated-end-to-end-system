class App {
    constructor() {
        this.currentHash;
        if (localStorage.getItem('globalID') === null) {
            localStorage.setItem('globalID', '0');
        }
    }

    init() {
        this.currentHash = location.hash;
        if (!this.currentHash) {
            let initialHash = 'form';
            history.replaceState({}, 'form', `#${initialHash}`);
            this.poppin();
        }
        else {
            history.replaceState({}, this.currentHash, `${this.currentHash}`);
            this.poppin();
        }
        window.addEventListener('popstate', this.poppin.bind(this));
    }

    poppin() {
        if (location.hash === '#form') {
            let template = document.getElementById('myForm').content.cloneNode(true);
            this.replaceTemplate(template);
            new Form();
        } else if (location.hash === '#calendar') {
            let calendarComponent = document.createElement('calendar-component');
            this.replaceTemplate(calendarComponent);
        }
    }

    replaceTemplate(template) {
        document.body.innerHTML = '';
        document.body.appendChild(template);
    }
}

let app = new App();
app.init();
