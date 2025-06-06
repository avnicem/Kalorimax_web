//
KaloriMax
Uygulaması
// Firebase yapÄ±landÄ±rmasÄ±
const firebaseConfig = {
    apiKey: "AIzaSyCpiXP1B7hhnOUD9Xb6FM4mLg6nFADnwE0",
    authDomain: "kalorimax-cbaf3.firebaseapp.com",
    databaseURL: "https://kalorimax-cbaf3-default-rtdb.firebaseio.com",
    projectId: "kalorimax-cbaf3",
    storageBucket: "kalorimax-cbaf3.appspot.com",
    messagingSenderId: "127418740425",
    appId: "1:127418740425:web:8aebe0e5f27afdcb9be718",
    measurementId: "G-4W0TVYEH43"
};

// Firebase uygulamasÄ±nÄ±n zaten baÅŸlatÄ±lÄ±p baÅŸlatÄ±lmadÄ±ÄŸÄ±nÄ± kontrol et
function getFirebaseApp() {
    try {
        const apps = firebase.apps;
        if (apps.length === 0) {
            console.log('Firebase uygulamasÄ± baÅŸlatÄ±lÄ±yor...');
            return firebase.initializeApp(firebaseConfig);
        } else {
            console.log('Mevcut Firebase uygulamasÄ± kullanÄ±lÄ±yor');
            return apps[0];
        }
    } catch (error) {
        console.error('Firebase uygulamasÄ± alÄ±nÄ±rken hata oluÅŸtu:', error);
        throw error;
    }
}

// State yÃ¶netimi ve Firebase deÄŸiÅŸkenleri (global scope)
let state;
let db, auth, analytics;

// State'i baÅŸlatma fonksiyonu
function initializeState() {
    if (!state) {
        state = {
            foods: [],
            dailyCalories: 0,
            dailyGoal: 2000,
            macros: {
                protein: { current: 0, goal: 150 },
                carbs: { current: 0, goal: 200 },
                fat: { current: 0, goal: 65 }
            },
            userId: null
        };
    }
    return state;
}

// Firebase baÅŸlatma fonksiyonu
async function initFirebase() {
    try {
        // Firebase uygulamasÄ±nÄ± al veya baÅŸlat
        const app = getFirebaseApp();
        console.log('Firebase baÅŸarÄ±yla baÅŸlatÄ±ldÄ±');
        
        // Firebase servislerini baÅŸlat
        console.log('Firestore baÅŸlatÄ±lÄ±yor...');
        db = firebase.firestore(app);
        
        console.log('Auth baÅŸlatÄ±lÄ±yor...');
        auth = firebase.auth(app);
        
        // Analytics opsiyonel olarak baÅŸlatÄ±lÄ±yor
        try {
            if (firebase.analytics) {
                console.log('Analytics baÅŸlatÄ±lÄ±yor...');
                analytics = firebase.analytics(app);
                console.log('Analytics baÅŸlatÄ±ldÄ±');
            } else {
                console.warn('Firebase Analytics mevcut deÄŸil, atlanÄ±yor...');
            }
        } catch (analyticsError) {
            console.warn('Analytics baÅŸlatÄ±lÄ±rken hata oluÅŸtu:', analyticsError);
        }
        
        console.log('TÃ¼m Firebase servisleri baÅŸlatÄ±ldÄ±');
        return { db, auth, analytics };
    } catch (error) {
        const errorMessage = 'Firebase baÅŸlatÄ±lÄ±rken bir hata oluÅŸtu: ' + (error.message || 'Bilinmeyen hata');
        console.error('Firebase baÅŸlatma hatasÄ±:', error);
        throw new Error(errorMessage);
    }
}

