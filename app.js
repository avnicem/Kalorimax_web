// Firebase yapılandırması
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

// Firebase uygulamasının zaten başlatılıp başlatılmadığını kontrol et
function getFirebaseApp() {
    try {
        const apps = firebase.apps;
        if (apps.length === 0) {
            console.log('Firebase uygulaması başlatılıyor...');
            return firebase.initializeApp(firebaseConfig);
        } else {
            console.log('Mevcut Firebase uygulaması kullanılıyor');
            return apps[0];
        }
    } catch (error) {
        console.error('Firebase uygulaması alınırken hata oluştu:', error);
        throw error;
    }
}

// State yönetimi ve Firebase değişkenleri (global scope)
let state;
let db, auth, analytics;

// State'i başlatma fonksiyonu
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

// Firebase başlatma fonksiyonu
async function initFirebase() {
    try {
        // Firebase uygulamasını al veya başlat
        const app = getFirebaseApp();
        console.log('Firebase başarıyla başlatıldı');
        
        // Firebase servislerini başlat
        console.log('Firestore başlatılıyor...');
        db = firebase.firestore(app);
        
        console.log('Auth başlatılıyor...');
        auth = firebase.auth(app);
        
        // Analytics opsiyonel olarak başlatılıyor
        try {
            if (firebase.analytics) {
                console.log('Analytics başlatılıyor...');
                analytics = firebase.analytics(app);
                console.log('Analytics başlatıldı');
            } else {
                console.warn('Firebase Analytics mevcut değil, atlanıyor...');
            }
        } catch (analyticsError) {
            console.warn('Analytics başlatılırken hata oluştu:', analyticsError);
        }
        
        console.log('Tüm Firebase servisleri başlatıldı');
        return { db, auth, analytics };
    } catch (error) {
        const errorMessage = 'Firebase başlatılırken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata');
        console.error('Firebase başlatma hatası:', error);
        throw new Error(errorMessage);
    }
}

// Kimlik doğrulama durumunu dinle
async function initAuth() {
    console.log('Auth başlatılıyor...');
    
    if (!auth) {
        throw new Error('Firebase Auth başlatılamadı!');
    }
    
    try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            console.log('Mevcut kullanıcı bulundu:', currentUser.uid);
            state.userId = currentUser.uid;
            await loadUserData();
            return;
        }
        
        console.log('Anonim giriş deneniyor...');
        const userCredential = await auth.signInAnonymously();
        
        console.log('Anonim giriş başarılı:', userCredential.user.uid);
        state.userId = userCredential.user.uid;
        await loadUserData();
        
    } catch (error) {
        console.error('Kimlik doğrulama hatası:', error);
        
        let errorMessage = 'Giriş yapılamadı: ';
        
        switch(error.code) {
            case 'auth/operation-not-allowed':
                errorMessage += 'Anonim giriş etkin değil. Lütfen Firebase konsolundan etkinleştirin.';
                break;
            case 'auth/network-request-failed':
                errorMessage += 'Ağ bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
                break;
            default:
                errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
    
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            console.log('Auth state değişti: Kullanıcı giriş yaptı', user.uid);
            state.userId = user.uid;
        } else {
            console.log('Auth state değişti: Kullanıcı çıkış yaptı');
            state.userId = null;
        }
    });
    
    return () => unsubscribe();
}

// Kullanıcı verilerini yükle
async function loadUserData() {
    if (!state.userId) {
        console.error('Kullanıcı girişi yapılmadan veri yüklenemez!');
        return;
    }
    
    console.log('Kullanıcı verileri yükleniyor...');
    
    try {
        const userDoc = await db.collection('users').doc(state.userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('Kullanıcı verileri alındı:', userData);
            
            // State'i güncelle
            state.foods = userData.foods || [];
            state.dailyCalories = userData.dailyCalories || 0;
            state.dailyGoal = userData.dailyGoal || 2000;
            state.macros = userData.macros || {
                protein: { current: 0, goal: 150 },
                carbs: { current: 0, goal: 200 },
                fat: { current: 0, goal: 65 }
            };
            
            console.log('Kullanıcı verileri yüklendi');
        } else {
            console.log('Kullanıcı verileri bulunamadı, varsayılan değerlerle başlatılıyor...');
            
            // Varsayılan değerlerle yeni bir kullanıcı belgesi oluştur
            await saveUserData();
        }
        
        // UI'ı güncelle
        updateUI();
        
    } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata oluştu:', error);
        showNotification('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error;
    }
}

