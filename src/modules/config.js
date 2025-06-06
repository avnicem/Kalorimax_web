// Uygulama sabitleri
export const ERROR_MESSAGES = {
    DATA_SAVE: 'Veri kaydedilirken bir hata oluştu',
    PERMISSION_DENIED: 'Bu işlem için yetkiniz yok',
    NETWORK_ERROR: 'Ağ hatası oluştu. İnternet bağlantınızı kontrol edin.'
};

export const DEFAULT_GOALS = {
    dailyCalories: 2000,
    macros: {
        protein: 150,
        carbs: 200,
        fat: 65
    }
};

// DOM elementleri
export const getDomElements = () => ({
    foodForm: document.getElementById('food-form'),
    foodNameInput: document.getElementById('food-name'),
    foodCaloriesInput: document.getElementById('food-calories'),
    foodProteinInput: document.getElementById('food-protein'),
    foodCarbsInput: document.getElementById('food-carbs'),
    foodFatInput: document.getElementById('food-fat'),
    foodList: document.getElementById('food-list'),
    dailyCalories: document.querySelector('.calorie-count'),
    dailyGoal: document.querySelector('.calorie-goal'),
    dateElement: document.querySelector('.date'),
    macroBars: {
        protein: document.querySelector('.macro-protein .macro-fill'),
        carbs: document.querySelector('.macro-carbs .macro-fill'),
        fat: document.querySelector('.macro-fat .macro-fill')
    },
    macroAmounts: {
        protein: document.querySelector('.macro-protein .macro-amount'),
        carbs: document.querySelector('.macro-carbs .macro-amount'),
        fat: document.querySelector('.macro-fat .macro-amount')
    }
});