// Kimlik doÄŸrulama durumunu dinle
async function initAuth() {
    console.log('Auth baÅŸlatÄ±lÄ±yor...');
    
    if (!auth) {
        throw new Error('Firebase Auth baÅŸlatÄ±lamadÄ±!');
    }
    
    try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            console.log('Mevcut kullanÄ±cÄ± bulundu:', currentUser.uid);
            state.userId = currentUser.uid;
            await loadUserData();
            return;
        }
        
        console.log('Anonim giriÅŸ deneniyor...');
        const userCredential = await auth.signInAnonymously();
        
        console.log('Anonim giriÅŸ baÅŸarÄ±lÄ±:', userCredential.user.uid);
        state.userId = userCredential.user.uid;
        await loadUserData();
        
    } catch (error) {
        console.error('Kimlik doÄŸrulama hatasÄ±:', error);
        
        let errorMessage = 'GiriÅŸ yapÄ±lamadÄ±: ';
        
        switch(error.code) {
            case 'auth/operation-not-allowed':
                errorMessage += 'Anonim giriÅŸ etkin deÄŸil. LÃ¼tfen Firebase konsolundan etkinleÅŸtirin.';
                break;
            case 'auth/network-request-failed':
                errorMessage += 'AÄŸ baÄŸlantÄ± hatasÄ±. LÃ¼tfen internet baÄŸlantÄ±nÄ±zÄ± kontrol edin.';
                break;
            default:
                errorMessage += error.message || 'Bilinmeyen bir hata oluÅŸtu.';
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
    
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            console.log('Auth state deÄŸiÅŸti: KullanÄ±cÄ± giriÅŸ yaptÄ±', user.uid);
            state.userId = user.uid;
        } else {
            console.log('Auth state deÄŸiÅŸti: KullanÄ±cÄ± Ã§Ä±kÄ±ÅŸ yaptÄ±');
            state.userId = null;
        }
    });
    
    return () => unsubscribe();
}

// KullanÄ±cÄ± verilerini yÃ¼kle
async function loadUserData() {
    if (!state.userId) {
        console.error('KullanÄ±cÄ± giriÅŸi yapÄ±lmadan veri yÃ¼klenemez!');
        return;
    }
    
    console.log('KullanÄ±cÄ± verileri yÃ¼kleniyor...');
    
    try {
        const userDoc = await db.collection('users').doc(state.userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('KullanÄ±cÄ± verileri alÄ±ndÄ±:', userData);
            
            // State'i gÃ¼ncelle
            state.foods = userData.foods || [];
            state.dailyCalories = userData.dailyCalories || 0;
            state.dailyGoal = userData.dailyGoal || 2000;
            state.macros = userData.macros || {
                protein: { current: 0, goal: 150 },
                carbs: { current: 0, goal: 200 },
                fat: { current: 0, goal: 65 }
            };
            
            console.log('KullanÄ±cÄ± verileri yÃ¼klendi');
        } else {
            console.log('KullanÄ±cÄ± verileri bulunamadÄ±, varsayÄ±lan deÄŸerlerle baÅŸlatÄ±lÄ±yor...');
            
            // VarsayÄ±lan deÄŸerlerle yeni bir kullanÄ±cÄ± belgesi oluÅŸtur
            await saveUserData();
        }
        
        // UI'Ä± gÃ¼ncelle
        updateUI();
        
    } catch (error) {
        console.error('KullanÄ±cÄ± verileri yÃ¼klenirken hata oluÅŸtu:', error);
        showNotification('Veriler yÃ¼klenirken bir hata oluÅŸtu. LÃ¼tfen sayfayÄ± yenileyin.', 'error');
        throw error;
    }
}

// KullanÄ±cÄ± verilerini kaydet
async function saveUserData() {
    if (!state.userId) {
        console.error('KullanÄ±cÄ± giriÅŸi yapÄ±lmadan veri kaydedilemez!');
        return;
    }
    
    console.log('KullanÄ±cÄ± verileri kaydediliyor...');
    
    try {
        await db.collection('users').doc(state.userId).set({
            foods: state.foods,
            dailyCalories: state.dailyCalories,
            dailyGoal: state.dailyGoal,
            macros: state.macros,
            lastUpdated: new Date()
        });
        
        console.log('KullanÄ±cÄ± verileri baÅŸarÄ±yla kaydedildi');
        return true;
        
    } catch (error) {
        console.error('KullanÄ±cÄ± verileri kaydedilirken hata oluÅŸtu:', error);
        showNotification('Veriler kaydedilirken bir hata oluÅŸtu. LÃ¼tfen tekrar deneyin.', 'error');
        throw error;
    }
}

