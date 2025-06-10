// Ana uygulama nesnesi
const KaloriMax = {
    // Uygulama durumu
    state: {
        foodDatabase: [],
        consumedItems: [],
        targets: { calories: 2000, protein: 50, carbs: 250, fat: 67 },
        currentDate: new Date().toISOString().split('T')[0],
        waterIntake: 0,
        chart: null,
        allowLocalAccess: window.location.protocol === 'file:'
    },
    
    // Hata yönetimi
    errors: {
        show: function(message, type = 'error') {
            console.error(`[${type.toUpperCase()}] ${message}`);
            // Basit bir bildirim göster
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    },

    // DOM elementleri
    elements: {},

    // Uygulamayı başlat
    init: function() {
        console.log('KaloriMax Pro başlatılıyor...');
        try {
            this.cacheDOM();
            this.loadFoodDatabase();
            this.loadData();
            this.setupEventListeners();
            this.updateUI();
            console.log('KaloriMax Pro başlatıldı');
        } catch (error) {
            this.errors.show(`Uygulama başlatılırken hata: ${error.message}`);
        }
    },

    // DOM elementlerini önbelleğe al
    cacheDOM: function() {
        this.elements = {
            foodSearch: document.getElementById('foodSearch'),
            foodList: document.getElementById('foodList'),
            consumedList: document.getElementById('consumedList'),
            totalCalories: document.getElementById('totalCalories'),
            totalProtein: document.getElementById('totalProtein'),
            totalCarbs: document.getElementById('totalCarbs'),
            totalFat: document.getElementById('totalFat'),
            calorieProgress: document.getElementById('calorieProgress'),
            proteinProgress: document.getElementById('proteinProgress'),
            carbsProgress: document.getElementById('carbsProgress'),
            fatProgress: document.getElementById('fatProgress'),
            currentDate: document.getElementById('currentDate'),
            prevDayBtn: document.getElementById('prevDay'),
            nextDayBtn: document.getElementById('nextDay'),
            todayBtn: document.getElementById('today'),
            addFoodBtn: document.getElementById('addFoodBtn')
        };
    },

    // Olay dinleyicilerini kur
    setupEventListeners: function() {
        // Tarih kontrolleri
        if (this.elements.prevDayBtn) {
            this.elements.prevDayBtn.addEventListener('click', () => this.changeDate(-1));
        }
        if (this.elements.nextDayBtn) {
            this.elements.nextDayBtn.addEventListener('click', () => this.changeDate(1));
        }
        if (this.elements.todayBtn) {
            this.elements.todayBtn.addEventListener('click', () => this.goToToday());
        }
        
        // Besin arama
        if (this.elements.foodSearch) {
            this.elements.foodSearch.addEventListener('input', (e) => this.searchFood(e.target.value));
        }
        
        // Besin ekleme
        if (this.elements.addFoodBtn) {
            this.elements.addFoodBtn.addEventListener('click', () => this.showAddFoodModal());
        }
    },

    // Tarihi değiştir
    changeDate: function(days) {
        const date = new Date(this.state.currentDate);
        date.setDate(date.getDate() + days);
        this.state.currentDate = date.toISOString().split('T')[0];
        this.loadDayData();
        this.updateUI();
    },

    // Bugüne git
    goToToday: function() {
        this.state.currentDate = new Date().toISOString().split('T')[0];
        this.loadDayData();
        this.updateUI();
    },

    // Günlük verileri yükle
    loadDayData: function() {
        // Bu fonksiyon seçili güne ait verileri yükleyecek
        // Şimdilik sadece tüketilen öğeleri temizliyoruz
        this.state.consumedItems = [];
    },

    // Arayüzü güncelle
    updateUI: function() {
        this.updateDateDisplay();
        this.updateNutritionSummary();
        this.updateConsumedItemsList();
        this.updateWaterIntake();
    },

    // Tarih görüntüsünü güncelle
    updateDateDisplay: function() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(this.state.currentDate);
        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = date.toLocaleDateString('tr-TR', options);
        }
    },

    // Besin özetini güncelle
    updateNutritionSummary: function() {
        const totals = this.calculateTotals();
        
        // Toplam değerleri güncelle
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        updateElement('totalCalories', Math.round(totals.calories));
        updateElement('totalProtein', `${Math.round(totals.protein)}g`);
        updateElement('totalCarbs', `${Math.round(totals.carbs)}g`);
        updateElement('totalFat', `${Math.round(totals.fat)}g`);
        
        // İlerleme çubuklarını güncelle
        this.updateProgressBar('calorie', totals.calories, this.state.targets.calories);
        this.updateProgressBar('protein', totals.protein, this.state.targets.protein);
        this.updateProgressBar('carbs', totals.carbs, this.state.targets.carbs);
        this.updateProgressBar('fat', totals.fat, this.state.targets.fat);
    },

    // Toplam değerleri hesapla
    calculateTotals: function() {
        return this.state.consumedItems.reduce((totals, item) => ({
            calories: totals.calories + (item.calories * item.amount / 100),
            protein: totals.protein + (item.protein * item.amount / 100),
            carbs: totals.carbs + (item.carbs * item.amount / 100),
            fat: totals.fat + (item.fat * item.amount / 100)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    },

    // İlerleme çubuğunu güncelle
    updateProgressBar: function(type, current, target) {
        const percentage = Math.min(Math.round((current / target) * 100), 100);
        const progressBar = document.getElementById(`${type}Progress`);
        const percentText = document.getElementById(`${type}Percent`);
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            
            // Renk ayarları
            if (percentage < 50) {
                progressBar.className = 'progress-bar bg-success';
            } else if (percentage < 80) {
                progressBar.className = 'progress-bar bg-warning';
            } else {
                progressBar.className = 'progress-bar bg-danger';
            }
        }
        
        if (percentText) {
            percentText.textContent = `${percentage}%`;
        }
    },

    // Tüketilen besinleri listele
    updateConsumedItemsList: function() {
        const list = this.elements.consumedList || this.elements.foodList;
        if (!list) return;
        
        if (this.state.consumedItems.length === 0) {
            list.innerHTML = `
                <div class="text-center p-4 text-muted">
                    <i class="bi bi-egg-fried d-block mb-2" style="font-size: 2rem;"></i>
                    <span>Henüz hiçbir şey tüketilmedi</span>
                </div>`;
            return;
        }
        
        list.innerHTML = this.state.consumedItems.map((item, index) => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.amount}g • ${Math.round(item.calories * (item.amount / 100))} kcal</small>
                    <div class="mt-1">
                        <span class="badge bg-primary me-1">P: ${(item.protein * (item.amount / 100)).toFixed(1)}g</span>
                        <span class="badge bg-success me-1">K: ${(item.carbs * (item.amount / 100)).toFixed(1)}g</span>
                        <span class="badge bg-warning">Y: ${(item.fat * (item.amount / 100)).toFixed(1)}g</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="KaloriMax.removeConsumedItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`).join('');
    },

    // Su tüketimini güncelle
    updateWaterIntake: function() {
        const waterCups = document.querySelectorAll('.water-cup');
        waterCups.forEach((cup, index) => {
            if (index < this.state.waterIntake) {
                cup.classList.add('bi-cup-fill', 'text-primary');
                cup.classList.remove('bi-cup');
            } else {
                cup.classList.add('bi-cup');
                cup.classList.remove('bi-cup-fill', 'text-primary');
            }
        });
    },

    // Verileri kaydet
    saveData: function() {
        try {
            localStorage.setItem('kalorimax-pro', JSON.stringify({
                consumedItems: this.state.consumedItems,
                targets: this.state.targets,
                currentDate: this.state.currentDate,
                waterIntake: this.state.waterIntake
            }));
        } catch (e) {
            console.error('Veri kaydedilirken hata oluştu:', e);
        }
    },

    // Verileri yükle
    loadData: function() {
        try {
            const saved = localStorage.getItem('kalorimax-pro');
            if (saved) {
                const data = JSON.parse(saved);
                this.state.consumedItems = data.consumedItems || [];
                this.state.targets = data.targets || this.state.targets;
                this.state.currentDate = data.currentDate || this.state.currentDate;
                this.state.waterIntake = data.waterIntake || 0;
                console.log('Kayıtlı veriler yüklendi');
            }
        } catch (e) {
            console.error('Veri yüklenirken hata oluştu:', e);
        }
    },

    // Yiyecek veritabanını yükle
    loadFoodDatabase: function() {
        // Temel besin kategorilerini yükle
        this.loadMeatAndPoultry();
        this.loadSeafood();
        this.loadFruitsAndVegetables();
        this.loadGrainsAndCereals();
        this.loadBrandProducts();
        this.loadTurkishFoods();
        this.loadFastFoodChains();
        
        console.log('Yiyecek veritabanı yüklendi. Toplam kayıt:', this.state.foodDatabase.length);
    },

    // Diğer yardımcı fonksiyonlar...
    loadMeatAndPoultry: function() {
        const meatPoultry = [
            // Tavuk Ürünleri
            { name: "Tavuk Göğsü (Derisiz)", calories: 165, protein: 31.0, carbs: 0, fat: 3.6, category: "Tavuk" },
            { name: "Tavuk But (Derisiz)", calories: 174, protein: 28.3, carbs: 0, fat: 6.2, category: "Tavuk" },
            { name: "Tavuk Kanat (Derisiz)", calories: 203, protein: 30.2, carbs: 0, fat: 8.9, category: "Tavuk" },
            
            // Dana Eti
            { name: "Dana Kıyma (Yağsız)", calories: 158, protein: 26.1, carbs: 0, fat: 6.0, category: "Kırmızı Et" },
            { name: "Dana Bonfile", calories: 158, protein: 28.4, carbs: 0, fat: 3.6, category: "Kırmızı Et" },
            
            // Hindi
            { name: "Hindi Göğsü (Derisiz)", calories: 135, protein: 29.6, carbs: 0, fat: 1.7, category: "Hindi" },
            { name: "Hindi But (Derisiz)", calories: 144, protein: 25.9, carbs: 0, fat: 4.0, category: "Hindi" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(meatPoultry);
    },
    
    loadSeafood: function() {
        const seafood = [
            // Balıklar
            { name: "Somon (Çiftlik)", calories: 206, protein: 22.1, carbs: 0, fat: 13.4, category: "Deniz Ürünleri" },
            { name: "Ton Balığı (Suda Konserve)", calories: 116, protein: 25.5, carbs: 0, fat: 0.8, category: "Deniz Ürünleri" },
            { name: "Levrek", calories: 97, protein: 20.1, carbs: 0, fat: 1.8, category: "Deniz Ürünleri" },
            { name: "Çipura", calories: 105, protein: 20.5, carbs: 0, fat: 2.3, category: "Deniz Ürünleri" },
            
            // Diğer Deniz Ürünleri
            { name: "Karides (Haşlanmış)", calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3, category: "Deniz Ürünleri" },
            { name: "Midye (Haşlanmış)", calories: 172, protein: 23.8, carbs: 7.4, fat: 4.5, category: "Deniz Ürünleri" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(seafood);
    },
    
    loadFruitsAndVegetables: function() {
        const fruitsVeggies = [
            // Meyveler
            { name: "Elma (Orta Boy)", calories: 95, protein: 0.5, carbs: 25.1, fat: 0.3, category: "Meyve" },
            { name: "Muz (Orta Boy)", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, category: "Meyve" },
            { name: "Portakal (Orta Boy)", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, category: "Meyve" },
            
            // Sebzeler
            { name: "Brokoli (Haşlanmış)", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, category: "Sebze" },
            { name: "Ispanak (Haşlanmış)", calories: 23, protein: 2.9, carbs: 3.8, fat: 0.3, category: "Sebze" },
            { name: "Havuç (Çiğ)", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, category: "Sebze" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(fruitsVeggies);
    },
    
    loadGrainsAndCereals: function() {
        const grains = [
            // Tahıllar
            { name: "Pirinç (Beyaz, Haşlanmış)", calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, category: "Tahıl" },
            { name: "Bulgur (Haşlanmış)", calories: 83, protein: 3.1, carbs: 18.6, fat: 0.2, category: "Tahıl" },
            { name: "Yulaf Ezmesi (Pişmiş)", calories: 68, protein: 2.4, carbs: 12.0, fat: 1.4, category: "Tahıl" },
            { name: "Tam Buğday Ekmeği (1 Dilim)", calories: 69, protein: 3.6, carbs: 11.6, fat: 0.9, category: "Ekmek" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(grains);
    },
    
    loadBrandProducts: function() {
        const brandProducts = [
            // Süt Ürünleri
            { name: "Sütaş Süt (Yağlı, 100ml)", calories: 62, protein: 3.2, carbs: 4.7, fat: 3.3, category: "Süt Ürünleri" },
            { name: "Pınar Yoğurt (Yağlı, 100g)", calories: 60, protein: 3.5, carbs: 4.7, fat: 3.0, category: "Süt Ürünleri" },
            
            // Atıştırmalıklar
            { name: "Ülker Çikolatalı Gofret", calories: 132, protein: 1.5, carbs: 17.0, fat: 6.5, category: "Atıştırmalık" },
            { name: "Eti Cin (1 Paket)", calories: 138, protein: 2.2, carbs: 20.0, fat: 5.5, category: "Atıştırmalık" },
            
            // İçecekler
            { name: "Coca Cola (330ml)", calories: 139, protein: 0.0, carbs: 35.0, fat: 0.0, category: "İçecek" },
            { name: "Fanta (330ml)", calories: 160, protein: 0.0, carbs: 40.0, fat: 0.0, category: "İçecek" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(brandProducts);
    },
    
    loadTurkishFoods: function() {
        const turkishFoods = [
            // Çorbalar
            { name: "Mercimek Çorbası (1 Kase)", calories: 158, protein: 9.2, carbs: 24.8, fat: 3.2, category: "Çorba" },
            { name: "Ezogelin Çorbası (1 Kase)", calories: 168, protein: 8.5, carbs: 26.2, fat: 4.2, category: "Çorba" },
            
            // Ana Yemekler
            { name: "Kuru Fasulye (1 Porsiyon)", calories: 350, protein: 15.0, carbs: 45.0, fat: 12.0, category: "Ana Yemek" },
            { name: "İmam Bayıldı (1 Porsiyon)", calories: 320, protein: 5.0, carbs: 25.0, fat: 23.0, category: "Ana Yemek" },
            { name: "Mantı (1 Porsiyon)", calories: 550, protein: 20.0, carbs: 75.0, fat: 20.0, category: "Ana Yemek" },
            
            // Tatlılar
            { name: "Baklava (1 Dilim)", calories: 334, protein: 5.0, carbs: 39.0, fat: 18.0, category: "Tatlı" },
            { name: "Sütlaç (1 Kase)", calories: 260, protein: 7.0, carbs: 45.0, fat: 5.0, category: "Tatlı" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(turkishFoods);
    },
    
    loadFastFoodChains: function() {
        const fastFood = [
            // McDonald's
            { name: "Big Mac", calories: 550, protein: 25.0, carbs: 45.0, fat: 30.0, category: "Fast Food" },
            { name: "McChicken", calories: 450, protein: 22.0, carbs: 40.0, fat: 22.0, category: "Fast Food" },
            { name: "Patates Kızartması (Orta)", calories: 340, protein: 4.0, carbs: 44.0, fat: 16.0, category: "Fast Food" },
            
            // Burger King
            { name: "Whopper", calories: 660, protein: 28.0, carbs: 49.0, fat: 40.0, category: "Fast Food" },
            { name: "Chicken Royale", calories: 580, protein: 30.0, carbs: 50.0, fat: 30.0, category: "Fast Food" },
            
            // Sushi
            { name: "Somon Nigiri (2 Parça)", calories: 110, protein: 7.0, carbs: 14.0, fat: 2.5, category: "Sushi" },
            { name: "California Roll (6 Parça)", calories: 255, protein: 9.0, carbs: 38.0, fat: 7.0, category: "Sushi" }
        ];
        
        this.state.foodDatabase = this.state.foodDatabase.concat(fastFood);
    },
    
    // Besin ara
    searchFood: function(query) {
        console.log('Arama yapılıyor:', query);
        // Arama işlevselliği buraya eklenecek
    },
    
    // Besin ekle
    addFood: function(food, amount = 100) {
        const item = {
            ...food,
            amount: amount,
            timestamp: new Date().toISOString()
        };
        
        this.state.consumedItems.push(item);
        this.saveData();
        this.updateUI();
        this.errors.show(`${food.name} eklendi`, 'success');
    },
    
    // Tüketilen besini kaldır
    removeConsumedItem: function(index) {
        if (index >= 0 && index < this.state.consumedItems.length) {
            const removed = this.state.consumedItems.splice(index, 1)[0];
            this.saveData();
            this.updateUI();
            this.errors.show(`${removed.name} kaldırıldı`, 'info');
        }
    },
    
    // Su tüketimini artır
    increaseWaterIntake: function() {
        if (this.state.waterIntake < 10) {
            this.state.waterIntake++;
            this.saveData();
            this.updateWaterIntake();
        }
    },
    
    // Su tüketimini azalt
    decreaseWaterIntake: function() {
        if (this.state.waterIntake > 0) {
            this.state.waterIntake--;
            this.saveData();
            this.updateWaterIntake();
        }
    }
};

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    KaloriMax.init();
});
