// Basit KaloriMax uygulaması - Firebase olmadan çalışan versiyon
console.log('KaloriMax uygulaması başlatılıyor...');

// Uygulama durumu
const state = {
    foods: [],
    dailyCalories: 0,
    dailyGoal: 2000,
    macros: {
        protein: { current: 0, goal: 150 },
        carbs: { current: 0, goal: 200 },
        fat: { current: 0, goal: 65 }
    }
};

// DOM elementleri
let elements = {};

// DOM elementlerini al
function getDomElements() {
    elements = {
        foodForm: document.getElementById('food-form'),
        foodNameInput: document.getElementById('food-name'),
        foodCaloriesInput: document.getElementById('food-calories'),
        foodProteinInput: document.getElementById('food-protein'),
        foodCarbsInput: document.getElementById('food-carbs'),
        foodFatInput: document.getElementById('food-fat'),
        foodList: document.getElementById('food-items'),
        dailyCalories: document.querySelector('.calorie-count'),
        dailyGoal: document.querySelector('.calorie-goal'),
        foodCount: document.querySelector('.food-count'),
        dateElement: document.querySelector('.date')
    };
    
    console.log('DOM elementleri alındı:', elements);
}

// Bildirim göster
function showNotification(message, type = 'info') {
    console.log(`Bildirim: ${message} (${type})`);
    
    // Mevcut bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    // Stil ekle
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(notification);
    
    // Otomatik kapanma
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Makro çubuğunu güncelle
function updateMacroBar(macro, current, goal) {
    const bar = document.querySelector(`.macro-${macro} .macro-fill`);
    const amount = document.querySelector(`.macro-${macro} .macro-amount`);
    
    if (bar && amount) {
        const percentage = Math.min(Math.round((current / goal) * 100), 100);
        bar.style.width = `${percentage}%`;
        amount.textContent = `${current}g`;
    }
}

// Tarihi güncelle
function updateDate() {
    if (elements.dateElement) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        elements.dateElement.textContent = new Date().toLocaleDateString('tr-TR', options);
    }
}

// UI'ı güncelle
function updateUI() {
    console.log('UI güncelleniyor...', state);
    
    // Kalori bilgilerini güncelle
    if (elements.dailyCalories) {
        elements.dailyCalories.textContent = state.dailyCalories;
    }
    
    if (elements.dailyGoal) {
        elements.dailyGoal.textContent = `Hedef: ${state.dailyGoal} kcal`;
    }
    
    // Makro çubuklarını güncelle
    Object.keys(state.macros).forEach(macro => {
        updateMacroBar(
            macro,
            state.macros[macro].current,
            state.macros[macro].goal
        );
    });
    
    // Yemek listesini güncelle
    renderFoodList();
}

// Yemek listesini oluştur
function renderFoodList() {
    if (!elements.foodList) {
        console.error('Food list elementi bulunamadı!');
        return;
    }
    
    console.log('Yemek listesi güncelleniyor...', state.foods);
    
    if (state.foods.length === 0) {
        elements.foodList.innerHTML = `
            <li class="empty-state">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgM0gyMVY1SDFWM1pNMSA5SDExVjExSDFWOVpNMSAxM0gxNVYxNUgxVjEzWk0xIDE3SDE5VjE5SDFWMTdaTTE5IDEzSDE3VjE5SDE5VjEzWk0xOSA5SDE3VjExSDE5VjlaTTE1IDlIMTNWMTFIMTVWOVpNMTEgOUg5VjExSDExVjlaTTcgOUg1VjExSDdWOVoiIGZpbGw9IiNiZGJkYmQiLz4KPC9zdmc+Cg==" alt="">
                <p>Henüz yemek eklenmedi</p>
            </li>
        `;
    } else {
        elements.foodList.innerHTML = state.foods
            .map(food => `
                <li class="food-item" data-id="${food.id}">
                    <span class="food-name">${food.name}</span>
                    <div class="food-macros">
                        <span class="food-calories">${food.calories} kcal</span>
                        <span class="food-protein">P: ${food.protein}g</span>
                        <span class="food-carbs">K: ${food.carbs}g</span>
                        <span class="food-fat">Y: ${food.fat}g</span>
                    </div>
                    <button class="delete-btn" onclick="deleteFood('${food.id}')" aria-label="Sil">×</button>
                </li>
            `)
            .join('');
    }
    
    // Yemek sayısını güncelle
    if (elements.foodCount) {
        elements.foodCount.textContent = `${state.foods.length} öğün`;
    }
}