// DOM elementleri
const foodForm = document.getElementById('food-form');
const foodNameInput = document.getElementById('food-name');
const foodCaloriesInput = document.getElementById('food-calories');
const foodList = document.getElementById('food-items'); // DÃ¼zeltildi: 'food-list' yerine 'food-items' kullanÄ±lÄ±yor
const calorieCountElement = document.querySelector('.calorie-count'); // Yeni eklendi
const progressBar = document.querySelector('.macro-fill'); // DÃ¼zeltildi: '.progress-bar' yerine '.macro-fill' kullanÄ±lÄ±yor
const macroBars = {
    protein: {
        bar: document.querySelector('.macro-protein .macro-fill'),
        text: document.querySelector('.macro-protein .macro-amount')
    },
    carbs: {
        bar: document.querySelector('.macro-carbs .macro-fill'),
        text: document.querySelector('.macro-carbs .macro-amount')
    },
    fat: {
        bar: document.querySelector('.macro-fat .macro-fill'),
        text: document.querySelector('.macro-fat .macro-amount')
    }
};

// Animasyonlu sayma efekti
function animateValue(element, start, end, duration = 800) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(start + (progress * range));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Yemek ekleme iÅŸlevi
async function addFood(e) {
    e.preventDefault();
    
    try {
        // GiriÅŸ deÄŸerlerini al ve doÄŸrula
        const name = foodNameInput ? foodNameInput.value.trim() : '';
        const calories = foodCaloriesInput ? parseInt(foodCaloriesInput.value) : 0;
        
        // GiriÅŸ doÄŸrulama
        if (!name) {
            showNotification('LÃ¼tfen bir yemek adÄ± girin.', 'error');
            foodNameInput?.focus();
            return;
        }
        
        if (isNaN(calories) || calories <= 0) {
            showNotification('LÃ¼tfen geÃ§erli bir kalori deÄŸeri girin.', 'error');
            foodCaloriesInput?.focus();
            return;
        }
        
        // Yeni yemeÄŸi oluÅŸtur
        const newFood = {
            id: Date.now().toString(),
            name,
            calories,
            date: new Date().toISOString(),
            macros: {
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };
        
        console.log('Yeni yemek eklendi:', newFood);
        
        // State'i gÃ¼ncelle
        if (!state.foods) state.foods = [];
        state.foods.push(newFood);
        state.dailyCalories = (state.dailyCalories || 0) + calories;
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'Ä± gÃ¼ncelle
            updateUI();
            
            // Formu temizle
            if (foodForm) foodForm.reset();
            
            // Ä°mleci ilk alana taÅŸÄ±
            if (foodNameInput) foodNameInput.focus();
            
            // BaÅŸarÄ± bildirimi gÃ¶ster
            showNotification(`âœ“ ${name} baÅŸarÄ±yla eklendi!`, 'success');
            
        } catch (error) {
            console.error('Veri kaydedilirken hata oluÅŸtu:', error);
            // Hata durumunda state'i geri al
            state.foods = state.foods.filter(f => f.id !== newFood.id);
            state.dailyCalories -= calories;
            throw error;
        }
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluÅŸtu:', error);
        showNotification('Yemek eklenirken bir hata oluÅŸtu. LÃ¼tfen tekrar deneyin.', 'error');
    }
}

// Bildirim gÃ¶sterme fonksiyonu
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Bildirimi otomatik kaldÄ±r
    setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Animasyon bittikten sonra elementi kaldÄ±r
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }, 100);
}

// Yemek silme iÅŸlevi
async function deleteFood(id) {
    try {
        if (!state.foods || !Array.isArray(state.foods)) {
            console.error('Yemek listesi geÃ§ersiz');
            return;
        }
        
        const foodIndex = state.foods.findIndex(food => food.id === id);
        
        if (foodIndex === -1) {
            console.error('Silinecek yemek bulunamadÄ±:', id);
            return;
        }
        
        const deletedFood = state.foods[foodIndex];
        
        // State'ten kaldÄ±r
        state.foods.splice(foodIndex, 1);
        state.dailyCalories = Math.max(0, (state.dailyCalories || 0) - (deletedFood.calories || 0));
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'Ä± gÃ¼ncelle
            updateUI();
            
            // Geri alma bildirimi gÃ¶ster
            showUndoNotification(deletedFood);
            
        } catch (error) {
            console.error('Silme iÅŸlemi kaydedilirken hata oluÅŸtu:', error);
            // Hata durumunda state'i geri al
            state.foods.splice(foodIndex, 0, deletedFood);
            state.dailyCalories = (state.dailyCalories || 0) + (deletedFood.calories || 0);
            throw error;
        }
        
    } catch (error) {
        console.error('Yemek silinirken hata oluÅŸtu:', error);
        showNotification('Yemek silinirken bir hata oluÅŸtu. LÃ¼tfen tekrar deneyin.', 'error');
    }
}

