import { 
    auth, 
    db, 
    signInAnonymously, 
    onAuthStateChanged, 
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp 
} from '../config/firebase';

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
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
    }
};

// Kullanıcı verilerini kaydet
const saveUserData = async (userId, data) => {
    try {
        await setDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
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