// Kullanıcı verilerini kaydet
async function saveUserData() {
    if (!state.userId) {
        console.error('Kullanıcı girişi yapılmadan veri kaydedilemez!');
        return;
    }
    
    console.log('Kullanıcı verileri kaydediliyor...');
    
    try {
        await db.collection('users').doc(state.userId).set({
            foods: state.foods,
            dailyCalories: state.dailyCalories,
            dailyGoal: state.dailyGoal,
            macros: state.macros,
            lastUpdated: new Date()
        });
        
        console.log('Kullanıcı verileri başarıyla kaydedildi');
        return true;
        
    } catch (error) {
        console.error('Kullanıcı verileri kaydedilirken hata oluştu:', error);
        showNotification('Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        throw error;
    }
}

// DOM elementleri
const foodForm = document.getElementById('food-form');
const foodNameInput = document.getElementById('food-name');
const foodCaloriesInput = document.getElementById('food-calories');
const foodList = document.getElementById('food-items'); // Düzeltildi: 'food-list' yerine 'food-items' kullanılıyor
const calorieCountElement = document.querySelector('.calorie-count'); // Yeni eklendi
const progressBar = document.querySelector('.macro-fill'); // Düzeltildi: '.progress-bar' yerine '.macro-fill' kullanılıyor
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

// Yemek ekleme işlevi
async function addFood(e) {
    e.preventDefault();
    
    try {
        // Giriş değerlerini al ve doğrula
        const name = foodNameInput ? foodNameInput.value.trim() : '';
        const calories = foodCaloriesInput ? parseInt(foodCaloriesInput.value) : 0;
        
        // Giriş doğrulama
        if (!name) {
            showNotification('Lütfen bir yemek adı girin.', 'error');
            foodNameInput?.focus();
            return;
        }
        
        if (isNaN(calories) || calories <= 0) {
            showNotification('Lütfen geçerli bir kalori değeri girin.', 'error');
            foodCaloriesInput?.focus();
            return;
        }
        
        // Yeni yemeği oluştur
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
        
        // State'i güncelle
        if (!state.foods) state.foods = [];
        state.foods.push(newFood);
        state.dailyCalories = (state.dailyCalories || 0) + calories;
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'ı güncelle
            updateUI();
            
            // Formu temizle
            if (foodForm) foodForm.reset();
            
            // İmleci ilk alana taşı
            if (foodNameInput) foodNameInput.focus();
            
            // Başarı bildirimi göster
            showNotification(`✓ ${name} başarıyla eklendi!`, 'success');
            
        } catch (error) {
            console.error('Veri kaydedilirken hata oluştu:', error);
            // Hata durumunda state'i geri al
            state.foods = state.foods.filter(f => f.id !== newFood.id);
            state.dailyCalories -= calories;
            throw error;
        }
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluştu:', error);
        showNotification('Yemek eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Bildirimi otomatik kaldır
    setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Animasyon bittikten sonra elementi kaldır
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }, 100);
}

// Yemek silme işlevi
async function deleteFood(id) {
    try {
        if (!state.foods || !Array.isArray(state.foods)) {
            console.error('Yemek listesi geçersiz');
            return;
        }
        
        const foodIndex = state.foods.findIndex(food => food.id === id);
        
        if (foodIndex === -1) {
            console.error('Silinecek yemek bulunamadı:', id);
            return;
        }
        
        const deletedFood = state.foods[foodIndex];
        
        // State'ten kaldır
        state.foods.splice(foodIndex, 1);
        state.dailyCalories = Math.max(0, (state.dailyCalories || 0) - (deletedFood.calories || 0));
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'ı güncelle
            updateUI();
            
            // Geri alma bildirimi göster
            showUndoNotification(deletedFood);
            
        } catch (error) {
            console.error('Silme işlemi kaydedilirken hata oluştu:', error);
            // Hata durumunda state'i geri al
            state.foods.splice(foodIndex, 0, deletedFood);
            state.dailyCalories = (state.dailyCalories || 0) + (deletedFood.calories || 0);
            throw error;
        }
        
    } catch (error) {
        console.error('Yemek silinirken hata oluştu:', error);
        showNotification('Yemek silinirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
}

// Geri alma bildirimi gösterme
function showUndoNotification(food) {
    try {
        if (!food || !food.name) {
            console.error('Geçersiz yemek bilgisi:', food);
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
        undoButton.setAttribute('aria-label', `${food.name} yemeğini geri al`);
        
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
                console.error('Geri alma işlemi sırasında hata:', error);
            }
        };
        
        notification.appendChild(message);
        notification.appendChild(undoButton);
        
        document.body.appendChild(notification);
        
        // Erişilebilirlik için ekran okuyucuya bildir
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = `${food.name} silindi. Geri almak için Geri Al butonuna basın.`;
        notification.appendChild(liveRegion);
        
        // Bildirimi göster
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Bildirimi otomatik kaldır
        const timeoutId = setTimeout(() => {
            removeNotification();
        }, 5000);
        
        // Fare üzerine gelindiğinde otomatik kaldırmayı durdur
        notification.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });
        
        // Fare ayrıldığında tekrar başlat
        notification.addEventListener('mouseleave', () => {
            setTimeout(removeNotification, 2000);
        });
        
    } catch (error) {
        console.error('Bildirim gösterilirken hata oluştu:', error);
    }
}