// Geri alma bildirimi gÃ¶sterme
function showUndoNotification(food) {
    try {
        if (!food || !food.name) {
            console.error('GeÃ§ersiz yemek bilgisi:', food);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification info';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const message = document.createElement('span');
        message.textContent = `${food.name} silindi. `;
        
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-button';
        undoButton.textContent = 'Geri Al';
        undoButton.setAttribute('aria-label', `${food.name} yemeÄŸini geri al`);
        
        const removeNotification = () => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        };
        
        undoButton.onclick = async (e) => {
            e.stopPropagation();
            try {
                await undoDelete(food);
                removeNotification();
            } catch (error) {
                console.error('Geri alma iÅŸlemi sÄ±rasÄ±nda hata:', error);
            }
        };
        
        notification.appendChild(message);
        notification.appendChild(undoButton);
        
        document.body.appendChild(notification);
        
        // EriÅŸilebilirlik iÃ§in ekran okuyucuya bildir
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = `${food.name} silindi. Geri almak iÃ§in Geri Al butonuna basÄ±n.`;
        notification.appendChild(liveRegion);
        
        // Bildirimi gÃ¶ster
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Bildirimi otomatik kaldÄ±r
        const timeoutId = setTimeout(() => {
            removeNotification();
        }, 5000);
        
        // Fare Ã¼zerine gelindiÄŸinde otomatik kaldÄ±rmayÄ± durdur
        notification.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });
        
        // Fare ayrÄ±ldÄ±ÄŸÄ±nda tekrar baÅŸlat
        notification.addEventListener('mouseleave', () => {
            setTimeout(removeNotification, 2000);
        });
        
    } catch (error) {
        console.error('Bildirim gÃ¶sterilirken hata oluÅŸtu:', error);
    }
}

// Silme iÅŸlemini geri alma
async function undoDelete(food) {
    try {
        if (!food || !food.id) {
            throw new Error('GeÃ§ersiz yemek bilgisi');
        }
        
        // EÄŸer yemek zaten listede varsa iÅŸlem yapma
        if (state.foods.some(f => f.id === food.id)) {
            console.warn('Bu yemek zaten listede mevcut:', food.id);
            return;
        }
        
        // YemeÄŸi tekrar ekle
        state.foods.push(food);
        state.dailyCalories = (state.dailyCalories || 0) + (food.calories || 0);
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'Ä± gÃ¼ncelle
            updateUI();
            
            // BaÅŸarÄ± bildirimi gÃ¶ster
            showNotification(`âœ“ ${food.name} geri yÃ¼klendi!`, 'success');
            
        } catch (error) {
            console.error('Geri alma iÅŸlemi kaydedilirken hata oluÅŸtu:', error);
            // Hata durumunda state'i geri al
            state.foods = state.foods.filter(f => f.id !== food.id);
            state.dailyCalories = Math.max(0, (state.dailyCalories || 0) - (food.calories || 0));
            throw error;
        }
        
    } catch (error) {
        console.error('Geri alma iÅŸlemi sÄ±rasÄ±nda hata oluÅŸtu:', error);
        showNotification('Geri alma iÅŸlemi sÄ±rasÄ±nda bir hata oluÅŸtu.', 'error');
        throw error;
    }
}

