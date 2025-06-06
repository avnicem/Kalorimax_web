// Uygulama durumu
const state = {
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

// Firebase servisleri
const firebaseApp = window.firebaseApp || {};
const { app, auth, db, signInAnonymously, doc, getDoc, setDoc, serverTimestamp } = firebaseApp;

// DOM elementleri
const domElements = {
    foodForm: null,
    foodNameInput: null,
    foodCaloriesInput: null,
    foodList: null,
    calorieCountElement: null,
    progressBar: null,
    macroBars: {
        protein: null,
        carbs: null,
        fat: null
    },
    macroInputs: {
        protein: null,
        carbs: null,
        fat: null
    }
};

// State'i başlatma fonksiyonu
function initializeState() {
    // State zaten tanımlıysa bir şey yapma
    if (state && state.foods) return state;
    
    // State'i sıfırla
    state.foods = [];
    state.dailyCalories = 0;
    state.dailyGoal = 2000;
    state.macros = {
        protein: { current: 0, goal: 150 },
        carbs: { current: 0, goal: 200 },
        fat: { current: 0, goal: 65 }
    };
    state.userId = null;
    
    return state;
}

// Firebase başlatma fonksiyonu
async function initFirebase() {
    try {
        console.log('Firebase servisleri başlatılıyor...');
        
        // Firebase servislerini kontrol et
        if (!firebaseApp || !firebaseApp.app) {
            throw new Error('Firebase uygulaması başlatılamadı');
        }
        
        // Servislerin yüklü olduğundan emin ol
        if (!app || !auth || !db) {
            throw new Error('Firebase servisleri yüklenemedi');
        }
        
        console.log('Firebase başarıyla başlatıldı');
        return { app, db, auth };
        
    } catch (error) {
        const errorMessage = 'Firebase başlatılırken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata');
        console.error('Firebase başlatma hatası:', error);
        showNotification(errorMessage, 'error');
        throw error;
    }
}

// Kimlik doğrulama durumunu başlat
async function initAuth() {
    console.log('Auth başlatılıyor...');
    
    try {
        if (!auth) {
            throw new Error('Firebase Auth başlatılamadı!');
        }
        
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                try {
                    if (user) {
                        // Kullanıcı oturum açmış
                        console.log('Kullanıcı oturum açtı:', user.uid);
                        state.userId = user.uid;
                        
                        // Kullanıcı verilerini yükle
                        await loadUserData();
                        updateUI();
                    } else {
                        // Anonim giriş yap
                        console.log('Anonim giriş yapılıyor...');
                        const userCredential = await signInAnonymously(auth);
                        console.log('Anonim kullanıcı oluşturuldu:', userCredential.user.uid);
                        state.userId = userCredential.user.uid;
                        
                        // Boş bir kullanıcı verisi oluştur
                        await saveUserData();
                        
                        // UI'ı güncelle
                        updateUI();
                        
                        resolve(userCredential.user);
                    }
                } catch (error) {
                    console.error('Kimlik doğrulama hatası:', error);
                    
                    let errorMessage = 'Giriş yapılamadı: ';
                    
                    if (error.code) {
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
                    } else {
                        errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
                    }
                    
                    showNotification(errorMessage, 'error');
                    resolve(userCredential.user);
                }
            });
        });
        
    } catch (error) {
        console.error('Kimlik doğrulama başlatılırken hata oluştu:', error);
        showNotification('Kimlik doğrulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error;
    }
}
                            return saveUserData();
                        })
                        .then(() => {
                            // UI'ı güncelle
                            updateUI();
                            resolve();
                        })
                        .catch((error) => {
                            console.error('Anonim giriş hatası:', error);
                            throw error;
                        });
                }
            } catch (error) {
                console.error('Kimlik doğrulama hatası:', error);
                
                let errorMessage = 'Giriş yapılamadı: ';
                
                if (error.code) {
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
                } else {
                    errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
                }
                
                showNotification(errorMessage, 'error');
                reject(error);
            } finally {
                // Dinleyiciyi temizle
                if (unsubscribe) {
                    unsubscribe();
                }
            }
        });
    });
}

