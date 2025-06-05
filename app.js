// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyCpiXP1B7hhnOUD9Xb6FM4mLg6nFADnwE0",
    authDomain: "kalorimax-cbaf3.firebaseapp.com",
    projectId: "kalorimax-cbaf3",
    storageBucket: "kalorimax-cbaf3.appspot.com",
    messagingSenderId: "127418740425",
    appId: "1:127418740425:web:8aebe0e5f27afdcb9be718",
    measurementId: "G-4W0TVYEH43"
};

// Firebase kurallarını ayarlamak için:
// 1. Firebase Console'da Firestore Database > Kurallar sekmesine gidin
// 2. Aşağıdaki kuralları yapıştırın ve Yayınla'ya tıklayın:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const analytics = firebase.analytics();

// State yönetimi
const state = {
    dailyCalories: 0,
    dailyGoal: 2000,
    foods: [],
    macros: {
        protein: { current: 0, goal: 150 },
        carbs: { current: 0, goal: 200 },
        fat: { current: 0, goal: 65 }
    },
    userId: null
};

// Kimlik doğrulama durumunu dinle
function initAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            state.userId = user.uid;
            loadUserData();
        } else {
            // Misafir girişi
            auth.signInAnonymously().catch(error => {
                console.error("Anonim giriş hatası:", error);
                showNotification("Giriş yapılamadı. Lütfen sayfayı yenileyin.", "error");
            });
        }
    });
}

// Kullanıcı verilerini yükle
async function loadUserData() {
    if (!state.userId) return;
    
    try {
        const userDoc = await db.collection('users').doc(state.userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            state.dailyCalories = userData.dailyCalories || 0;
            state.dailyGoal = userData.dailyGoal || 2000;
            state.foods = userData.foods || [];
            state.macros = userData.macros || {
                protein: { current: 0, goal: 150 },
                carbs: { current: 0, goal: 200 },
                fat: { current: 0, goal: 65 }
            };
        } else {
            // Yeni kullanıcı için varsayılan verileri kaydet
            await saveUserData();
        }
        
        updateUI();
    } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        showNotification("Veriler yüklenirken bir hata oluştu.", "error");
    }
}

// Kullanıcı verilerini kaydet
async function saveUserData() {
    if (!state.userId) return;
    
    try {
        await db.collection('users').doc(state.userId).set({
            dailyCalories: state.dailyCalories,
            dailyGoal: state.dailyGoal,
            foods: state.foods,
            macros: state.macros,
            lastUpdated: new Date()
        }, { merge: true });
    } catch (error) {
        console.error("Veri kaydedilirken hata oluştu:", error);
        throw error;
    }
}

// DOM elementleri
const foodForm = document.getElementById('food-form');
const foodNameInput = document.getElementById('food-name');
const foodCaloriesInput = document.getElementById('food-calories');
const foodList = document.getElementById('food-items');
const calorieCount = document.querySelector('.calorie-count');
const foodCount = document.querySelector('.food-count');

// Animasyonlu sayma efekti
function animateValue(element, start, end, duration = 800) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Easing fonksiyonu
        const currentValue = Math.floor(start + (range * easedProgress));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Yemek ekleme işlevi
