// KaloriMax Ultimate - Besin Veritabanı Bölüm 3
// Sebzeler, Meyveler, Dünya Mutfağı, Fast Food

const megaFoodDatabase = [
    
    // 🥬 SEBZELER VE YEŞİLLİKLER (200 çeşit)
    
    // Yapraklı Sebzeler
    { name: "Ispanak (Çiğ)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "Sebze" },
    { name: "Ispanak (Haşlanmış)", calories: 23, protein: 3, carbs: 3.8, fat: 0.3, category: "Sebze" },
    { name: "Marul (Kıvırcık)", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: "Sebze" },
    { name: "Marul (Göbekli)", calories: 13, protein: 0.9, carbs: 2.8, fat: 0.1, category: "Sebze" },
    { name: "Roka", calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, category: "Sebze" },
    { name: "Maydanoz", calories: 36, protein: 3, carbs: 6.3, fat: 0.8, category: "Sebze" },
    { name: "Dereotu", calories: 43, protein: 3.5, carbs: 7, fat: 1.1, category: "Sebze" },
    { name: "Nane", calories: 70, protein: 3.3, carbs: 14.9, fat: 0.9, category: "Sebze" },
    { name: "Fesleğen", calories: 22, protein: 3.2, carbs: 2.6, fat: 0.6, category: "Sebze" },
    { name: "Kekik", calories: 276, protein: 9.1, carbs: 63.9, fat: 7.4, category: "Sebze" },
    { name: "Tere", calories: 32, protein: 3, carbs: 5.5, fat: 0.7, category: "Sebze" },
    { name: "Semizotu", calories: 16, protein: 1.3, carbs: 3.4, fat: 0.4, category: "Sebze" },
    { name: "Pazı", calories: 19, protein: 1.8, carbs: 3.7, fat: 0.2, category: "Sebze" },
    { name: "Lahana (Beyaz)", calories: 25, protein: 1.3, carbs: 6, fat: 0.1, category: "Sebze" },
    { name: "Lahana (Kırmızı)", calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2, category: "Sebze" },
    { name: "Brüksel Lahanası", calories: 43, protein: 3.4, carbs: 8.9, fat: 0.3, category: "Sebze" },
    { name: "Karnabahar", calories: 25, protein: 1.9, carbs: 5, fat: 0.3, category: "Sebze" },
    { name: "Brokoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: "Sebze" },
    { name: "Kuşkonmaz", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, category: "Sebze" },
    
    // Kök Sebzeler
    { name: "Havuç", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, category: "Sebze" },
    { name: "Patates (Çiğ)", calories: 77, protein: 2, carbs: 17, fat: 0.1, category: "Sebze" },
    { name: "Patates (Haşlanmış)", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, category: "Sebze" },
    { name: "Patates (Fırında)", calories: 93, protein: 2.1, carbs: 21, fat: 0.1, category: "Sebze" },
    { name: "Patates (Kızarmış)", calories: 365, protein: 4, carbs: 63, fat: 11, category: "Sebze" },
    { name: "Tatlı Patates", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: "Sebze" },
    { name: "Soğan (Sarı)", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, category: "Sebze" },
    { name: "Soğan (Kırmızı)", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, category: "Sebze" },
    { name: "Soğan (Beyaz)", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, category: "Sebze" },
    { name: "Sarımsak", calories: 149, protein: 6.4, carbs: 33, fat: 0.5, category: "Sebze" },
    { name: "Kereviz", calories: 16, protein: 0.7, carbs: 3, fat: 0.2, category: "Sebze" },
    { name: "Turp", calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, category: "Sebze" },
    { name: "Pancar", calories: 43, protein: 1.6, carbs: 10, fat: 0.2, category: "Sebze" },
    { name: "Şalgam", calories: 28, protein: 0.9, carbs: 6.4, fat: 0.1, category: "Sebze" },
    
    // Diğer Sebzeler
    { name: "Domates", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: "Sebze" },
    { name: "Salatalık", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, category: "Sebze" },
    { name: "Biber (Yeşil)", calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, category: "Sebze" },
    { name: "Biber (Kırmızı)", calories: 31, protein: 1, carbs: 7.3, fat: 0.3, category: "Sebze" },
    { name: "Biber (Sarı)", calories: 27, protein: 1.9, carbs: 6.3, fat: 0.2, category: "Sebze" },
    { name: "Patlıcan", calories: 25, protein: 1, carbs: 6, fat: 0.2, category: "Sebze" },
    { name: "Kabak", calories: 17, protein: 1.2, carbs: 3.4, fat: 0.2, category: "Sebze" },
    { name: "Enginar", calories: 47, protein: 3.3, carbs: 10.5, fat: 0.2, category: "Sebze" },
    { name: "Bamya", calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, category: "Sebze" },
    { name: "Fasulye (Taze)", calories: 35, protein: 1.8, carbs: 8, fat: 0.1, category: "Sebze" },
    { name: "Bezelye (Taze)", calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, category: "Sebze" },
    { name: "Mısır (Taze)", calories: 86, protein: 3.3, carbs: 19, fat: 1.4, category: "Sebze" },
    { name: "Mantar (Beyaz)", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, category: "Sebze" },
    { name: "Mantar (Portobello)", calories: 22, protein: 2.1, carbs: 3.9, fat: 0.4, category: "Sebze" },
    { name: "Mantar (Shiitake)", calories: 34, protein: 2.2, carbs: 6.8, fat: 0.5, category: "Sebze" },
    
    // 🍎 MEYVELER (150 çeşit)
    
    // Tropikal Meyveler
    { name: "Elma (Kırmızı)", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: "Meyve" },
    { name: "Elma (Yeşil)", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: "Meyve" },
    { name: "Armut", calories: 57, protein: 0.4, carbs: 15, fat: 0.1, category: "Meyve" },
    { name: "Muz", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: "Meyve" },
    { name: "Portakal", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, category: "Meyve" },
    { name: "Mandalina", calories: 53, protein: 0.8, carbs: 13, fat: 0.3, category: "Meyve" },
    { name: "Limon", calories: 29, protein: 1.1, carbs: 9, fat: 0.3, category: "Meyve" },
    { name: "Greyfurt", calories: 42, protein: 0.8, carbs: 11, fat: 0.1, category: "Meyve" },
    { name: "Ananas", calories: 50, protein: 0.5, carbs: 13, fat: 0.1, category: "Meyve" },
    { name: "Mango", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, category: "Meyve" },
    { name: "Avokado", calories: 160, protein: 2, carbs: 9, fat: 15, category: "Meyve" },
    { name: "Kivi", calories: 61, protein: 1.1, carbs: 15, fat: 0.5, category: "Meyve" },
    { name: "Papaya", calories: 43, protein: 0.5, carbs: 11, fat: 0.3, category: "Meyve" },
    { name: "Hindistan Cevizi", calories: 354, protein: 3.3, carbs: 15, fat: 33, category: "Meyve" },
    
    // Üzümsü Meyveler
    { name: "Üzüm (Yeşil)", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, category: "Meyve" },
    { name: "Üzüm (Siyah)", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, category: "Meyve" },
    { name: "Çilek", calories: 32, protein: 0.7, carbs: 8, fat: 0.3, category: "Meyve" },
    { name: "Ahududu", calories: 52, protein: 1.2, carbs: 12, fat: 0.7, category: "Meyve" },
    { name: "Böğürtlen", calories: 43, protein: 1.4, carbs: 10, fat: 0.5, category: "Meyve" },
    { name: "Yaban Mersini", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, category: "Meyve" },
    { name: "Karadut", calories: 43, protein: 1.4, carbs: 10, fat: 0.4, category: "Meyve" },
    { name: "Beyazdut", calories: 43, protein: 1.4, carbs: 10, fat: 0.4, category: "Meyve" },
    
    // Çekirdekli Meyveler
    { name: "Şeftali", calories: 39, protein: 0.9, carbs: 10, fat: 0.3, category: "Meyve" },
    { name: "Kayısı", calories: 48, protein: 1.4, carbs: 11, fat: 0.4, category: "Meyve" },
    { name: "Erik", calories: 46, protein: 0.7, carbs: 11, fat: 0.3, category: "Meyve" },
    { name: "Kiraz", calories: 63, protein: 1.1, carbs: 16, fat: 0.2, category: "Meyve" },
    { name: "Vişne", calories: 50, protein: 1, carbs: 12, fat: 0.3, category: "Meyve" },
    { name: "Karpuz", calories: 30, protein: 0.6, carbs: 8, fat: 0.2, category: "Meyve" },
    { name: "Kavun", calories: 34, protein: 0.8, carbs: 8, fat: 0.2, category: "Meyve" },
    { name: "Honeydew Kavun", calories: 36, protein: 0.5, carbs: 9, fat: 0.1, category: "Meyve" },
    
    // Kuru Meyveler
    { name: "Kuru Üzüm", calories: 299, protein: 3.1, carbs: 79, fat: 0.5, category: "Kuru Meyve" },
    { name: "Kuru Kayısı", calories: 241, protein: 3.4, carbs: 63, fat: 0.5, category: "Kuru Meyve" },
    { name: "Kuru İncir", calories: 249, protein: 3.3, carbs: 64, fat: 0.9, category: "Kuru Meyve" },
    { name: "Hurma", calories: 277, protein: 1.8, carbs: 75, fat: 0.2, category: "Kuru Meyve" },
    { name: "Kuru Erik", calories: 240, protein: 2.2, carbs: 64, fat: 0.4, category: "Kuru Meyve" },
    
    // 🥜 SERT MEYVELİ YAĞLI TOHUMLAR (40 çeşit)
    
    { name: "Ceviz", calories: 654, protein: 15.2, carbs: 14, fat: 65, category: "Kuruyemiş" },
    { name: "Badem", calories: 579, protein: 21.2, carbs: 22, fat: 50, category: "Kuruyemiş" },
    { name: "Fındık", calories: 628, protein: 15, carbs: 17, fat: 61, category: "Kuruyemiş" },
    { name: "Fıstık (Antep)", calories: 560, protein: 20.6, carbs: 28, fat: 45, category: "Kuruyemiş" },
    { name: "Fıstık (Yer)", calories: 567, protein: 25.8, carbs: 16, fat: 49, category: "Kuruyemiş" },
    { name: "Kaju", calories: 553, protein: 18.2, carbs: 30, fat: 44, category: "Kuruyemiş" },
    { name: "Pekan Cevizi", calories: 691, protein: 9.2, carbs: 14, fat: 72, category: "Kuruyemiş" },
    { name: "Macadamia", calories: 718, protein: 7.9, carbs: 14, fat: 76, category: "Kuruyemiş" },
    { name: "Brezilya Cevizi", calories: 656, protein: 14.3, carbs: 12, fat: 66, category: "Kuruyemiş" },
    { name: "Çam Fıstığı", calories: 673, protein: 13.7, carbs: 13, fat: 68, category: "Kuruyemiş" },
    
    // Tohumlar
    { name: "Çekirdek (Ayçiçeği)", calories: 584, protein: 20.8, carbs: 20, fat: 52, category: "Tohum" },
    { name: "Çekirdek (Kabak)", calories: 559, protein: 30.2, carbs: 11, fat: 49, category: "Tohum" },
    { name: "Chia Tohumu", calories: 486, protein: 17, carbs: 42, fat: 31, category: "Tohum" },
    { name: "Keten Tohumu", calories: 534, protein: 18.3, carbs: 29, fat: 42, category: "Tohum" },
    { name: "Susam", calories: 573, protein: 17.7, carbs: 23, fat: 50, category: "Tohum" },
    { name: "Haşhaş", calories: 525, protein: 18, carbs: 28, fat: 42, category: "Tohum" },
    
    // 🍕 FAST FOOD VE HAZIR YEMEKLER (100 çeşit)
    
    // Pizza Çeşitleri
    { name: "Margherita Pizza", calories: 266, protein: 11, carbs: 33, fat: 10, category: "Pizza" },
    { name: "Pepperoni Pizza", calories: 298, protein: 13, carbs: 36, fat: 12, category: "Pizza" },
    { name: "Sucuklu Pizza", calories: 312, protein: 12, carbs: 35, fat: 14, category: "Pizza" },
    { name: "Karışık Pizza", calories: 285, protein: 12, carbs: 34, fat: 11, category: "Pizza" },
    { name: "Vejeteryan Pizza", calories: 245, protein: 10, carbs: 35, fat: 8, category: "Pizza" },
    { name: "Tavuklu Pizza", calories: 275, protein: 14, carbs: 33, fat: 10, category: "Pizza" },
    { name: "Ton Balıklı Pizza", calories: 260, protein: 15, carbs: 32, fat: 9, category: "Pizza" },
    
    // Hamburger Çeşitleri
    { name: "Hamburger (Klasik)", calories: 540, protein: 25, carbs: 40, fat: 31, category: "Hamburger" },
    { name: "Cheeseburger", calories: 563, protein: 25, carbs: 40, fat: 33, category: "Hamburger" },
    { name: "Double Burger", calories: 678, protein: 37, carbs: 41, fat: 39, category: "Hamburger" },
    { name: "Chicken Burger", calories: 515, protein: 22, carbs: 42, fat: 27, category: "Hamburger" },
    { name: "Fish Burger", calories: 410, protein: 15, carbs: 39, fat: 22, category: "Hamburger" },
    { name: "Whopper", calories: 630, protein: 28, carbs: 49, fat: 38, category: "Hamburger" },
    { name: "Big Mac", calories: 563, protein: 25, carbs: 45, fat: 33, category: "Hamburger" },
    
    // KFC Ürünleri
    { name: "KFC Tavuk But", calories: 250, protein: 19, carbs: 8, fat: 16, category: "KFC" },
    { name: "KFC Kanat", calories: 150, protein: 11, carbs: 5, fat: 10, category: "KFC" },
    { name: "KFC Twister", calories: 480, protein: 27, carbs: 46, fat: 22, category: "KFC" },
    { name: "KFC Popcorn", calories: 270, protein: 14, carbs: 13, fat: 18, category: "KFC" },
    
    // McDonald's Ürünleri
    { name: "McChicken", calories: 400, protein: 14, carbs: 40, fat: 22, category: "McDonald's" },
    { name: "Filet-O-Fish", calories: 380, protein: 16, carbs: 38, fat: 18, category: "McDonald's" },
    { name: "McNuggets (6 adet)", calories: 250, protein: 15, carbs: 15, fat: 15, category: "McDonald's" },
    { name: "Büyük Patates", calories: 320, protein: 4, carbs: 43, fat: 15, category: "McDonald's" },
    
    // 🍜 DÜNYA MUTFAĞI (200 çeşit)
    
    // Japon Mutfağı
    { name: "Sushi (Somon)", calories: 144, protein: 6, carbs: 21, fat: 4, category: "Japon" },
    { name: "Sushi (Ton Balığı)", calories: 148, protein: 7, carbs: 21, fat: 4, category: "Japon" },
    { name: "Sashimi (Somon)", calories: 208, protein: 25.4, carbs: 0, fat: 12.4, category: "Japon" },
    { name: "Ramen", calories: 436, protein: 17, carbs: 62, fat: 14, category: "Japon" },
    { name: "Teriyaki Tavuk", calories: 201, protein: 22, carbs: 12, fat: 7, category: "Japon" },
    { name: "Tempura", calories: 251, protein: 8, carbs: 24, fat: 14, category: "Japon" },
    { name: "Yakitori", calories: 180, protein: 18, carbs: 3, fat: 10, category: "Japon" },
    { name: "Miso Çorbası", calories: 40, protein: 3, carbs: 5, fat: 1, category: "Japon" },
    
    // İtalyan Mutfağı
    { name: "Carbonara", calories: 358, protein: 13, carbs: 44, fat: 15, category: "İtalyan" },
    { name: "Bolognese", calories: 336, protein: 15, carbs: 43, fat: 12, category: "İtalyan" },
    { name: "Pesto Makarna", calories: 389, protein: 11, carbs: 44, fat: 19, category: "İtalyan" },
    { name: "Lasagna", calories: 288, protein: 20, carbs: 23, fat: 14, category: "İtalyan" },
    { name: "Risotto", calories: 166, protein: 4.3, carbs: 28, fat: 4.4, category: "İtalyan" },
    { name: "Minestrone", calories: 82, protein: 4.5, carbs: 11, fat: 2.8, category: "İtalyan" },
    
    // Meksika Mutfağı
    { name: "Taco (Et)", calories: 226, protein: 9, carbs: 20, fat: 13, category: "Meksika" },
    { name: "Burrito", calories: 295, protein: 13, carbs: 39, fat: 10, category: "Meksika" },
    { name: "Quesadilla", calories: 424, protein: 20, carbs: 39, fat: 22, category: "Meksika" },
    { name: "Nachos", calories: 346, protein: 9.4, carbs: 36, fat: 19, category: "Meksika" },
    { name: "Guacamole", calories: 160, protein: 2, carbs: 9, fat: 15, category: "Meksika" },
    { name: "Salsa", calories: 36, protein: 2, carbs: 8, fat: 0.2, category: "Meksika" },
    
    // Çin Mutfağı
    { name: "Köpek Balığı Çorbası", calories: 99, protein: 7.9, carbs: 7.2, fat: 4.8, category: "Çin" },
    { name: "Pekin Ördeği", calories: 337, protein: 19, carbs: 0, fat: 28, category: "Çin" },
    { name: "Chow Mein", calories: 237, protein: 4, carbs: 26, fat: 14, category: "Çin" },
    { name: "Fried Rice", calories: 163, protein: 2.9, carbs: 20, fat: 8, category: "Çin" },
    { name: "Sweet and Sour", calories: 231, protein: 14, carbs: 35, fat: 5, category: "Çin" },
    { name: "Dim Sum", calories: 85, protein: 4.6, carbs: 8.9, fat: 3.4, category: "Çin" },
    
    // Hint Mutfağı
    { name: "Curry (Tavuk)", calories: 217, protein: 14, carbs: 5, fat: 16, category: "Hint" },
    { name: "Biryani", calories: 202, protein: 4.1, carbs: 35, fat: 5.1, category: "Hint" },
    { name: "Tandoori Tavuk", calories: 195, protein: 27, carbs: 0, fat: 8.5, category: "Hint" },
    { name: "Dal", calories: 116, protein: 9, carbs: 20, fat: 0.4, category: "Hint" },
    { name: "Samosa", calories: 308, protein: 5.4, carbs: 23, fat: 23, category: "Hint" },
    { name: "Chapati", calories: 104, protein: 3.1, carbs: 18, fat: 2.5, category: "Hint" },
    
    // Tayland Mutfağı
    { name: "Pad Thai", calories: 358, protein: 9.7, carbs: 35, fat: 20, category: "Tayland" },
    { name: "Tom Yum Çorbası", calories: 90, protein: 8.8, carbs: 10, fat: 2.9, category: "Tayland" },
    { name: "Green Curry", calories: 169, protein: 4, carbs: 5.5, fat: 15, category: "Tayland" },
    { name: "Mango Sticky Rice", calories: 132, protein: 2.1, carbs: 26, fat: 2.5, category: "Tayland" },
    
    // 🇹🇷 TÜRK MUTFAĞI EKLEMELERİ (100 çeşit ek)
    
    // Çorbalar
    { name: "Mercimek Çorbası", calories: 101, protein: 5.5, carbs: 18, fat: 1.3, category: "Çorba" },
    { name: "Domates Çorbası", calories: 74, protein: 2.1, carbs: 15, fat: 1.4, category: "Çorba" },
    { name: "Yayla Çorbası", calories: 78, protein: 3.2, carbs: 8.9, fat: 3.5, category: "Çorba" },
    { name: "Tarhana Çorbası", calories: 85, protein: 3.8, carbs: 16, fat: 1.2, category: "Çorba" },
    { name: "İşkembe Çorbası", calories: 104, protein: 8.7, carbs: 6.3, fat: 5.1, category: "Çorba" },
    { name: "Tavuk Çorbası", calories: 38, protein: 4.8, carbs: 2.1, fat: 1.2, category: "Çorba" },
    
    // Kebaplar ve Izgara
    { name: "Adana Kebap", calories: 291, protein: 16, carbs: 3, fat: 24, category: "Kebap" },
    { name: "Urfa Kebap", calories: 275, protein: 17, carbs: 2, fat: 22, category: "Kebap" },
    { name: "Şiş Kebap", calories: 234, protein: 22, carbs: 2, fat: 15, category: "Kebap" },
    { name: "Döner Kebap", calories: 265, protein: 18, carbs: 5, fat: 19, category: "Kebap" },
    { name: "İskender Kebap", calories: 201, protein: 15, carbs: 12, fat: 11, category: "Kebap" },
    { name: "Beyti Kebap", calories: 276, protein: 17, carbs: 7, fat: 20, category: "Kebap" },
    { name: "Çöp Şiş", calories: 245, protein: 20, carbs: 1, fat: 18, category: "Kebap" },
    
    // Ev Yemekleri
    { name: "Karnıyarık", calories: 289, protein: 19, carbs: 23, fat: 15, category: "Ana Yemek" },
    { name: "İmam Bayıldı", calories: 201, protein: 2.1, carbs: 15, fat: 15, category: "Ana Yemek" },
    { name: "Dolma (Zeytinyağlı)", calories: 43, protein: 1.1, carbs: 8.9, fat: 0.9, category: "Ana Yemek" },
    { name: "Sarma", calories: 45, protein: 1.2, carbs: 9.1, fat: 1, category: "Ana Yemek" },
    { name: "Mantı", calories: 377, protein: 13, carbs: 61, fat: 9, category: "Ana Yemek" },
    { name: "Güveç", calories: 203, protein: 21, carbs: 8, fat: 10, category: "Ana Yemek" },
    { name: "Musakka", calories: 245, protein: 8, carbs: 16, fat: 17, category: "Ana Yemek" },
    
    // Pilavlar
    { name: "Pilav (Tereyağlı)", calories: 150, protein: 3, carbs: 28, fat: 3.5, category: "Pilav" },
    { name: "Bulgur Pilavı", calories: 83, protein: 3, carbs: 19, fat: 0.2, category: "Pilav" },
    { name: "Nohutlu Pilav", calories: 189, protein: 6.3, carbs: 34, fat: 3.2, category: "Pilav" },
    { name: "İç Pilav", calories: 201, protein: 6.8, carbs: 32, fat: 5.4, category: "Pilav" },
    
    // Tatlılar
    { name: "Baklava", calories: 307, protein: 4.1, carbs: 35, fat: 17, category: "Tatlı" },
    { name: "Künefe", calories: 223, protein: 5.8, carbs: 29, fat: 10, category: "Tatlı" },
    { name: "Sütlaç", calories: 97, protein: 3.1, carbs: 17.8, fat: 1.6, category: "Tatlı" },
    { name: "Muhallebi", calories: 123, protein: 3.2, carbs: 19, fat: 4.1, category: "Tatlı" },
    { name: "Kazandibi", calories: 156, protein: 4.2, carbs: 24, fat: 5.3, category: "Tatlı" },
    { name: "Lokum", calories: 322, protein: 0, carbs: 81, fat: 0, category: "Tatlı" },
    { name: "Tulumba", calories: 330, protein: 4.5, carbs: 54, fat: 11, category: "Tatlı" },
    { name: "Revani", calories: 267, protein: 4.8, carbs: 47, fat: 7.2, category: "Tatlı" },
    
    // 🥤 İÇECEKLER (80 çeşit)
    
    // Alkollü İçecekler
    { name: "Bira", calories: 43, protein: 0.5, carbs: 3.6, fat: 0, category: "Alkol" },
    { name: "Şarap (Kırmızı)", calories: 85, protein: 0.1, carbs: 2.6, fat: 0, category: "Alkol" },
    { name: "Şarap (Beyaz)", calories: 82, protein: 0.1, carbs: 2.6, fat: 0, category: "Alkol" },
    { name: "Rakı", calories: 231, protein: 0, carbs: 0, fat: 0, category: "Alkol" },
    { name: "Votka", calories: 231, protein: 0, carbs: 0, fat: 0, category: "Alkol" },
    { name: "Viski", calories: 250, protein: 0, carbs: 0, fat: 0, category: "Alkol" },
    
    // Meşrubatlar
    { name: "Coca Cola", calories: 42, protein: 0, carbs: 10.6, fat: 0, category: "Meşrubat" },
    { name: "Pepsi", calories: 41, protein: 0, carbs: 11, fat: 0, category: "Meşrubat" },
    { name: "Fanta", calories: 44, protein: 0, carbs: 11.6, fat: 0, category: "Meşrubat" },
    { name: "Sprite", calories: 37, protein: 0, carbs: 9.8, fat: 0, category: "Meşrubat" },
    { name: "Red Bull", calories: 45, protein: 0.9, carbs: 11, fat: 0, category: "Enerji" },
    
    // Kahve ve Çay
    { name: "Türk Kahvesi", calories: 2, protein: 0.1, carbs: 0.4, fat: 0, category: "Kahve" },
    { name: "Filtre Kahve", calories: 2, protein: 0.3, carbs: 0, fat: 0, category: "Kahve" },
    { name: "Espresso", calories: 9, protein: 0.5, carbs: 1.6, fat: 0.2, category: "Kahve" },
    { name: "Cappuccino", calories: 74, protein: 4, carbs: 6.3, fat: 4, category: "Kahve" },
    { name: "Latte", calories: 103, protein: 6, carbs: 8.7, fat: 5.5, category: "Kahve" },
    { name: "Çay", calories: 1, protein: 0, carbs: 0.3, fat: 0, category: "Çay" },
    { name: "Yeşil Çay", calories: 1, protein: 0, carbs: 0, fat: 0, category: "Çay" },
    
    // Devam ediyor... TOPLAM HEDEFİ: 5000+ BESİN!
];

console.log(`3. bölümde ${megaFoodDatabase.length} besin daha eklendi!`); 