// Kullanıcı verilerini yükle
async function loadUserData() {
    console.log('Kullanıcı verileri yükleniyor...');
    
    if (!state.userId) {
        const error = new Error('Kullanıcı ID\'si bulunamadı!');
        console.error(error);
        throw error;
    }
    
    if (!db) {
        const error = new Error('Firestore bağlantısı kurulamadı!');
        console.error(error);
        throw error;
    }
    
    try {
        const userDoc = await getDoc(doc(db, 'users', state.userId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Kullanıcı verileri alındı:', userData);
            
            // State'i güncelle
            state.foods = Array.isArray(userData.foods) ? userData.foods : [];
            state.dailyCalories = Number(userData.dailyCalories) || 0;
            state.dailyGoal = Number(userData.dailyGoal) || 2000;
            
            // Makro verilerini kontrol et ve güncelle
            state.macros = {
                protein: {
                    current: Number(userData.macros?.protein?.current) || 0,
                    goal: Number(userData.macros?.protein?.goal) || 150
                },
                carbs: {
                    current: Number(userData.macros?.carbs?.current) || 0,
                    goal: Number(userData.macros?.carbs?.goal) || 200
                },
                fat: {
                    current: Number(userData.macros?.fat?.current) || 0,
                    goal: Number(userData.macros?.fat?.goal) || 65
                }
            };
            
            console.log('Kullanıcı verileri başarıyla yüklendi');
            return userData;
            
        } else {
            console.log('Kullanıcı verisi bulunamadı, yeni kullanıcı oluşturuluyor...');
            // Yeni kullanıcı için boş veri oluştur
            await saveUserData();
            return null;
        }
        
    } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata oluştu:', error);
        showNotification('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error;
    }
}

// Kullanıcı verilerini kaydet
async function saveUserData() {
    console.log('Kullanıcı verileri kaydediliyor...');
    
    if (!state.userId) {
        const error = new Error('Kullanıcı ID\'si bulunamadı!');
        console.error(error);
        throw error;
    }
    
    if (!db) {
        const error = new Error('Firestore bağlantısı kurulamadı!');
        console.error(error);
        throw error;
    }
    
    try {
        // Kaydedilecek veriyi hazırla
        const userData = {
            foods: Array.isArray(state.foods) ? state.foods : [],
            dailyCalories: Number(state.dailyCalories) || 0,
            dailyGoal: Number(state.dailyGoal) || 2000,
            macros: {
                protein: {
                    current: Number(state.macros?.protein?.current) || 0,
                    goal: Number(state.macros?.protein?.goal) || 150
                },
                carbs: {
                    current: Number(state.macros?.carbs?.current) || 0,
                    goal: Number(state.macros?.carbs?.goal) || 200
                },
                fat: {
                    current: Number(state.macros?.fat?.current) || 0,
                    goal: Number(state.macros?.fat?.goal) || 65
                }
            },
            updatedAt: serverTimestamp()
        };
        
        // Firestore'a kaydet
        await setDoc(doc(db, 'users', state.userId), userData, { merge: true });
        
        console.log('Kullanıcı verileri başarıyla kaydedildi');
        return true;
        
    } catch (error) {
        console.error('Veri kaydedilirken hata oluştu:', error);
        
        let errorMessage = 'Veri kaydedilirken bir hata oluştu: ';
        
        if (error.code) {
            switch(error.code) {
                case 'permission-denied':
                    errorMessage += 'İzin hatası. Veri kaydedilemedi.';
                    break;
                case 'unavailable':
                    errorMessage += 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.';
                    break;
                default:
                    errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
            }
        } else {
            errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
        }
        
        showNotification(errorMessage, 'error');
        throw error;
    }
}
                fat: {
                    current: Number(userData.macros?.fat?.current) || 0,
                    goal: Number(userData.macros?.fat?.goal) || 65
                }
            };
            
            console.log('State güncellendi:', state);
        } else {        
            console.log('Kullanıcı verisi bulunamadı, yeni veri oluşturulacak.');
            // Yeni kullanıcı için varsayılan değerlerle state'i sıfırla
            state.foods = [];
            state.dailyCalories = 0;
            state.dailyGoal = 2000;
            state.macros = {
                protein: { current: 0, goal: 150 },
                carbs: { current: 0, goal: 200 },
                fat: { current: 0, goal: 65 }
            };
            
            // Yeni kullanıcı verisini kaydet
            await saveUserData();
        }
        
        // UI'ı güncelle
        updateUI();
        
    } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata oluştu:', error);
        showNotification('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error; // Hatanın yukarıya iletilmesi için
    }
}

