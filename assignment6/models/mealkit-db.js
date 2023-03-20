let mealKit = [
    {
        "title": "Dungeness Crab",
        "includes": "four pairs of walking legs and a pair of claws.",
        "description": "Buy Dungeness Crab online and delivered to your home, workplace or office.",
        "category": "Classic Meals",
        "price": "$12.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 290,
        "imageUrl": "/images/meals/meal-1.jpeg",
        "topMeal":  true
    },
    {
        "title": "Moroccan Shrimp",
        "includes": "dash olive oil, teaspoon turmeric, coriander",
        "description": "Buy Moroccan Shrimp Crab online and delivered to your home, workplace or office.",
        "category": "Spice Meals",
        "price": "$40.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 1290,
        "imageUrl": "/images/meals/meal-2.jpeg",
        "topMeal":  true
    },
    {
        "title": "Seafood Pasta",
        "includes": "Mix of shrimp, clams, mussels and scallops",
        "description": "Buy Seafood Pasta Crab online and delivered to your home, workplace or office.",
        "category": "Spice Meals",
        "price": "$9.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 1390,
        "imageUrl": "/images/meals/meal-3.jpeg",
        "topMeal":  true
    },
    {
        "title": "Tuna Steaks",
        "includes": "Tuna steaks, orange juice, soy sauce, olive oil",
        "description": "Buy Tuna Steaks Crab online and delivered to your home, workplace or office.",
        "category": "Classic Meals",
        "price": "$31.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 590,
        "imageUrl": "/images/meals/meal-4.jpeg",
        "topMeal":  false
    },
    {
        "title": "Seared Ahi Tuna Steaks",
        "includes": "Ahi tuna, soy sauce, honey, toasted sesame oil",
        "description": "These Seared Ahi Tuna Steaks (also known as yellowfin or bigeye tuna) ",
        "category": "Classic Meals",
        "price": "$18.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 290,
        "imageUrl": "/images/meals/meal-5.jpeg",
        "topMeal":  false
    },
    {
        "title": "Seared Ahi Tuna steaks",
        "includes": "Cayenne pepper, butter, olive oil, Ahi tuna",
        "description": "Meaty, flavoursome tuna steaks are best enjoyed griddled or pan-fried. Choose from recipes including tangy tuna burgers, healthy seared tuna and fresh salads.",
        "category": "Classic Meals",
        "price": "$24.99",
        "cookingTime":  25,
        "servings": 2,
        "caloriesPerServing": 390,
        "imageUrl": "/images/meals/meal-6.webp",
        "topMeal":  false
    }

    
]


module.exports = {

    getTopMeals: () => {
        return mealKit.filter((item) => item.topMeal)
    },

    getMealsByCategory: () => {
        result = mealKit.reduce(function (r, a) {
            r[a.category] = r[a.category] || [];
            r[a.category].push(a);
            return r;
        }, Object.create(null));

        let dataObj = []
        for (const property in result) {

            let data = {
                name:property,
                data: [...result[property]]
            }
            dataObj.push(data)
        }

        return dataObj
    }
}