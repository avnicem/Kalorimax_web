# KaloriMax Pro - Akıllı Besin Takibi

Modern ve kullanıcı dostu kalori takip uygulaması.

## 🌐 Canlı Demo

GitHub Pages'te çalışan versiyon: [https://avnicem.github.io/Kalorimax_web/](https://avnicem.github.io/Kalorimax_web/)

## 🚀 Özellikler

- 📊 Gerçek zamanlı kalori takibi
- 🔍 Besin arama ve filtreleme
- 📱 Responsive tasarım
- 🎯 Günlük hedef takibi
- 📈 İlerleme çubukları
- 🍎 Geniş besin veritabanı

## 🛠️ Teknolojiler

- HTML5
- CSS3 (Modern CSS Grid & Flexbox)
- Vanilla JavaScript
- Chart.js (Grafikler için)
- Font Awesome (İkonlar)

## 📁 Dosya Yapısı

```
Kalorimax_web/
├── index.html              # Ana uygulama (Node.js server gerekli)
├── index-github.html       # GitHub Pages uyumlu versiyon
├── styles.css              # Ana stil dosyası
├── js/
│   └── app.js              # Ana JavaScript dosyası
├── server.js               # Node.js server
└── README.md               # Bu dosya
```

## 🚀 Kurulum

### Yerel Geliştirme (Node.js ile)

1. Node.js'i yükleyin: [https://nodejs.org/](https://nodejs.org/)
2. Projeyi klonlayın:
   ```bash
   git clone https://github.com/avnicem/Kalorimax_web.git
   cd Kalorimax_web
   ```
3. Server'ı başlatın:
   ```bash
   node server.js
   ```
4. Tarayıcıda açın: `http://localhost:3000`

### GitHub Pages (Statik Hosting)

1. `index-github.html` dosyasını `index.html` olarak yeniden adlandırın
2. GitHub repository'nizde Settings > Pages bölümünden GitHub Pages'i etkinleştirin
3. Siteniz `https://username.github.io/repository-name/` adresinde yayınlanacak

## 📱 Kullanım

1. **Besin Arama**: Arama kutusuna besin adını yazın
2. **Besin Ekleme**: Listeden besine tıklayarak günlük tüketiminize ekleyin
3. **Takip**: Dashboard'da günlük kalori ve makro besin hedeflerinizi takip edin
4. **Kaldırma**: Tüketilen besinlerden "Kaldır" butonuna tıklayarak çıkarın

## 🎯 Hedefler

- Günlük Kalori: 2000 kcal
- Protein: 50g
- Karbonhidrat: 250g
- Yağ: 67g

## 🔧 Özelleştirme

Hedeflerinizi değiştirmek için `index-github.html` dosyasındaki `targets` objesini düzenleyin:

```javascript
const targets = { 
    calories: 2000, 
    protein: 50, 
    carbs: 250, 
    fat: 67 
};
```

## 📊 Besin Veritabanı

Uygulama şu kategorilerde besinleri içerir:
- 🍎 Meyveler
- 🥩 Et Ürünleri
- 🐟 Balık ve Deniz Ürünleri
- 🌾 Tahıllar
- 🥛 Süt Ürünleri
- 🥬 Sebzeler
- 🍫 Marka Ürünleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- GitHub: [@avnicem](https://github.com/avnicem)
- Proje Linki: [https://github.com/avnicem/Kalorimax_web](https://github.com/avnicem/Kalorimax_web)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