// Kullanıcı verilerini kaydet
async function saveUserData() {
    console.log('Kullanıcı verileri kaydediliyor...');
    
    if (!state.userId) {
        const error = new Error('Kullanıcı ID\'si bulunamadı!');
        console.error(error);
        throw error;
    }
    
    if (!db) {
        const error = new Error('Firestore bağlantısı kurulamadı!');
        console.error(error);
        throw error;
    }
    
    try {
        // Kaydedilecek veriyi hazırla
        const userData = {
            foods: Array.isArray(state.foods) ? state.foods : [],
            dailyCalories: Number(state.dailyCalories) || 0,
            dailyGoal: Number(state.dailyGoal) || 2000,
            macros: {
                protein: {
                    current: Number(state.macros?.protein?.current) || 0,
                    goal: Number(state.macros?.protein?.goal) || 150
                },
                carbs: {
                    current: Number(state.macros?.carbs?.current) || 0,
                    goal: Number(state.macros?.carbs?.goal) || 200
                },
                fat: {
                    current: Number(state.macros?.fat?.current) || 0,
                    goal: Number(state.macros?.fat?.goal) || 65
                }
            },
            updatedAt: serverTimestamp()
        };
        
        // Firestore'a kaydet
        await setDoc(doc(db, 'users', state.userId), userData, { merge: true });
        
        console.log('Kullanıcı verileri başarıyla kaydedildi');
        return true;
        
    } catch (error) {
        console.error('Veri kaydedilirken hata oluştu:', error);
        
        let errorMessage = 'Veri kaydedilirken bir hata oluştu: ';
        
        if (error.code) {
            switch(error.code) {
                case 'permission-denied':
                    errorMessage += 'İzin hatası. Veri kaydedilemedi.';
                    break;
                case 'unavailable':
                    errorMessage += 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.';
                    break;
                default:
                    errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
            }
        } else {
            errorMessage += error.message || 'Bilinmeyen bir hata oluştu.';
        }
        
        showNotification(errorMessage, 'error');
        throw error; // Hatanın yukarıya iletilmesi için
    }
}