async function addFood(e) {
    e.preventDefault();
    
    const name = foodNameInput.value.trim();
    const calories = parseInt(foodCaloriesInput.value);
    
    if (name === '' || isNaN(calories) || calories <= 0) {
        showNotification('Lütfen geçerli bir yemek adı ve kalori girin.', 'error');
        return;
    }
    
    const addButton = document.getElementById('add-food-btn');
    const buttonText = addButton.querySelector('.button-text');
    const originalText = buttonText.textContent;
    
    try {
        if (!state.userId) {
            throw new Error('Kullanıcı girişi yapılamadı. Lütfen sayfayı yenileyin.');
        }
        
        addButton.disabled = true;
        buttonText.textContent = 'Ekleniyor...';
        
        const food = {
            id: Date.now(),
            name,
            calories,
            timestamp: new Date()
        };
        
        // State'i güncelle
        state.foods.unshift(food);
        state.dailyCalories += calories;
        
        // Makro besinleri güncelle
        state.macros.protein.current += Math.floor(Math.random() * 5) + 2;
        state.macros.carbs.current += Math.floor(calories * 0.6 / 4);
        state.macros.fat.current += Math.floor(Math.random() * 3) + 1;
        
        // Firebase'e kaydet
        await saveUserData();
        
        // UI'ı güncelle
        updateUI();
        
        showNotification(`${name} başarıyla eklendi!`, 'success');
        foodForm.reset();
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluştu:', error);
        showNotification(error.message || 'Bir hata oluştu, lütfen tekrar deneyin.', 'error');
        
        // Hata durumunda state'i yeniden yükle
        if (state.userId) {
            await loadUserData();
        }
    } finally {
        addButton.disabled = false;
        buttonText.textContent = originalText;
        foodNameInput.focus();
    }
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animasyon için
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Yemek silme işlevi
async function deleteFood(id) {
    const foodIndex = state.foods.findIndex(food => food.id === id);
    if (foodIndex === -1) return;
    
    // Animasyon için yemek öğesini bul
    const foodItem = document.querySelector(`.food-item [data-id="${id}"]`)?.closest('.food-item');
    if (!foodItem) return;
    
    // Silme animasyonu
    foodItem.style.opacity = '0';
    foodItem.style.transform = 'translateX(100%)';
    foodItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    try {
        // State'ten yemeği kaldır
        const [deletedFood] = state.foods.splice(foodIndex, 1);
        
        // Kaloriyi güncelle (negatif değerleri önle)
        state.dailyCalories = Math.max(0, state.dailyCalories - deletedFood.calories);
        
        // Makro besinleri güncelle (negatif değerleri önle)
        const proteinReduction = Math.min(state.macros.protein.current, 3);
        const carbsReduction = Math.min(state.macros.carbs.current, Math.floor(deletedFood.calories * 0.6 / 4));
        const fatReduction = Math.min(state.macros.fat.current, 2);
        
        state.macros.protein.current = Math.max(0, state.macros.protein.current - proteinReduction);
        state.macros.carbs.current = Math.max(0, state.macros.carbs.current - carbsReduction);
        state.macros.fat.current = Math.max(0, state.macros.fat.current - fatReduction);
        
        // Firebase'e kaydet
        await saveUserData();
        
        // UI'ı güncelle
        updateUI();
        
        // Geri alma bildirimi göster
        showUndoNotification(deletedFood);
        
    } catch (error) {
        console.error('Yemek silinirken hata oluştu:', error);
        showNotification('Yemek silinirken bir hata oluştu.', 'error');
        
        // Hata durumunda state'i yeniden yükle
        if (state.userId) {
            await loadUserData();
        }
    }
}

// Geri alma bildirimi gösterme
function showUndoNotification(food) {
    const notification = document.createElement('div');
    notification.className = 'notification info undo-notification';
    notification.innerHTML = `
        <span>${food.name} silindi</span>
        <button class="undo-btn" data-id="${food.id}">Geri Al</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animasyon için
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Geri alma butonuna tıklama
    const undoBtn = notification.querySelector('.undo-btn');
    undoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        undoDelete(food);
        notification.remove();
    });
    
    // 5 saniye sonra kaldır
    const timeoutId = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Üzerine gelindiğinde zamanlayıcıyı durdur
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
    
    // Üzerinden çıkıldığında zamanlayıcıyı yeniden başlat
    notification.addEventListener('mouseleave', () => {
        clearTimeout(timeoutId);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    });
}

// Silme işlemini geri alma
function undoDelete(food) {
    // Yemeği tekrar ekle
    state.foods.unshift(food);
    state.dailyCalories += food.calories;
    
    // Makro besinleri güncelle
    state.macros.protein.current = Math.min(
        state.macros.protein.goal,
        state.macros.protein.current + 3
    );
    state.macros.carbs.current = Math.min(
        state.macros.carbs.goal,
        state.macros.carbs.current + Math.floor(food.calories * 0.6 / 4)
    );
    state.macros.fat.current = Math.min(
        state.macros.fat.goal,
        state.macros.fat.current + 2
    );
    
    // UI'ı güncelle
    updateUI();
    
    // Kullanıcıya bildir
    showNotification(`${food.name} geri yüklendi`, 'success');
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
    
    // Yemek sayısını güncelle
    const itemCount = state.foods.length;
    const countText = itemCount === 0 ? 'Henüz yemek yok' : `${itemCount} öğün`;
    document.querySelector('.food-count').textContent = countText;
    
    // Boş durum gösterimi
    if (itemCount === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgM0gyMVY1SDFWM1pNMSA5SDExVjExSDFWOVpNMSAxM0gxNVYxNUgxVjEzWk0xIDE3SDE5VjE5SDFWMTdaTTE5IDEzSDE3VjE5SDE5VjEzWk0xOSA5SDE3VjExSDE5VjlaTTE1IDlIMTNWMTFIMTVWOVpNMTEgOUg5VjExSDExVjlaTTcgOUg1VjExSDdWOVoiIGZpbGw9IiNiZGJkYmQiLz4KPC9zdmc+Cg==" alt="">
            <p>Henüz yemek eklenmedi</p>
        `;
        foodList.appendChild(emptyState);
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
            <button class="delete-btn" data-id="${food.id}" aria-label="${food.name} yemeğini sil">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6C5.45 4 5 4.45 5 5C5 5.55 5.45 6 6 6H18C18.55 6 19 5.55 19 5C19 4.45 18.55 4 18 4Z" fill="currentColor"/>
                </svg>
            </button>
        `;
        
        // Animasyon ekle
        li.style.opacity = '0';
        li.style.transform = 'translateY(10px)';
        li.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        foodList.appendChild(li);
        
        // Rafine animasyon efekti
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);
    });
    
    // Silme butonlarına event listener ekle
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(button.getAttribute('data-id'));
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

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Event listener'ları ekle
        foodForm.addEventListener('submit', addFood);
        
        // Firebase'i başlat ve kimlik doğrulamasını yap
        initAuth();
        
        // Karanlık mod kontrolü
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
        
        // Sistem teması değişikliklerini dinle
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
        
        // Uygulamayı başlat
        updateDate();
        initEventListeners();
        updateUI();
        
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
        showNotification('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
    }
});

// Sayfa yüklendiğinde uygulamayı başlat
window.addEventListener('load', () => {
    updateDate();
    initEventListeners();
    updateUI();
});
