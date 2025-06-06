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
    console.log('Kullanıcı verileri kaydediliyor...', { userId, data });
    try {
        if (!db) {
            throw new Error('Firestore bağlantısı yok!');
        }
        await setDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('Veri başarıyla kaydedildi');
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
        throw error;
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
