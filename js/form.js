class Form {
    constructor() {
        this.container = document.getElementById('container');
        this.overlayCon = document.getElementById('overlayCon');
        this.overlayBtn = document.getElementById('overlayBtn');
        this.overlayBtn.addEventListener('click', () => {
            this.container.classList.toggle('right-panel-active');
            this.overlayBtn.classList.remove('btnScaled');
            window.requestAnimationFrame(() => {
                this.overlayBtn.classList.add('btnScaled');
            });
        });
        this.signUpBtn = document.getElementById('signUpBtn');
        this.signInBtn = document.getElementById('signInBtn');
        this.signUpBtn.addEventListener('click', this.signUp);
        this.signInBtn.addEventListener('click', this.signIn);
    }

    switchForm() {
        alert('fejn');
        this.container.classList.toggle('right-panel-active');
        this.overlayBtn.classList.remove('btnScaled');
        window.requestAnimationFrame(() => {
            this.overlayBtn.classList.add('btnScaled');
        });
    }

    signIn() {
        let SignInEmail = document.getElementById('SignInEmail').value;
        let SignInPassword = document.getElementById('SignInPassword').value;
        if (!SignInEmail || !SignInPassword) {
            alert('Please Fill In All Details');
        }
        else {
            let body = { 'email': SignInEmail, 'password': SignInPassword }
            let url = `/${SignInEmail}/signIn`;
            client.createNewRequest('POST', url, body, (err, data) => {
                if (!err) {
                    sessionStorage.setItem('current-user', JSON.stringify(SignInEmail));
                    location.hash = '#calendar';
                }
                else if (err === 'error 400') {
                    alert('one of the details is not correct')
                }
                else {
                    alert('you need to register');
                }
            });
        }
    }

    signUp() {
        let SignUpName = document.getElementById('SignUpName').value;
        let SignUpPassword = document.getElementById('SignUpPassword').value;
        let SignUpEmail = document.getElementById('SignUpEmail').value;
        if (!SignUpName || !SignUpPassword || !SignUpEmail) {
            alert('Please Fill In All Details')
        }
        else {
            let body = { 'name': SignUpName, 'email': SignUpEmail, 'password': SignUpPassword }
            let url = `/${SignUpEmail}/signUp`;
            client.createNewRequest('POST', url, body, (err, data) => {
                if (!err) {
                    sessionStorage.setItem('current-user', JSON.stringify(SignUpEmail));
                    location.hash = '#calendar';
                } else {
                    alert('you have already register')
                }
            });
        }
    }
}


