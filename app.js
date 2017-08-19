var app = {
    init: function () {
        this.bindEvents();
    },
    sessionTime: 25,
    breakTime: 5,
    currentSession: 1500, // in seconds
    timerOn: false,
    timerPause: true,
    sessionOn: true, // session or break
    currentTimer: null, // setInterval variable
    bindEvents: function () {
        var clockBtn = document.querySelector('#clock');
        var addBtns = document.querySelectorAll('.addMinute');
        var subtractBtns = document.querySelectorAll('.subtractMinute');
        // On Timer click
        clock.addEventListener('click', this.startOrTogglePause.bind(this));
        // Break minutes
        addBtns[0].addEventListener('click', this.addBreakTime.bind(this));
        subtractBtns[0].addEventListener('click', this.subtractBreakTime.bind(this));
        // Pomdoro Minutes
        addBtns[1].addEventListener('click', this.addSessionTime.bind(this));
        subtractBtns[1].addEventListener('click', this.subtractSessionTime.bind(this));
    },
    calculateCurrentSession: function () {
        if (this.sessionOn) {
            this.currentSession = this.sessionTime * 60;
        } else {
            this.currentSession = this.breakTime * 60;
        }
        this.headingView();
    },
    // Display the minutes and seconds to the user based on currentSession 
    renderView: function  () {
        var timerElement = document.querySelector('#timer');

        var displayMinutes = Math.floor(this.currentSession / 60).toString();
        var displaySeconds = (this.currentSession % 60).toString();

        if (displaySeconds < 10) {
            displaySeconds = '0' + displaySeconds;
        }
        timer.textContent = displayMinutes + ':' + displaySeconds;
    },
    // Heading on the timer Session or Break
    headingView: function  () {
        var sessionHeadingElement = document.querySelector('#clock h3');

        if (this.sessionOn) {
            sessionHeadingElement.textContent = 'Session';
        } else {
            sessionHeadingElement.textContent = 'Break';
        }
    },
    // Settings - Pomodoro minutes and break minutes
    renderSettingsView: function  () {
        var sessionElement = document.querySelector('#sessionTime');
        var breakElement = document.querySelector('#breakTime');

        sessionElement.textContent = this.sessionTime;
        breakElement.textContent = this.breakTime;
    },
    startTimer: function () {
        this.timerPause = false;
        this.timerOn = true;
        this.calculateCurrentSession();
        this.currentTimer = setInterval(this.runTimer.bind(this), 1000);
    },
    /**
     * If currentSession < 1 sessionOn will decide if its pomodo or break
     * And calculate the next session length
     */
    runTimer: function () {
        if (!this.timerPause) {
            this.currentSession--;
            this.renderView();
            if (this.currentSession < 1) {
                this.playBeep();
                this.sessionOn = !this.sessionOn;
                this.calculateCurrentSession();
            }
        }
    },
    toggleTimer: function () {
        this.timerPause = !this.timerPause;
    },
    stopTimer: function () {
        clearInterval(this.currentTimer);
        this.timerOn = false;
    },
    /**
     * If break is on then add minutes
     * If timer is running return
     * If timer is paused and timer is running then stop timer
     * Add to sessionTime 
     * Calculate new currentSession
     * Render Views
     */
    addSessionTime: function () {
        if (!this.sessionOn) {
            this.sessionTime++;
            this.renderSettingsView();
        } else {
            if (!this.timerPause) {
                return;
            }
            if (this.timerOn) {
                this.stopTimer();
            }
            this.sessionTime++;
            this.calculateCurrentSession();
            this.renderSettingsView();
            this.renderView();
        }
    },
    // Same as addSessionTime only it subtracts
    subtractSessionTime: function () {
        if (!this.sessionOn && this.sessionTime > 1) {
            this.sessionTime--;
            this.renderSettingsView();        
        } else {
            if (this.sessionTime <= 1 || !this.timerPause) {
                return;
            }
            if (this.timerOn) {
                this.stopTimer();
            }
            this.sessionTime--;
            this.calculateCurrentSession();
            this.renderSettingsView();
            this.renderView();
        }
    },
    // If pomodoro session is running add breakTime
    addBreakTime: function () {
        if (this.sessionOn) {
            this.breakTime++;
            this.renderSettingsView();
        }
    },
    subtractBreakTime: function () {
        if (this.sessionOn) {
            if (this.breakTime > 1) {
                this.breakTime--;
                this.renderSettingsView();
            }
        }
    },
    // If timer is running timer click will pause it else start the timer
    startOrTogglePause: function () {
        if (this.timerOn) {
            this.toggleTimer();
        } else {
            this.startTimer();
        }
    },
    playBeep: function () {
        document.querySelector('#sound').play();
    }
}

app.init();
