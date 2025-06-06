// KaloriMax Ultimate - Besin Veritabanı Bölüm 2
// Bu dosya kalorimax-ultimate.html'e eklenecek

const additionalFoods = [
    
    // 🐟 BALIK VE DENİZ ÜRÜNLERİ (60 çeşit)
    
    // Deniz Balıkları
    { name: "Somon (Atlantik, Çiftlik)", calories: 208, protein: 25.4, carbs: 0, fat: 12.4, category: "Balık" },
    { name: "Somon (Pasifik, Vahşi)", calories: 142, protein: 25.4, carbs: 0, fat: 4.4, category: "Balık" },
    { name: "Somon (Füme)", calories: 117, protein: 18.3, carbs: 0, fat: 4.3, category: "Balık" },
    { name: "Somon (Konserve)", calories: 142, protein: 19.8, carbs: 0, fat: 6.3, category: "Balık" },
    { name: "Ton Balığı (Taze)", calories: 144, protein: 23, carbs: 0, fat: 5, category: "Balık" },
    { name: "Ton Balığı (Konserve, Su)", calories: 116, protein: 25.5, carbs: 0, fat: 0.8, category: "Balık" },
    { name: "Ton Balığı (Konserve, Yağ)", calories: 198, protein: 29.1, carbs: 0, fat: 8.2, category: "Balık" },
    { name: "Levrek (Deniz)", calories: 97, protein: 18, carbs: 0, fat: 2, category: "Balık" },
    { name: "Levrek (Çipura)", calories: 115, protein: 18, carbs: 0, fat: 4, category: "Balık" },
    { name: "Çupra", calories: 115, protein: 18, carbs: 0, fat: 4, category: "Balık" },
    { name: "Hamsi (Taze)", calories: 131, protein: 20, carbs: 0, fat: 5, category: "Balık" },
    { name: "Hamsi (Tuzlu)", calories: 210, protein: 29, carbs: 0, fat: 9.7, category: "Balık" },
    { name: "Sardalya (Taze)", calories: 208, protein: 25, carbs: 0, fat: 11, category: "Balık" },
    { name: "Sardalya (Konserve)", calories: 185, protein: 24.6, carbs: 0, fat: 9, category: "Balık" },
    { name: "Uskumru", calories: 262, protein: 24, carbs: 0, fat: 18, category: "Balık" },
    { name: "İstavrit", calories: 127, protein: 18, carbs: 0, fat: 5.8, category: "Balık" },
    { name: "Çinekop", calories: 103, protein: 18.5, carbs: 0, fat: 2.9, category: "Balık" },
    { name: "Lüfer", calories: 124, protein: 20.1, carbs: 0, fat: 4.2, category: "Balık" },
    { name: "Palamut", calories: 158, protein: 25, carbs: 0, fat: 5.9, category: "Balık" },
    { name: "Orkinos", calories: 144, protein: 23, carbs: 0, fat: 5, category: "Balık" },
    { name: "Kılıç Balığı", calories: 121, protein: 19.8, carbs: 0, fat: 4, category: "Balık" },
    { name: "Kalkan Balığı", calories: 95, protein: 16, carbs: 0, fat: 3, category: "Balık" },
    { name: "Barbunya", calories: 127, protein: 15.8, carbs: 0, fat: 6.8, category: "Balık" },
    { name: "Tekir", calories: 85, protein: 17.5, carbs: 0, fat: 1.3, category: "Balık" },
    { name: "Mercan", calories: 109, protein: 22.5, carbs: 0, fat: 1.9, category: "Balık" },

    // Tatlı Su Balıkları
    { name: "Alabalık", calories: 119, protein: 20.8, carbs: 0, fat: 3.5, category: "Balık" },
    { name: "Sazan", calories: 127, protein: 17.8, carbs: 0, fat: 5.6, category: "Balık" },
    { name: "Turna Balığı", calories: 105, protein: 18.4, carbs: 0, fat: 3.3, category: "Balık" },
    { name: "Sudak", calories: 83, protein: 18.3, carbs: 0, fat: 0.7, category: "Balık" },

    // Kabuklu Deniz Ürünleri
    { name: "Karides (Büyük)", calories: 99, protein: 18, carbs: 1, fat: 1.4, category: "Deniz Ürünü" },
    { name: "Karides (Küçük)", calories: 71, protein: 17.8, carbs: 0, fat: 0.3, category: "Deniz Ürünü" },
    { name: "Karides (Pişmiş)", calories: 99, protein: 20.9, carbs: 0.9, fat: 1.4, category: "Deniz Ürünü" },
    { name: "Istakoz", calories: 89, protein: 19, carbs: 0.5, fat: 0.9, category: "Deniz Ürünü" },
    { name: "Yengeç", calories: 83, protein: 18.1, carbs: 0, fat: 1.1, category: "Deniz Ürünü" },
    { name: "Kalamar", calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4, category: "Deniz Ürünü" },
    { name: "Ahtapot", calories: 82, protein: 15, carbs: 2.2, fat: 1, category: "Deniz Ürünü" },
    { name: "Midye", calories: 86, protein: 12, carbs: 7, fat: 2.2, category: "Deniz Ürünü" },
    { name: "İstiridye", calories: 59, protein: 5.2, carbs: 5.5, fat: 1.6, category: "Deniz Ürünü" },
    { name: "Deniz Tarağı", calories: 69, protein: 12, carbs: 2, fat: 0.8, category: "Deniz Ürünü" },
    { name: "Yunus Eti", calories: 130, protein: 21.5, carbs: 0, fat: 4.2, category: "Deniz Ürünü" },

    // 🥛 SÜT ÜRÜNLERİ VE YUMURTA (50 çeşit)
    
    // Süt Çeşitleri
    { name: "İnek Sütü (Tam Yağlı)", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, category: "Süt" },
    { name: "İnek Sütü (Yarım Yağlı)", calories: 50, protein: 3.4, carbs: 5, fat: 1.8, category: "Süt" },
    { name: "İnek Sütü (Yağsız)", calories: 34, protein: 3.4, carbs: 5, fat: 0.1, category: "Süt" },
    { name: "Keçi Sütü", calories: 69, protein: 3.6, carbs: 4.5, fat: 4.1, category: "Süt" },
    { name: "Koyun Sütü", calories: 108, protein: 5.4, carbs: 5.4, fat: 7, category: "Süt" },
    { name: "Manda Sütü", calories: 97, protein: 3.7, carbs: 5.2, fat: 6.9, category: "Süt" },
    { name: "Badem Sütü", calories: 17, protein: 0.6, carbs: 1.5, fat: 1.1, category: "Süt" },
    { name: "Soya Sütü", calories: 33, protein: 2.9, carbs: 1.2, fat: 1.8, category: "Süt" },
    { name: "Yulaf Sütü", calories: 47, protein: 1, carbs: 7.5, fat: 1.5, category: "Süt" },
    { name: "Hindistan Cevizi Sütü", calories: 230, protein: 2.3, carbs: 5.5, fat: 23.8, category: "Süt" },
    { name: "Pirinç Sütü", calories: 47, protein: 0.3, carbs: 9.2, fat: 1, category: "Süt" },

    // Yoğurt Çeşitleri
    { name: "Süzme Yoğurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: "Yoğurt" },
    { name: "Tam Yağlı Yoğurt", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, category: "Yoğurt" },
    { name: "Yağsız Yoğurt", calories: 56, protein: 10, carbs: 4, fat: 0.2, category: "Yoğurt" },
    { name: "Meyveli Yoğurt", calories: 81, protein: 4.4, carbs: 13.1, fat: 1.1, category: "Yoğurt" },
    { name: "Keçi Yoğurdu", calories: 69, protein: 4, carbs: 4.5, fat: 4.1, category: "Yoğurt" },
    { name: "Koyun Yoğurdu", calories: 108, protein: 5.4, carbs: 5.4, fat: 7, category: "Yoğurt" },
    { name: "Ayran", calories: 36, protein: 1.7, carbs: 4, fat: 1.5, category: "Yoğurt" },
    { name: "Kefir", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, category: "Yoğurt" },
    { name: "Labne", calories: 159, protein: 8, carbs: 4, fat: 13, category: "Yoğurt" },

    // Peynir Çeşitleri
    { name: "Beyaz Peynir (Tam Yağlı)", calories: 176, protein: 11, carbs: 4, fat: 13, category: "Peynir" },
    { name: "Beyaz Peynir (Az Yağlı)", calories: 98, protein: 12, carbs: 4, fat: 3.7, category: "Peynir" },
    { name: "Kaşar Peyniri", calories: 374, protein: 25, carbs: 2, fat: 30, category: "Peynir" },
    { name: "Tulum Peyniri", calories: 190, protein: 12, carbs: 2, fat: 15, category: "Peynir" },
    { name: "Lor Peyniri", calories: 166, protein: 12, carbs: 6, fat: 10, category: "Peynir" },
    { name: "Çökelek", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, category: "Peynir" },
    { name: "Keçi Peyniri", calories: 364, protein: 21.6, carbs: 0.1, fat: 30, category: "Peynir" },
    { name: "Koyun Peyniri", calories: 387, protein: 25, carbs: 0.4, fat: 31.8, category: "Peynir" },
    { name: "Mozzarella", calories: 280, protein: 22, carbs: 2.2, fat: 22, category: "Peynir" },
    { name: "Çedar Peyniri", calories: 403, protein: 25, carbs: 1.3, fat: 33, category: "Peynir" },
    { name: "Parmesan", calories: 431, protein: 38.5, carbs: 4.1, fat: 29, category: "Peynir" },
    { name: "Roquefort", calories: 369, protein: 21.5, carbs: 2, fat: 30.6, category: "Peynir" },
    { name: "Camembert", calories: 299, protein: 19.8, carbs: 0.5, fat: 24.3, category: "Peynir" },
    { name: "Feta Peyniri", calories: 75, protein: 4, carbs: 1.2, fat: 6, category: "Peynir" },
    { name: "Ricotta Peyniri", calories: 174, protein: 11, carbs: 3, fat: 13, category: "Peynir" },
    { name: "Cottage Cheese", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, category: "Peynir" },
    { name: "Mascarpone", calories: 429, protein: 4.8, carbs: 2.8, fat: 44, category: "Peynir" },
    { name: "Cream Cheese", calories: 342, protein: 5.9, carbs: 4.1, fat: 34, category: "Peynir" },

    // Yumurta Çeşitleri
    { name: "Tavuk Yumurtası (Büyük)", calories: 155, protein: 13, carbs: 1.1, fat: 11, category: "Yumurta" },
    { name: "Tavuk Yumurtası (Orta)", calories: 126, protein: 10.5, carbs: 0.9, fat: 8.8, category: "Yumurta" },
    { name: "Tavuk Yumurtası (Küçük)", calories: 108, protein: 9, carbs: 0.8, fat: 7.5, category: "Yumurta" },
    { name: "Yumurta Akı", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, category: "Yumurta" },
    { name: "Yumurta Sarısı", calories: 322, protein: 15.9, carbs: 3.6, fat: 26.5, category: "Yumurta" },
    { name: "Bıldırcın Yumurtası", calories: 158, protein: 13, carbs: 0.4, fat: 11, category: "Yumurta" },
    { name: "Ördek Yumurtası", calories: 185, protein: 13, carbs: 1.5, fat: 14, category: "Yumurta" },
    { name: "Kaz Yumurtası", calories: 185, protein: 13.9, carbs: 1.4, fat: 13.8, category: "Yumurta" },
    { name: "Haşlanmış Yumurta", calories: 155, protein: 13, carbs: 1.1, fat: 11, category: "Yumurta" },
    { name: "Omlet (Sade)", calories: 154, protein: 11, carbs: 0.8, fat: 12, category: "Yumurta" },
    { name: "Menemen", calories: 154, protein: 8, carbs: 6, fat: 11, category: "Yumurta" },
    { name: "Çırpılmış Yumurta", calories: 168, protein: 11, carbs: 1.6, fat: 12.5, category: "Yumurta" },

    // 🌾 TAHILLAR VE HUBUBAT (80 çeşit)
    
    // Pirinç Çeşitleri
    { name: "Basmati Pirinç (Pişmiş)", calories: 121, protein: 3, carbs: 25, fat: 0.4, category: "Pirinç" },
    { name: "Basmati Pirinç (Çiğ)", calories: 349, protein: 8.5, carbs: 72, fat: 1.1, category: "Pirinç" },
    { name: "Yasemin Pirinç (Pişmiş)", calories: 130, protein: 2.4, carbs: 28, fat: 0.3, category: "Pirinç" },
    { name: "Yasemin Pirinç (Çiğ)", calories: 345, protein: 6.8, carbs: 79, fat: 0.7, category: "Pirinç" },
    { name: "Esmer Pirinç (Pişmiş)", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: "Pirinç" },
    { name: "Esmer Pirinç (Çiğ)", calories: 362, protein: 7.5, carbs: 72, fat: 2.3, category: "Pirinç" },
    { name: "Osmancık Pirinç (Pişmiş)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "Pirinç" },
    { name: "Baldo Pirinç (Pişmiş)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "Pirinç" },
    { name: "Glutenli Pirinç (Pişmiş)", calories: 97, protein: 2, carbs: 22, fat: 0.2, category: "Pirinç" },
    { name: "Siyah Pirinç (Pişmiş)", calories: 356, protein: 8.9, carbs: 75, fat: 1.8, category: "Pirinç" },
    { name: "Kırmızı Pirinç (Pişmiş)", calories: 362, protein: 7.2, carbs: 76, fat: 2.2, category: "Pirinç" },
    { name: "Vahşi Pirinç (Pişmiş)", calories: 101, protein: 4, carbs: 21, fat: 0.3, category: "Pirinç" },
    { name: "Pirinç Lapası", calories: 68, protein: 1.4, carbs: 14, fat: 0.1, category: "Pirinç" },
    { name: "Sütlü Pirinç", calories: 97, protein: 3.1, carbs: 17.8, fat: 1.6, category: "Pirinç" },
    { name: "Pilav (Tereyağlı)", calories: 150, protein: 3, carbs: 28, fat: 3.5, category: "Pirinç" },

    // Bulgur Çeşitleri
    { name: "Bulgur (Pişmiş)", calories: 83, protein: 3, carbs: 19, fat: 0.2, category: "Bulgur" },
    { name: "Bulgur (Çiğ)", calories: 342, protein: 12.3, carbs: 76, fat: 1.3, category: "Bulgur" },
    { name: "İnce Bulgur", calories: 342, protein: 12.3, carbs: 76, fat: 1.3, category: "Bulgur" },
    { name: "Orta Bulgur", calories: 342, protein: 12.3, carbs: 76, fat: 1.3, category: "Bulgur" },
    { name: "Iri Bulgur", calories: 342, protein: 12.3, carbs: 76, fat: 1.3, category: "Bulgur" },
    { name: "Pilavlık Bulgur", calories: 83, protein: 3, carbs: 19, fat: 0.2, category: "Bulgur" },
    { name: "Kısır", calories: 127, protein: 3.8, carbs: 25, fat: 1.5, category: "Bulgur" },

    // Diğer Tahıllar
    { name: "Quinoa (Pişmiş)", calories: 120, protein: 4.4, carbs: 22, fat: 1.9, category: "Tahıl" },
    { name: "Quinoa (Çiğ)", calories: 368, protein: 14, carbs: 64, fat: 6, category: "Tahıl" },
    { name: "Amarant (Pişmiş)", calories: 102, protein: 4, carbs: 19, fat: 1.6, category: "Tahıl" },
    { name: "Çavdar (Pişmiş)", calories: 104, protein: 2.5, carbs: 22, fat: 0.7, category: "Tahıl" },
    { name: "Arpa (Pişmiş)", calories: 123, protein: 2.3, carbs: 28, fat: 0.4, category: "Tahıl" },
    { name: "Darı (Pişmiş)", calories: 119, protein: 3.5, carbs: 23, fat: 1, category: "Tahıl" },
    { name: "Karabuğday (Pişmiş)", calories: 92, protein: 3.4, carbs: 20, fat: 0.6, category: "Tahıl" },
    { name: "Teff (Pişmiş)", calories: 101, protein: 3.9, carbs: 20, fat: 0.7, category: "Tahıl" },

    // Yulaf Ürünleri
    { name: "Yulaf Ezmesi (Pişmiş)", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, category: "Yulaf" },
    { name: "Yulaf Ezmesi (Çiğ)", calories: 389, protein: 16.9, carbs: 66, fat: 6.9, category: "Yulaf" },
    { name: "Yulaf Unu", calories: 404, protein: 14.7, carbs: 72, fat: 8.2, category: "Yulaf" },
    { name: "Yulaf Kepeği", calories: 246, protein: 17.3, carbs: 66, fat: 7, category: "Yulaf" },
    { name: "Hazır Yulaf Gevregi", calories: 379, protein: 13, carbs: 67, fat: 6.5, category: "Yulaf" },

    // Makarna Çeşitleri
    { name: "Makarna (Pişmiş)", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Makarna (Çiğ)", calories: 371, protein: 13, carbs: 74, fat: 1.5, category: "Makarna" },
    { name: "Tam Buğday Makarna (Pişmiş)", calories: 124, protein: 5.3, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Glütensiz Makarna (Pişmiş)", calories: 127, protein: 2.5, carbs: 28, fat: 0.9, category: "Makarna" },
    { name: "Spagetti", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Penne", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Fusilli", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Farfalle", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Linguine", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Fettuccine", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Lasagna Yaprağı", calories: 131, protein: 5, carbs: 25, fat: 1.1, category: "Makarna" },
    { name: "Ravioli", calories: 175, protein: 7.5, carbs: 24, fat: 5.5, category: "Makarna" },

    // Ekmek Çeşitleri
    { name: "Beyaz Ekmek", calories: 265, protein: 9, carbs: 49, fat: 3.2, category: "Ekmek" },
    { name: "Tam Buğday Ekmeği", calories: 247, protein: 13, carbs: 41, fat: 4.2, category: "Ekmek" },
    { name: "Çavdar Ekmeği", calories: 259, protein: 9, carbs: 48, fat: 3.3, category: "Ekmek" },
    { name: "Siyah Ekmek", calories: 259, protein: 8.5, carbs: 48, fat: 3.3, category: "Ekmek" },
    { name: "Kepekli Ekmek", calories: 247, protein: 13, carbs: 41, fat: 4.2, category: "Ekmek" },
    { name: "Glütensiz Ekmek", calories: 240, protein: 3.5, carbs: 43, fat: 6.2, category: "Ekmek" },
    { name: "Yulaf Ekmeği", calories: 269, protein: 10.6, carbs: 43, fat: 4.5, category: "Ekmek" },
    { name: "Tohumlu Ekmek", calories: 265, protein: 13, carbs: 35, fat: 8.5, category: "Ekmek" },
    { name: "Sourdough Ekmek", calories: 289, protein: 11.7, carbs: 56, fat: 1.5, category: "Ekmek" },
    { name: "Baget", calories: 276, protein: 8.8, carbs: 55, fat: 1.6, category: "Ekmek" },
    { name: "Ciabatta", calories: 271, protein: 9.2, carbs: 54, fat: 1.9, category: "Ekmek" },
    { name: "Pide Ekmeği", calories: 275, protein: 9, carbs: 55, fat: 1.2, category: "Ekmek" },
    { name: "Lavash", calories: 275, protein: 9, carbs: 56, fat: 1.2, category: "Ekmek" },
    { name: "Pita Ekmeği", calories: 275, protein: 9, carbs: 55, fat: 1.2, category: "Ekmek" },
    { name: "Naan", calories: 262, protein: 8.7, carbs: 45, fat: 5.1, category: "Ekmek" },
    { name: "Tortilla (Buğday)", calories: 304, protein: 8.2, carbs: 51, fat: 7.7, category: "Ekmek" },
    { name: "Tortilla (Mısır)", calories: 218, protein: 5.7, carbs: 44, fat: 2.9, category: "Ekmek" },
    { name: "Tost Ekmeği", calories: 265, protein: 9, carbs: 49, fat: 3.2, category: "Ekmek" },
    { name: "Hamburger Ekmeği", calories: 294, protein: 9.4, carbs: 56, fat: 4.6, category: "Ekmek" },
    { name: "Hot Dog Ekmeği", calories: 300, protein: 8.7, carbs: 56, fat: 5.2, category: "Ekmek" },

    // Gevrekler ve Müsli
    { name: "Mısır Gevregi", calories: 357, protein: 7.5, carbs: 84, fat: 0.9, category: "Gevrek" },
    { name: "Buğday Gevregi", calories: 340, protein: 10.3, carbs: 76, fat: 2.5, category: "Gevrek" },
    { name: "Pirinç Gevregi", calories: 382, protein: 6.3, carbs: 85, fat: 1.2, category: "Gevrek" },
    { name: "Müsli", calories: 367, protein: 9.1, carbs: 66, fat: 6.2, category: "Gevrek" },
    { name: "Granola", calories: 471, protein: 13.3, carbs: 64, fat: 18.8, category: "Gevrek" },
    { name: "Çikolatalı Gevrek", calories: 379, protein: 6.3, carbs: 84, fat: 3.6, category: "Gevrek" },
    { name: "Ballı Gevrek", calories: 385, protein: 6.7, carbs: 87, fat: 2.5, category: "Gevrek" },

    // DEVAM EDIYOR... (Daha fazla kategori eklenecek)
];

// Bu dosya kalorimax-ultimate.html'e dahil edilecek
console.log(`Ek ${additionalFoods.length} besin daha yüklendi!`); 