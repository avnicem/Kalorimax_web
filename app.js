// Uygulama durumu
const state = {
    dailyCalories: 0,
    dailyGoal: 2000,
    foods: [],
    macros: {
        protein: { current: 0, goal: 150 },
        carbs: { current: 0, goal: 250 },
        fat: { current: 0, goal: 65 }
    }
};

// DOM elementleri
const foodForm = document.querySelector('.add-food');
const foodNameInput = document.getElementById('food-name');
const foodCaloriesInput = document.getElementById('food-calories');
const addFoodBtn = document.getElementById('add-food-btn');
const foodList = document.getElementById('food-items');
const calorieCount = document.querySelector('.calorie-count');

// Yemek ekleme işlevi
function addFood(e) {
    e.preventDefault();
    
    const name = foodNameInput.value.trim();
    const calories = parseInt(foodCaloriesInput.value);
    
    if (name === '' || isNaN(calories)) {
        alert('Lütfen geçerli bir yemek adı ve kalori girin.');
        return;
    }
    
    const food = {
        id: Date.now(),
        name,
        calories
    };
    
    // State'i güncelle
    state.foods.push(food);
    state.dailyCalories += calories;
    
    // Makro besinleri rastgele ekleyelim (gerçek uygulamada bu veriler API'den gelecek)
    state.macros.protein.current += Math.floor(Math.random() * 5) + 2;
    state.macros.carbs.current += Math.floor(calories * 0.6 / 4);
    state.macros.fat.current += Math.floor(Math.random() * 3) + 1;
    
    // UI'ı güncelle
    updateUI();
    
    // Formu temizle
    foodNameInput.value = '';
    foodCaloriesInput.value = '';
    
    // Odağı ilk inputa ver
    foodNameInput.focus();
}

// Yemek silme işlevi
function deleteFood(id) {
    const foodIndex = state.foods.findIndex(food => food.id === id);
    if (foodIndex === -1) return;
    
    // State'ten yemeği kaldır
    const [deletedFood] = state.foods.splice(foodIndex, 1);
    
    // Kaloriyi güncelle
    state.dailyCalories -= deletedFood.calories;
    
    // Makro besinleri güncelle (basitleştirilmiş)
    state.macros.protein.current = Math.max(0, state.macros.protein.current - 3);
    state.macros.carbs.current = Math.max(0, state.macros.carbs.current - Math.floor(deletedFood.calories * 0.6 / 4));
    state.macros.fat.current = Math.max(0, state.macros.fat.current - 2);
    
    // UI'ı güncelle
    updateUI();
}

// UI'ı güncelleme işlevi
function updateUI() {
    // Kalori sayacını güncelle
    calorieCount.textContent = state.dailyCalories;
    
    // Makro çubuklarını güncelle
    updateMacroBar('protein', state.macros.protein.current, state.macros.protein.goal);
    updateMacroBar('carbs', state.macros.carbs.current, state.macros.carbs.goal);
    updateMacroBar('fat', state.macros.fat.current, state.macros.fat.goal);
    
    // Yemek listesini güncelle
    renderFoodList();
}

// Makro çubuklarını güncelleme işlevi
function updateMacroBar(macro, current, goal) {
    const fillElement = document.querySelector(`.macro-${macro} .macro-fill`);
    const amountElement = document.querySelector(`.macro-${macro} .macro-amount`);
    
    if (!fillElement || !amountElement) return;
    
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    fillElement.style.width = `${percentage}%`;
    amountElement.textContent = `${current}g`;
    
    // Renk ayarı
    if (percentage > 100) {
        fillElement.style.backgroundColor = '#f44336'; // Kırmızı
    } else if (percentage > 80) {
        fillElement.style.backgroundColor = '#4CAF50'; // Yeşil
    } else {
        fillElement.style.backgroundColor = '#2196F3'; // Mavi
    }
}

// Yemek listesini oluşturma işlevi
function renderFoodList() {
    // Listeyi temizle
    foodList.innerHTML = '';
    
    if (state.foods.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Henüz yemek eklenmedi.';
        emptyMessage.style.color = '#757575';
        emptyMessage.style.padding = '10px 0';
        foodList.appendChild(emptyMessage);
        return;
    }
    
    // Yemekleri listeye ekle
    state.foods.forEach(food => {
        const li = document.createElement('li');
        li.className = 'food-item';
        li.innerHTML = `
            <div class="food-info">
                <span class="food-name">${food.name}</span>
                <span class="food-calories">${food.calories} kcal</span>
            </div>
            <button class="delete-btn" data-id="${food.id}">Sil</button>
        `;
        foodList.appendChild(li);
    });
    
    // Silme butonlarına event listener ekle
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteFood(id);
        });
    });
}

// Tarihi güncelleme işlevi
function updateDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = now.toLocaleDateString('tr-TR', options);
    document.querySelector('.date').textContent = dateString;
}

// Event listener'ları ekle
function initEventListeners() {
    addFoodBtn.addEventListener('click', addFood);
    
    // Enter tuşu ile form gönderme
    foodForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFood(e);
        }
    });
}

// Uygulamayı başlat
function init() {
    updateDate();
    initEventListeners();
    updateUI();
}

// Sayfa yüklendiğinde uygulamayı başlat
window.addEventListener('DOMContentLoaded', init);