// Yemek ekleme işlemi
function handleAddFood(e) {
    e.preventDefault();
    console.log('Yemek ekleme işlemi başlatıldı');
    
    try {
        // Form değerlerini al
        const foodName = elements.foodNameInput.value.trim();
        const calories = parseInt(elements.foodCaloriesInput.value) || 0;
        const protein = parseInt(elements.foodProteinInput.value) || 0;
        const carbs = parseInt(elements.foodCarbsInput.value) || 0;
        const fat = parseInt(elements.foodFatInput.value) || 0;

        console.log('Form değerleri:', { foodName, calories, protein, carbs, fat });

        // Giriş doğrulama
        if (!foodName) {
            showNotification('Lütfen bir yemek adı girin', 'error');
            elements.foodNameInput.focus();
            return;
        }

        if (calories <= 0) {
            showNotification('Lütfen geçerli bir kalori değeri girin', 'error');
            elements.foodCaloriesInput.focus();
            return;
        }

        const food = {
            id: Date.now().toString(),
            name: foodName,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            timestamp: new Date().toISOString()
        };
        
        console.log('Eklenecek yemek:', food);
        
        // State'i güncelle
        state.foods.push(food);
        state.dailyCalories += food.calories;
        state.macros.protein.current += food.protein;
        state.macros.carbs.current += food.carbs;
        state.macros.fat.current += food.fat;
        
        console.log('State güncellendi:', state);
        
        // UI'ı güncelle
        updateUI();
        
        // Formu temizle
        elements.foodForm.reset();
        
        // Başarı mesajı göster
        showNotification(`${food.name} başarıyla eklendi!`, 'success');
        
        // İlk inputa odaklan
        elements.foodNameInput.focus();
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluştu:', error);
        showNotification('Yemek eklenirken bir hata oluştu', 'error');
    }
}

// Yemek silme işlemi
function deleteFood(foodId) {
    console.log('Yemek siliniyor:', foodId);
    
    try {
        const foodIndex = state.foods.findIndex(food => food.id === foodId);
        if (foodIndex === -1) {
            console.error('Silinecek yemek bulunamadı:', foodId);
            return;
        }
        
        const deletedFood = state.foods[foodIndex];
        
        // State'i güncelle
        state.foods.splice(foodIndex, 1);
        state.dailyCalories -= deletedFood.calories;
        state.macros.protein.current -= deletedFood.protein;
        state.macros.carbs.current -= deletedFood.carbs;
        state.macros.fat.current -= deletedFood.fat;
        
        // UI'ı güncelle
        updateUI();
        
        // Bildirim göster
        showNotification(`${deletedFood.name} silindi`, 'info');
        
    } catch (error) {
        console.error('Yemek silinirken hata oluştu:', error);
        showNotification('Yemek silinirken bir hata oluştu', 'error');
    }
}

// Event listener'ları ekle
function setupEventListeners() {
    console.log('Event listener\'lar ekleniyor...');
    
    if (elements.foodForm) {
        console.log('Form bulundu, submit event listener ekleniyor');
        elements.foodForm.addEventListener('submit', handleAddFood);
    } else {
        console.error('Form elementi bulunamadı!');
    }
}

// Uygulamayı başlat
function initializeApp() {
    console.log('Uygulama başlatılıyor...');
    
    try {
        // DOM elementleri al
        getDomElements();
        
        // Tarihi güncelle
        updateDate();
        
        // Event listener'ları ekle
        setupEventListeners();
        
        // İlk UI güncellemesi
        updateUI();
        
        console.log('Uygulama başarıyla başlatıldı!');
        showNotification('Uygulama hazır!', 'success');
        
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
        showNotification('Uygulama başlatılırken bir hata oluştu', 'error');
    }
}

// Global fonksiyonları ekle (HTML'den çağrılabilmesi için)
window.deleteFood = deleteFood;
window.appState = state;

// DOM yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM yüklendi, uygulama başlatılıyor...');
    initializeApp();
});

// Hata yakalama
window.addEventListener('error', (event) => {
    console.error('Global hata yakalandı:', event.error || event.message || 'Bilinmeyen hata');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Yakalanmamış Promise hatası:', event.reason);
});

console.log('App-new.js yüklendi'); 