// UI'Ä± gÃ¼ncelleme iÅŸlevi
function updateUI() {
    try {
        console.log('UI gÃ¼ncelleniyor...');
        
        // State kontrolÃ¼
        if (!state) {
            console.error('State tanÄ±mlÄ± deÄŸil');
            return;
        }
        
        // Toplam kaloriyi gÃ¼ncelle
        const calorieCountEl = document.querySelector('.calorie-count');
        if (calorieCountEl) {
            calorieCountEl.textContent = state.dailyCalories || 0;
        } else {
            console.warn('Kalori sayacÄ± elementi bulunamadÄ±');
        }
        
        // Hedef kaloriyi gÃ¼ncelle
        const calorieGoalEl = document.querySelector('.calorie-goal');
        if (calorieGoalEl) {
            calorieGoalEl.textContent = `Hedef: ${state.dailyGoal || 2000} kcal`;
        }
        
        // Ä°lerleme Ã§ubuÄŸunu gÃ¼ncelle
        const progressBar = document.querySelector('.macro-fill');
        if (progressBar) {
            const progress = Math.min(((state.dailyCalories || 0) / (state.dailyGoal || 2000)) * 100, 100);
            progressBar.style.width = `${progress}%`;
            
            // Ä°lerleme Ã§ubuÄŸu rengini gÃ¼ncelle
            if (progress >= 100) {
                progressBar.style.backgroundColor = '#ef4444'; // KÄ±rmÄ±zÄ±
            } else if (progress >= 75) {
                progressBar.style.backgroundColor = '#f59e0b'; // Turuncu
            } else {
                progressBar.style.backgroundColor = '#10b981'; // YeÅŸil
            }
        }
        
        // Makro deÄŸerlerini gÃ¼ncelle
        const macros = state.macros || {
            protein: { current: 0, goal: 150 },
            carbs: { current: 0, goal: 200 },
            fat: { current: 0, goal: 65 }
        };
        
        updateMacroBar('protein', macros.protein.current, macros.protein.goal);
        updateMacroBar('carbs', macros.carbs.current, macros.carbs.goal);
        updateMacroBar('fat', macros.fat.current, macros.fat.goal);
        
        // Yemek listesini gÃ¼ncelle
        renderFoodList();
        
        console.log('UI gÃ¼ncellemesi tamamlandÄ±');
    } catch (error) {
        console.error('UI gÃ¼ncellenirken hata oluÅŸtu:', error);
    }
}

// Makro Ã§ubuÄŸu gÃ¼ncelleme iÅŸlevi
function updateMacroBar(macro, current, goal) {
    try {
        // Geçerli değerleri kontrol et
        current = Number(current) || 0;
        goal = Number(goal) || 0;
        
        // Makro türüne göre doğru sınıfı seç
        let macroClass = '';
        switch(macro) {
            case 'protein':
                macroClass = '.macro-protein';
                break;
            case 'carbs':
                macroClass = '.macro-carbs';
                break;
            case 'fat':
                macroClass = '.macro-fat';
                break;
            default:
                console.warn('Bilinmeyen makro türü:', macro);
                return;
        }
        
        // Elementleri seç - Sadece sınıf adını kullanarak seç
        const macroContainer = document.querySelector(macroClass);
        if (!macroContainer) {
            console.warn(`${macro} makro elementi bulunamadı (${macroClass})`);
            return;
        }
        
        const bar = macroContainer.querySelector('.macro-fill');
        const text = macroContainer.querySelector('.macro-amount');
        
        if (!bar) {
            console.warn(`${macro} için çubuk elementi bulunamadı`);
            return;
        }
        
        if (!text) {
            console.warn(`${macro} için miktar metni bulunamadı`);
            return;
        }
        
        // Yüzde hesapla
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        
        // Görsel güncellemeleri yap
        bar.style.width = `${percentage}%`;
        text.textContent = `${current.toFixed(0)}g / ${goal.toFixed(0)}g`;
        
        // Renk güncelleme
        if (percentage >= 100) {
            bar.style.backgroundColor = '#ef4444'; // Kırmızı
        } else if (percentage >= 75) {
            bar.style.backgroundColor = '#f59e0b'; // Turuncu
        } else {
            bar.style.backgroundColor = '#10b981'; // Yeşil
        }
        
        console.log(`${macro} çubuğu güncellendi: ${current}g / ${goal}g (${percentage.toFixed(1)}%)`);
        
    } catch (error) {
        console.error(`${macro} çubuğu güncellenirken hata oluştu:`, error);
    }
}