// Silme işlemini geri alma
async function undoDelete(food) {
    try {
        if (!food || !food.id) {
            throw new Error('Geçersiz yemek bilgisi');
        }
        
        // Eğer yemek zaten listede varsa işlem yapma
        if (state.foods.some(f => f.id === food.id)) {
            console.warn('Bu yemek zaten listede mevcut:', food.id);
            return;
        }
        
        // Yemeği tekrar ekle
        state.foods.push(food);
        state.dailyCalories = (state.dailyCalories || 0) + (food.calories || 0);
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'ı güncelle
            updateUI();
            
            // Başarı bildirimi göster
            showNotification(`✓ ${food.name} geri yüklendi!`, 'success');
            
        } catch (error) {
            console.error('Geri alma işlemi kaydedilirken hata oluştu:', error);
            // Hata durumunda state'i geri al
            state.foods = state.foods.filter(f => f.id !== food.id);
            state.dailyCalories = Math.max(0, (state.dailyCalories || 0) - (food.calories || 0));
            throw error;
        }
        
    } catch (error) {
        console.error('Geri alma işlemi sırasında hata oluştu:', error);
        showNotification('Geri alma işlemi sırasında bir hata oluştu.', 'error');
        throw error;
    }
}

// UI'ı güncelleme işlevi
function updateUI() {
    try {
        // Toplam kaloriyi güncelle
        if (calorieCountElement) {
            calorieCountElement.textContent = state.dailyCalories;
        }
        
        // İlerleme çubuğunu güncelle
        if (progressBar) {
            const progress = Math.min((state.dailyCalories / state.dailyGoal) * 100, 100);
            progressBar.style.width = `${progress}%`;
        }
        
        // Makro besinleri güncelle
        updateMacroBar('protein', state.macros.protein.current, state.macros.protein.goal);
        updateMacroBar('carbs', state.macros.carbs.current, state.macros.carbs.goal);
        updateMacroBar('fat', state.macros.fat.current, state.macros.fat.goal);
        
        // Yemek listesini güncelle
        renderFoodList();
    } catch (error) {
        console.error('UI güncellenirken hata oluştu:', error);
    }
}

// Makro çubuklarını güncelleme işlevi
function updateMacroBar(macro, current, goal) {
    try {
        const macroBar = macroBars[macro];
        if (!macroBar || !macroBar.bar || !macroBar.text) {
            console.warn(`${macro} için gerekli elementler bulunamadı`);
            return;
        }
        
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        
        // Çubuğu güncelle
        macroBar.bar.style.width = `${percentage}%`;
        
        // Metni güncelle
        macroBar.text.textContent = `${current}g / ${goal}g`;
        
        // Renk ayarı
        if (percentage > 100) {
            macroBar.bar.style.backgroundColor = '#f44336'; // Kırmızı
        } else if (percentage > 80) {
            macroBar.bar.style.backgroundColor = '#ff9800'; // Turuncu
        } else {
            macroBar.bar.style.backgroundColor = '#4caf50'; // Yeşil
        }
    } catch (error) {
        console.error(`${macro} çubuğu güncellenirken hata:`, error);
    }
}

