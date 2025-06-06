import { ERROR_MESSAGES, DEFAULT_GOALS, getDomElements } from './modules/config.js';
import { signInUser, loadUserData, saveUserData, onAuthStateChangedListener } from './modules/firebaseService.js';
import { showNotification, updateMacroBar, updateDate } from './modules/uiService.js';

// Uygulama durumu
const state = {
    foods: [],
    dailyCalories: 0,
    dailyGoal: DEFAULT_GOALS.dailyCalories,
    macros: {
        protein: { current: 0, goal: DEFAULT_GOALS.macros.protein },
        carbs: { current: 0, goal: DEFAULT_GOALS.macros.carbs },
        fat: { current: 0, goal: DEFAULT_GOALS.macros.fat }
    },
    userId: null
};

// DOM elementleri
const elements = getDomElements();

// Uygulamayı başlat
async function initializeApp() {
    try {
        // Tarihi güncelle
        updateDate();
        
        // Event listener'ları ekle
        setupEventListeners();
        
        // Firebase kimlik doğrulamasını başlat
        await initAuth();
        
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
        showNotification('Uygulama başlatılırken bir hata oluştu', 'error');
    }
}

// Kimlik doğrulama işlemleri
async function initAuth() {
    try {
        // Anonim giriş yap
        const userId = await signInUser();
        state.userId = userId;
        
        // Kullanıcı verilerini yükle
        await loadUserState();
        
        // UI'ı güncelle
        updateUI();
        
    } catch (error) {
        console.error('Kimlik doğrulama hatası:', error);
        showNotification('Giriş yapılırken bir hata oluştu', 'error');
    }
}

// Kullanıcı durumunu yükle
async function loadUserState() {
    if (!state.userId) return;
    
    try {
        const userData = await loadUserData(state.userId);
        
        if (userData) {
            // Kullanıcı verilerini güncelle
            state.foods = userData.foods || [];
            state.dailyCalories = userData.dailyCalories || 0;
            state.dailyGoal = userData.dailyGoal || DEFAULT_GOALS.dailyCalories;
            
            // Makro besinleri güncelle
            Object.keys(state.macros).forEach(macro => {
                state.macros[macro] = {
                    current: userData.macros?.[macro]?.current || 0,
                    goal: userData.macros?.[macro]?.goal || DEFAULT_GOALS.macros[macro]
                };
            });
        } else {
            // Yeni kullanıcı için varsayılan değerler
            await saveUserState();
        }
    } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
        throw error;
    }
}

// Kullanıcı durumunu kaydet
async function saveUserState() {
    if (!state.userId) return;
    
    try {
        await saveUserData(state.userId, {
            foods: state.foods,
            dailyCalories: state.dailyCalories,
            dailyGoal: state.dailyGoal,
            macros: state.macros,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Kullanıcı verileri kaydedilirken hata:', error);
        throw error;
    }
}

// Event listener'ları ekle
function setupEventListeners() {
    if (elements.foodForm) {
        elements.foodForm.addEventListener('submit', handleAddFood);
    }
    
    // Diğer event listener'lar buraya eklenecek
}

// Yemek ekleme işlemi
async function handleAddFood(e) {
    e.preventDefault();
    
    try {
        const food = {
            id: Date.now().toString(),
            name: elements.foodNameInput.value.trim(),
            calories: parseInt(elements.foodCaloriesInput.value) || 0,
            protein: parseInt(elements.foodProteinInput.value) || 0,
            carbs: parseInt(elements.foodCarbsInput.value) || 0,
            fat: parseInt(elements.foodFatInput.value) || 0,
            timestamp: new Date().toISOString()
        };
        
        // State'i güncelle
        state.foods.push(food);
        state.dailyCalories += food.calories;
        state.macros.protein.current += food.protein;
        state.macros.carbs.current += food.carbs;
        state.macros.fat.current += food.fat;
        
        // Veritabanını güncelle
        await saveUserState();
        
        // UI'ı güncelle
        updateUI();
        
        // Formu temizle
        elements.foodForm.reset();
        
        // Başarı mesajı göster
        showNotification(`${food.name} başarıyla eklendi`, 'success');
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluştu:', error);
        showNotification(ERROR_MESSAGES.DATA_SAVE, 'error');
    }
}

// UI'ı güncelle
function updateUI() {
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
    if (!elements.foodList) return;
    
    elements.foodList.innerHTML = state.foods
        .map(food => `
            <div class="food-item" data-id="${food.id}">
                <span class="food-name">${food.name}</span>
                <div class="food-macros">
                    <span class="food-calories">${food.calories} kcal</span>
                    <span class="food-protein">P: ${food.protein}g</span>
                    <span class="food-carbs">K: ${food.carbs}g</span>
                    <span class="food-fat">Y: ${food.fat}g</span>
                </div>
                <button class="delete-btn" data-id="${food.id}" aria-label="Sil">×</button>
            </div>
        `)
        .join('');
    
    // Silme butonlarına event listener ekle
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteFood);
    });
}

// Yemek silme işlemi
async function handleDeleteFood(e) {
    const foodId = e.target.dataset.id;
    if (!foodId) return;
    
    try {
        const foodIndex = state.foods.findIndex(food => food.id === foodId);
        if (foodIndex === -1) return;
        
        const deletedFood = state.foods[foodIndex];
        
        // State'i güncelle
        state.foods.splice(foodIndex, 1);
        state.dailyCalories -= deletedFood.calories;
        state.macros.protein.current -= deletedFood.protein;
        state.macros.carbs.current -= deletedFood.carbs;
        state.macros.fat.current -= deletedFood.fat;
        
        // Veritabanını güncelle
        await saveUserState();
        
        // UI'ı güncelle
        updateUI();
        
        // Geri alma bildirimi göster
        showUndoNotification(deletedFood, foodIndex);
        
    } catch (error) {
        console.error('Yemek silinirken hata oluştu:', error);
        showNotification('Yemek silinirken bir hata oluştu', 'error');
    }
}

// Geri alma bildirimi göster
function showUndoNotification(food, originalIndex) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-info';
    notification.innerHTML = `
        <span>${food.name} silindi</span>
        <button class="undo-btn">Geri Al</button>
    `;
    
    document.body.appendChild(notification);
    
    // Geri al butonuna tıklama olayı
    const undoBtn = notification.querySelector('.undo-btn');
    const undoHandler = async () => {
        try {
            // Yemeği geri ekle
            state.foods.splice(originalIndex, 0, food);
            state.dailyCalories += food.calories;
            state.macros.protein.current += food.protein;
            state.macros.carbs.current += food.carbs;
            state.macros.fat.current += food.fat;
            
            // Veritabanını güncelle
            await saveUserState();
            
            // UI'ı güncelle
            updateUI();
            
            // Bildirimi kaldır
            notification.remove();
            
        } catch (error) {
            console.error('Geri alma işlemi sırasında hata:', error);
            showNotification('Geri alma işlemi başarısız oldu', 'error');
        }
    };
    
    undoBtn.addEventListener('click', undoHandler);
    
    // 5 saniye sonra bildirimi kaldır
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', initializeApp);
