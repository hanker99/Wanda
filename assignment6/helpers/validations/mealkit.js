module.exports = {
    validationMealkitData(req) {

        let error = {}

        if (req.body.title == '' || req.body.title == null) {
            error.title = 'Title is required.'
        }
        if (req.body.includes == '' || req.body.includes == null) {
            error.included = 'Includes is required.'
        }
        if (req.body.description == '' || req.body.description == null) {
            error.description = 'Description is required.'
        }
        if (req.body.price == '' || req.body.price == null) {
            error.price = 'Price is required.'
        }
        if (req.body.cookingTime == '' || req.body.cookingTime == null) {
            error.cookingTime = 'Cooking time is required.'
        }
        if (req.body.servings == '' || req.body.servings == null) {
            error.servings = 'servings is required.'
        }
        if (req.body.caloriesPerServing == '' || req.body.caloriesPerServing == null) {
            error.caloriesPerServing = 'Calories Per Serving is required.'
        }
        
        // if (req.body.imageUrl == '' || req.body.imageUrl == null) {
        //     error.imageUrl = 'image is required.'
        // }

        return error
    }
}