// Yemek listesini oluşturma işlevi
function renderFoodList() {
    try {
        if (!foodList) {
            console.warn('Yemek listesi elementi bulunamadı');
            return;
        }
        
        // Listeyi temizle
        foodList.innerHTML = '';
        
        if (!state.foods || state.foods.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgM0gyMVY1SDFWM1pNMSA5SDExVjExSDFWOVpNMSAxM0gxNVYxNUgxVjEzWk0xIDE3SDE5VjE5SDFWMTdaTTE5IDEzSDE3VjE5SDE5VjEzWk0xOSA5SDE3VjExSDE5VjlaTTE1IDlIMTNWMTFIMTVWOVpNMTEgOUg5VjExSDExVjlaTTcgOUg1VjExSDdWOVoiIGZpbGw9IiNiZGJkYmQiLz4KPC9zdmc+Cg==" alt="">
                <p>Henüz yemek eklenmedi</p>
            `;
            foodList.appendChild(emptyState);
            return;
        }
        
        // Yemekleri ekle
        state.foods.forEach(food => {
            const foodItem = document.createElement('li');
            foodItem.className = 'food-item';
            foodItem.dataset.id = food.id;
            
            const foodInfo = document.createElement('div');
            foodInfo.className = 'food-info';
            
            const foodName = document.createElement('span');
            foodName.className = 'food-name';
            foodName.textContent = food.name;
            
            const foodCalories = document.createElement('span');
            foodCalories.className = 'food-calories';
            foodCalories.textContent = `${food.calories} kcal`;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '&times;';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteFood(food.id);
            };
            
            foodInfo.appendChild(foodName);
            foodInfo.appendChild(foodCalories);
            
            foodItem.appendChild(foodInfo);
            foodItem.appendChild(deleteButton);
            
            foodList.appendChild(foodItem);
        });
        
        // Yemek sayısını güncelle
        updateFoodCount();
        
    } catch (error) {
        console.error('Yemek listesi oluşturulurken hata oluştu:', error);
    }
}

// Yemek sayısını güncelleme işlevi
function updateFoodCount() {
    const foodCountElement = document.querySelector('.food-count');
    if (foodCountElement) {
        const count = state.foods ? state.foods.length : 0;
        foodCountElement.textContent = `${count} öğün`;
    }
}

// Tarihi güncelleme işlevi
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('tr-TR', options);
    }
}

// Event listener'ları ekle
function initEventListeners() {
    try {
        // Yemek ekleme formu
        if (foodForm) {
            foodForm.addEventListener('submit', addFood);
        } else {
            console.error('Yemek formu bulunamadı!');
        }
        
        // Silme butonları için event delegation
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
            console.error('Yemek listesi bulunamadı!');
        }
        
        console.log('Tüm event listenerlar başarıyla eklendi');
    } catch (error) {
        console.error('Event listener eklenirken hata oluştu:', error);
        showNotification('Sayfa öğeleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error;
    }
}

// Uygulama başlatma fonksiyonu
async function initializeApp() {
    console.log('Uygulama başlatılıyor...');
    
    try {
        // State'i başlat
        initializeState();
        
        // Tüm başlangıç işlemlerini sırayla yap
        console.log('Tarih güncelleniyor...');
        updateDate();
        
        console.log('Event listenerlar ekleniyor...');
        initEventListeners();
        
        // Firebase başlatılıyor
        console.log('Firebase başlatılıyor...');
        await initFirebase();
        
        // Kimlik doğrulama işlemi
        console.log('Kimlik doğrulama başlatılıyor...');
        await initAuth();
        
        console.log('UI güncelleniyor...');
        updateUI();
        
        console.log('Uygulama başarıyla başlatıldı');
    } catch (error) {
        console.error('Uygulama başlatılırken kritik hata:', error);
        
        // Hata detaylarını kullanıcıya göstermek için
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
            <h3 style="margin-top: 0; color: #d32f2f;">Uygulama Hatası</h3>
            <p>${errorMessage}</p>
            <p><small>Lütfen bu ekran görüntüsünü destek ekibiyle paylaşın.</small></p>
            <div style="margin-top: 10px;">
                <button onclick="window.location.reload()" style="margin-right: 10px; padding: 5px 10px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer;">Sayfayı Yenile</button>
                <button onclick="this.parentNode.parentNode.remove()" style="padding: 5px 10px; background: #757575; color: white; border: none; border-radius: 4px; cursor: pointer;">Kapat</button>
            </div>
        `;
        document.body.appendChild(errorContainer);
        
        // Hata detaylarını konsola yazdır
        console.error('Hata detayları:', error);
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
console.log('Uygulama başlatılıyor...');

// DOM yüklendikten sonra uygulamayı başlat
if (document.readyState === 'loading') {
    // DOM henüz yüklenmediyse, event listener ekle
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM zaten yüklendiyse, doğrudan başlat
    initializeApp();
}