// Yemek listesini oluşturma işlevi
function renderFoodList() {
    try {
        if (!foodList) {
            console.warn('Yemek listesi elementi bulunamadÄ±');
            return;
        }
        
        // Listeyi temizle
        foodList.innerHTML = '';
        
        if (!state.foods || state.foods.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgM0gyMVY1SDFWM1pNMSA5SDExVjExSDFWOVpNMSAxM0gxNVYxNUgxVjEzWk0xIDE3SDE5VjE5SDFWMTdaTTE5IDEzSDE3VjE5SDE5VjEzWk0xOSA5SDE3VjExSDE5VjlaTTE1IDlIMTNWMTFIMTVWOVpNMTEgOUg5VjExSDExVjlaTTcgOUg1VjExSDdWOVoiIGZpbGw9IiNiZGJkYmQiLz4KPC9zdmc+Cg==" alt="">
                <p>HenÃ¼z yemek eklenmedi</p>
            `;
            foodList.appendChild(emptyState);
            return;
        }
        
        // EÄŸer yemek yoksa boÅŸ durum mesajÄ±nÄ± gÃ¶ster
        if (state.foods.length === 0) {
            foodList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 3h18v18H3z"></path>
                        <path d="M9 9h6v6H9z"></path>
                    </svg>
                    <p>HenÃ¼z yemek eklenmedi</p>
                    <small>Yeni bir yemek eklemek iÃ§in yukarÄ±daki formu kullanÄ±n</small>
                </div>
            `;
            return;
        }
        
        try {
            // Yemek listesini tarihe gÃ¶re sÄ±rala (en yeni en Ã¼stte)
            const sortedFoods = [...state.foods].sort((a, b) => {
                return new Date(b.date || 0) - new Date(a.date || 0);
            });
            
            // Yemek listesini oluÅŸtur
            foodList.innerHTML = sortedFoods.map(food => `
                <li class="food-item" data-id="${food.id}">
                    <div class="food-info">
                        <span class="food-name">${food.name || 'Ä°simsiz'}</span>
                        <span class="food-calories">${food.calories || 0} kcal</span>
                    </div>
                    <button class="delete-food" data-id="${food.id}" aria-label="${food.name || 'Bu yemeÄŸi'} sil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </li>
            `).join('');
            
            // Yemek sayÄ±sÄ±nÄ± gÃ¼ncelle
            updateFoodCount();
            
        } catch (error) {
            console.error('Yemek listesi oluÅŸturulurken hata oluÅŸtu:', error);
            foodList.innerHTML = `
                <div class="empty-state error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>Yemek listesi yÃ¼klenirken bir hata oluÅŸtu</p>
                    <button class="retry-button" onclick="location.reload()">Yeniden Dene</button>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Yemek listesi oluÅŸturulurken beklenmeyen bir hata oluÅŸtu:', error);
    }
}

// Yemek sayÄ±sÄ±nÄ± gÃ¼ncelleme iÅŸlevi
function updateFoodCount() {
    try {
        const foodCountElement = document.querySelector('.food-count');
        if (!foodCountElement) {
            console.warn('Yemek sayacÄ± elementi bulunamadÄ±');
            return;
        }
        
        // State kontrolÃ¼
        if (!state || !Array.isArray(state.foods)) {
            foodCountElement.textContent = '0 Ã¶ÄŸÃ¼n';
            return;
        }
        
        const count = state.foods.length;
        
        // Ã‡oÄŸul/tekil form kontrolÃ¼
        const mealText = count === 1 ? 'Ã¶ÄŸÃ¼n' : 'Ã¶ÄŸÃ¼n';
        
        // Toplam kaloriyi hesapla
        const totalCalories = state.foods.reduce((sum, food) => {
            return sum + (Number(food.calories) || 0);
        }, 0);
        
        // GÃ¼ncelle
        foodCountElement.innerHTML = `
            <span class="count">${count} ${mealText}</span>
            <span class="divider">â€¢</span>
            <span class="calories">Toplam ${totalCalories} kcal</span>
        `;
        
    } catch (error) {
        console.error('Yemek sayÄ±sÄ± gÃ¼ncellenirken hata oluÅŸtu:', error);
    }
}

// Tarihi gÃ¼ncelleme iÅŸlevi
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('tr-TR', options);
    }
}

// Event listener'larÄ± ekle
function initEventListeners() {
    try {
        // Yemek ekleme formu
        if (foodForm) {
            foodForm.addEventListener('submit', addFood);
        } else {
            console.error('Yemek formu bulunamadÄ±!');
        }
        
        // Silme butonlarÄ± iÃ§in event delegation
        if (foodList) {
            foodList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-button')) {
                    const foodItem = e.target.closest('.food-item');
                    if (foodItem && foodItem.dataset.id) {
                        deleteFood(foodItem.dataset.id);
                    }
                }
            });
        } else {
            console.error('Yemek listesi bulunamadÄ±!');
        }
        
        console.log('TÃ¼m event listenerlar baÅŸarÄ±yla eklendi');
    } catch (error) {
        console.error('Event listener eklenirken hata oluÅŸtu:', error);
        showNotification('Sayfa Ã¶ÄŸeleri yÃ¼klenirken bir hata oluÅŸtu. LÃ¼tfen sayfayÄ± yenileyin.', 'error');
        throw error;
    }
}

// Uygulama baÅŸlatma fonksiyonu
async function initializeApp() {
    console.log('Uygulama baÅŸlatÄ±lÄ±yor...');
    
    try {
        // State'i baÅŸlat
        initializeState();
        
        // TÃ¼m baÅŸlangÄ±Ã§ iÅŸlemlerini sÄ±rayla yap
        console.log('Tarih gÃ¼ncelleniyor...');
        updateDate();
        
        console.log('Event listenerlar ekleniyor...');
        initEventListeners();
        
        // Firebase baÅŸlatÄ±lÄ±yor
        console.log('Firebase baÅŸlatÄ±lÄ±yor...');
        await initFirebase();
        
        // Kimlik doÄŸrulama iÅŸlemi
        console.log('Kimlik doÄŸrulama baÅŸlatÄ±lÄ±yor...');
        await initAuth();
        
        console.log('UI gÃ¼ncelleniyor...');
        updateUI();
        
        console.log('Uygulama baÅŸarÄ±yla baÅŸlatÄ±ldÄ±');
    } catch (error) {
        console.error('Uygulama baÅŸlatÄ±lÄ±rken kritik hata:', error);
        
        // Hata detaylarÄ±nÄ± kullanÄ±cÄ±ya gÃ¶stermek iÃ§in
        const errorMessage = error.message || 'Bilinmeyen hata';
        const errorContainer = document.createElement('div');
        errorContainer.style.position = 'fixed';
        errorContainer.style.bottom = '10px';
        errorContainer.style.right = '10px';
        errorContainer.style.padding = '15px';
        errorContainer.style.background = '#ffebee';
        errorContainer.style.border = '1px solid #f44336';
        errorContainer.style.borderRadius = '4px';
        errorContainer.style.maxWidth = '400px';
        errorContainer.style.zIndex = '10000';
        errorContainer.style.fontFamily = 'Poppins, sans-serif';
        errorContainer.innerHTML = `
            <h3 style="margin-top: 0; color: #d32f2f;">Uygulama HatasÄ±</h3>
            <p>${errorMessage}</p>
            <p><small>LÃ¼tfen bu ekran gÃ¶rÃ¼ntÃ¼sÃ¼nÃ¼ destek ekibiyle paylaÅŸÄ±n.</small></p>
            <div style="margin-top: 10px;">
                <button onclick="window.location.reload()" style="margin-right: 10px; padding: 5px 10px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer;">SayfayÄ± Yenile</button>
                <button onclick="this.parentNode.parentNode.remove()" style="padding: 5px 10px; background: #757575; color: white; border: none; border-radius: 4px; cursor: pointer;">Kapat</button>
            </div>
        `;
        document.body.appendChild(errorContainer);
        
        // Hata detaylarÄ±nÄ± konsola yazdÄ±r
        console.error('Hata detaylarÄ±:', error);
    }
}

// Sayfa yÃ¼klendiÄŸinde uygulamayÄ± baÅŸlat
console.log('Uygulama baÅŸlatÄ±lÄ±yor...');

// DOM yÃ¼klendikten sonra uygulamayÄ± baÅŸlat
if (document.readyState === 'loading') {
    // DOM henÃ¼z yÃ¼klenmediyse, event listener ekle
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM zaten yÃ¼klendiyse, doÄŸrudan baÅŸlat
    initializeApp();
}
