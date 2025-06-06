import { 
    auth, 
    db, 
    signInAnonymously, 
    onAuthStateChanged, 
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp 
} from '../config/firebase.js';

if (!auth || !db) {
    throw new Error('Firebase başlatılamadı! Lütfen yapılandırmayı kontrol edin.');
}

// Kullanıcı girişi yap
const signInUser = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        return userCredential.user.uid;
    } catch (error) {
        console.error('Anonim giriş hatası:', error);
        throw error;
    }
};

// Kullanıcı verilerini yükle
const loadUserData = async (userId) => {
    console.log('Kullanıcı verileri yükleniyor...', userId);
    try {
        if (!db) {
            throw new Error('Firestore bağlantısı yok!');
        }
        const userDoc = await getDoc(doc(db, 'users', userId));
        const data = userDoc.exists() ? userDoc.data() : null;
        console.log('Kullanıcı verileri yüklendi:', data);
        return data;
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
    }
};

// Kullanıcı verilerini kaydet
const saveUserData = async (userId, data) => {
    console.log('Firestore\'a veri kaydediliyor...', { userId, data });
    
    if (!userId) {
        const error = new Error('Geçersiz kullanıcı ID\'si');
        console.error(error);
        throw error;
    }
    
    if (!data) {
        const error = new Error('Kaydedilecek veri bulunamadı');
        console.error(error);
        throw error;
    }
    
    if (!db) {
        const error = new Error('Firestore bağlantısı kurulamadı!');
        console.error(error);
        throw error;
    }
    
    try {
        const userRef = doc(db, 'users', userId);
        console.log('Firestore doküman referansı oluşturuldu:', userRef.path);
        
        const dataToSave = {
            ...data,
            updatedAt: serverTimestamp()
        };
        
        console.log('Kaydedilecek veri:', dataToSave);
        
        await setDoc(userRef, dataToSave, { merge: true });
        console.log('Veri başarıyla kaydedildi');
        
        return true;
    } catch (error) {
        console.error('Veri kaydedilirken hata oluştu:', {
            error: error.message,
            stack: error.stack
        });
        throw new Error(`Veri kaydedilemedi: ${error.message}`);
    }
};

// Kimlik doğrulama durumunu dinle
const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export {
    signInUser,
    loadUserData,
    saveUserData,
    onAuthStateChangedListener
};
