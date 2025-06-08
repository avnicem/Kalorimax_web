import { getDomElements } from '../modules/config.js';
import { updateDate } from '../modules/uiService.js';

class DateSelector {
    constructor() {
        this.currentDate = new Date();
        this.dom = getDomElements();
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.updateDateDisplay();
    }

    setupEventListeners() {
        // Tarih değişikliği
        if (this.dom.dateElement) {
            this.dom.dateElement.addEventListener('click', () => this.showDatePicker());
        }

        // Önceki gün butonu
        const prevDayBtn = document.querySelector('.date-prev');
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => this.changeDay(-1));
        }

        // Sonraki gün butonu
        const nextDayBtn = document.querySelector('.date-next');
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => this.changeDay(1));
        }

        // Bugün butonu
        const todayBtn = document.querySelector('.date-today');
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
        }
    }

    showDatePicker() {
        // HTML5 date input kullanarak tarih seçiciyi göster
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = this.formatDateForInput(this.currentDate);
        
        dateInput.addEventListener('change', (e) => {
            this.setSelectedDate(new Date(e.target.value));
            dateInput.remove();
        });

        dateInput.click();
    }

    changeDay(days) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(newDate.getDate() + days);
        this.setSelectedDate(newDate);
    }

    goToToday() {
        this.setSelectedDate(new Date());
    }

    setSelectedDate(date) {
        this.currentDate = date;
        this.updateDateDisplay();
        updateDate(date);
        
        // Tarih değişikliği event'i tetikle
        document.dispatchEvent(new CustomEvent('dateChanged', { detail: { date } }));
    }

    updateDateDisplay() {
        if (this.dom.dateElement) {
            this.dom.dateElement.textContent = this.formatDate(this.currentDate);
        }
    }

    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Europe/Istanbul'
        };
        return date.toLocaleDateString('tr-TR', options);
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export default DateSelector;
