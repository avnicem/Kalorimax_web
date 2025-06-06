import { DEFAULT_GOALS } from './config.js';

// Bildirim göster
const showNotification = (message, type = 'info') => {
    // Mevcut bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Otomatik kapanma
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Makro çubuğunu güncelle
const updateMacroBar = (macro, current, goal) => {
    const elements = {
        protein: {
            bar: document.querySelector('.macro-protein .macro-fill'),
            amount: document.querySelector('.macro-protein .macro-amount')
        },
        carbs: {
            bar: document.querySelector('.macro-carbs .macro-fill'),
            amount: document.querySelector('.macro-carbs .macro-amount')
        },
        fat: {
            bar: document.querySelector('.macro-fat .macro-fill'),
            amount: document.querySelector('.macro-fat .macro-amount')
        }
    };

    const element = elements[macro];
    if (!element) return;

    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    element.bar.style.width = `${percentage}%`;
    element.amount.textContent = `${current}g`;
};

// Tarihi güncelle
const updateDate = () => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('tr-TR', options);
    }
};

export {
    showNotification,
    updateMacroBar,
    updateDate
};