// Uygulamayı başlatma fonksiyonu
async function initializeApp() {
    try {
        console.log('Uygulama başlatılıyor...');
        
        // State'i başlat
        initializeState();
        
        // Tarihi güncelle
        updateDate();
        
        // DOM yüklendikten sonra diğer işlemleri yap
        return new Promise((resolve, reject) => {
            const onDOMContentLoaded = async () => {
                console.log('DOM yüklendi, uygulama başlatılıyor...');
                
                try {
                    // DOM elementlerini yükle
                    initDOM();
                    
                    // Event listener'ları ekle
                    initEventListeners();
                    
                    // Firebase'i başlat
                    await initFirebase();
                    
                    // Kimlik doğrulama işlemini başlat
                    await initAuth();
                    
                    // Kullanıcı verilerini yükle (initAuth içinde zaten çağrılıyor)
                    
                    // UI'ı güncelle
                    updateUI();
                    
                    console.log('Uygulama başarıyla başlatıldı');
                    resolve();
                } catch (error) {
                    console.error('Uygulama başlatılırken hata oluştu:', error);
                    showNotification('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
                    reject(error);
                }
            };
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
            } else {
                onDOMContentLoaded();
            }
        });
        
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
        showNotification('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        throw error;
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

// DOM elementlerini seç
let foodForm, foodNameInput, foodCaloriesInput, foodList, calorieCountElement, progressBar, macroBars;
let proteinInput, carbsInput, fatInput;  // Makro besin inputları

// DOM yüklendikten sonra çalışacak fonksiyon
function initDOM() {
    console.log('DOM elementleri yükleniyor...');
    
    try {
        // Form elementleri
        foodForm = document.getElementById('food-form');
        foodNameInput = document.getElementById('food-name');
        foodCaloriesInput = document.getElementById('food-calories');
        foodList = document.getElementById('food-list');
        calorieCountElement = document.getElementById('calorie-count');
        progressBar = document.querySelector('.progress');
        
        // Makro inputları
        proteinInput = document.getElementById('protein');
        carbsInput = document.getElementById('carbs');
        fatInput = document.getElementById('fat');
        
        // Makro çubukları
        macroBars = {
            protein: document.getElementById('protein-bar'),
            carbs: document.getElementById('carbs-bar'),
            fat: document.getElementById('fat-bar')
        };
        
        // Gerekli elementlerin kontrolü
        const requiredElements = {
            foodForm, foodNameInput, foodCaloriesInput, foodList, 
            calorieCountElement, progressBar, proteinInput, 
            carbsInput, fatInput, ...macroBars
        };
        
        const missingElements = [];
        for (const [name, element] of Object.entries(requiredElements)) {
            if (!element) {
                missingElements.push(name);
            }
        }
        
        if (missingElements.length > 0) {
            const error = new Error(`Aşağıdaki elementler bulunamadı: ${missingElements.join(', ')}`);
            console.error('Hata:', error.message);
            throw error;
        }
        
        console.log('DOM elementleri başarıyla yüklendi');
        return true;
        
    } catch (error) {
        console.error('DOM yüklenirken hata oluştu:', error);
    
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
    console.log('addFood fonksiyonu çalıştı');
    e.preventDefault();
    
    console.log('Form değerleri:', {
        name: foodNameInput?.value,
        calories: foodCaloriesInput?.value,
        protein: proteinInput?.value,
        carbs: carbsInput?.value,
        fat: fatInput?.value
    });
    
    if (!state.userId) {
        console.error('Kullanıcı girişi yok!');
        showNotification('Lütfen giriş yapın!', 'error');
        return;
    }
    
    try {
        const name = foodNameInput?.value?.trim() || '';
        const calories = parseInt(foodCaloriesInput?.value) || 0;
        const protein = parseInt(proteinInput?.value) || 0;
        const carbs = parseInt(carbsInput?.value) || 0;
        const fat = parseInt(fatInput?.value) || 0;
        
        console.log('Ayrıştırılmış değerler:', { name, calories, protein, carbs, fat });
        
        if (!name) {
            showNotification('Lütfen bir yemek adı girin!', 'error');
            foodNameInput.focus();
            return;
        }
        
        if (calories <= 0) {
            showNotification('Lütfen geçerli bir kalori değeri girin!', 'error');
            foodCaloriesInput.focus();
            return;
        }
        
        // Yeni yemeği oluştur
        const newFood = {
            id: Date.now().toString(),
            name: name || 'İsimsiz',
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            date: new Date().toISOString()
        };
        
        console.log('Oluşturulan yemek nesnesi:', newFood);
        
        console.log('Yeni yemek eklendi:', newFood); // Debug için
        
        // State'i güncelle
        if (!state.foods) state.foods = [];
        state.foods.push(newFood);
        state.dailyCalories = (state.dailyCalories || 0) + calories;
        
        // Makro besinleri güncelle
        if (!state.macros) state.macros = {
            protein: { current: 0, goal: 150 },
            carbs: { current: 0, goal: 200 },
            fat: { current: 0, goal: 65 }
        };
        
        state.macros.protein.current = (state.macros.protein.current || 0) + protein;
        state.macros.carbs.current = (state.macros.carbs.current || 0) + carbs;
        state.macros.fat.current = (state.macros.fat.current || 0) + fat;
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'ı güncelle
            updateUI();
            
            // Formu temizle
            foodForm.reset();
            foodNameInput.focus();
            
            showNotification('Yemek başarıyla eklendi!', 'success');
            
        } catch (error) {
            console.error('Veri kaydedilirken hata oluştu:', error);
            // Hata durumunda state'i geri al
            state.foods = state.foods.filter(f => f.id !== newFood.id);
            state.dailyCalories -= calories;
            state.macros.protein.current -= protein;
            state.macros.carbs.current -= carbs;
            state.macros.fat.current -= fat;
            
            showNotification('Veri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
        
    } catch (error) {
        console.error('Yemek eklenirken hata oluştu:', error);
        showNotification('Yemek eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
}

// Bildirim gÃ¶sterme fonksiyonu
function showNotification(message, type = 'info') {
    // ... (diğer kodlar)
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

// Yemek silme işlevi
async function deleteFood(id) {
    try {
        if (!state.userId) {
            showNotification('Lütfen giriş yapın!', 'error');
            return;
        }
        
        if (!state.foods || !Array.isArray(state.foods)) {
            console.error('Yemek listesi geçersiz');
            showNotification('Yemek listesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
            return;
        }
        
        const foodIndex = state.foods.findIndex(food => food.id === id);
        
        if (foodIndex === -1) {
            console.error('Silinecek yemek bulunamadı:', id);
            showNotification('Silinecek yemek bulunamadı!', 'error');
            return;
        }
        
        const deletedFood = state.foods[foodIndex];
        
        // State'ten kaldır
        state.foods.splice(foodIndex, 1);
        state.dailyCalories = Math.max(0, (state.dailyCalories || 0) - (deletedFood.calories || 0));
        
        // Makro besinlerden de çıkar
        if (state.macros) {
            state.macros.protein.current = Math.max(0, (state.macros.protein.current || 0) - (deletedFood.protein || 0));
            state.macros.carbs.current = Math.max(0, (state.macros.carbs.current || 0) - (deletedFood.carbs || 0));
            state.macros.fat.current = Math.max(0, (state.macros.fat.current || 0) - (deletedFood.fat || 0));
        }
        
        try {
            // Firestore'a kaydet
            await saveUserData();
            
            // UI'ı güncelle
            updateUI();
            
            // Geri alma bildirimi göster
            showUndoNotification(deletedFood, foodIndex);
            
        } catch (error) {
            console.error('Silme işlemi kaydedilirken hata oluştu:', error);
            // Hata durumunda state'i geri al
            state.foods.splice(foodIndex, 0, deletedFood);
            state.dailyCalories = (state.dailyCalories || 0) + (deletedFood.calories || 0);
            if (state.macros) {
                state.macros.protein.current = (state.macros.protein.current || 0) + (deletedFood.protein || 0);
                state.macros.carbs.current = (state.macros.carbs.current || 0) + (deletedFood.carbs || 0);
                state.macros.fat.current = (state.macros.fat.current || 0) + (deletedFood.fat || 0);
            }
            
            showNotification('Yemek silinirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
        
    } catch (error) {
        console.error('Yemek silinirken hata oluştu:', error);
        showNotification('Yemek silinirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
}

// Geri alma bildirimi gösterme
function showUndoNotification(food, originalIndex) {
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
        
        // Geri alma işlevi
        const undoDeletion = async () => {
            try {
                // Yemeği eski yerine ekle
                state.foods.splice(originalIndex, 0, food);
                state.dailyCalories = (state.dailyCalories || 0) + (food.calories || 0);
                
                // Makro besinleri geri ekle
                if (state.macros) {
                    state.macros.protein.current = (state.macros.protein.current || 0) + (food.protein || 0);
                    state.macros.carbs.current = (state.macros.carbs.current || 0) + (food.carbs || 0);
                    state.macros.fat.current = (state.macros.fat.current || 0) + (food.fat || 0);
                }
                
                // Veritabanını güncelle
                await saveUserData();
                
                // UI'ı güncelle
                updateUI();
                
                // Bildirimi kaldır
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                
            } catch (error) {
                console.error('Geri alma işlemi sırasında hata oluştu:', error);
                showNotification('Geri alma işlemi başarısız oldu. Lütfen tekrar deneyin.', 'error');
            }
        };
        
        // Geri alma butonuna tıklama olayı ekle
        undoButton.addEventListener('click', undoDeletion);
        
        // Bildirimi oluştur
        notification.appendChild(message);
        notification.appendChild(undoButton);
        
        // Sayfaya ekle
        document.body.appendChild(notification);
        
        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('fade-out');
                
                // Animasyon bittikten sonra kaldır
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Bildirim gösterilirken hata oluştu:', error);
    }
}

// UI'ı güncelleme işlevi
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
            // Yemek listesini tarihe göre sırala (en yeni en üstte)
            const sortedFoods = [...state.foods].sort((a, b) => {
                return new Date(b.date || 0) - new Date(a.date || 0);
            });
            
            // Yemek listesini oluştur
            foodList.innerHTML = sortedFoods.map(food => {
                console.log('Rendering food item:', food); // Debug için
                return `
                <li class="food-item" data-id="${food.id}">
                    <div class="food-info">
                        <span class="food-name">${food.name || 'İsimsiz'}</span>
                        <div class="food-details">
                            <span class="food-calories">${food.calories || 0} kcal</span>
                            <span class="food-macro">P: ${food.protein || 0}g</span>
                            <span class="food-macro">K: ${food.carbs || 0}g</span>
                            <span class="food-macro">Y: ${food.fat || 0}g</span>
                        </div>
                    </div>
                    <button class="delete-food" data-id="${food.id}" aria-label="${food.name || 'Bu yemeği'} sil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </li>`;
            }).join('');
            
            // Yemek sayısını güncelle
            updateFoodCount();
            
        } catch (error) {
            console.error('Yemek listesi oluşturulurken hata oluştu:', error);
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
        
        // Güncelle
        foodCountElement.innerHTML = `
            <span class="count">${count} ${mealText}</span>
            <span class="divider">•</span>
            <span class="calories">Toplam ${totalCalories} kcal</span>
        `;
        
    } catch (error) {
        console.error('Yemek sayısı güncellenirken hata oluştu:', error);
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
                // Silme butonuna tıklandığında
                if (e.target.closest('.delete-food')) {
                    const foodItem = e.target.closest('.food-item');
                    if (foodItem && foodItem.dataset.id) {
                        deleteFood(foodItem.dataset.id);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        } else {
            console.error('Yemek listesi bulunamadı!');
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
