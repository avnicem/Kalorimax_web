class FoodService {
    constructor() {
        this.foods = [];
        this.loadFoods();
    }

    async loadFoods() {
        // Burada gerçek bir API'den veya localStorage'dan veri yüklenebilir
        this.foods = [
            // Örnek veriler
            { id: 1, name: 'Tavuk Göğsü', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
            { id: 2, name: 'Pirinç Pilavı', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
            // Diğer besinler...
        ];
    }

    searchFoods(query) {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return this.foods.filter(food => 
            food.name.toLowerCase().includes(lowerQuery)
        );
    }

    addFood(food) {
        const newFood = {
            ...food,
            id: Date.now(),
            date: new Date().toISOString()
        };
        this.foods.push(newFood);
        this.saveFoods();
        return newFood;
    }

    saveFoods() {
        localStorage.setItem('foods', JSON.stringify(this.foods));
    }
}

export default new FoodService();
