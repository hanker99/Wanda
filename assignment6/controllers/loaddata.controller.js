const MealkitService = require("../services/MealkitService");
const MealkitValidation = require('../helpers/validations/mealkit')

module.exports = class Loaddata {
    static async apiAllData(req, res, next) {
        try {
            // const allMealkit = await MealkitService.getAllMealkit();
            // if (!allMealkit) {
            //   res.status(404).json("MealKit not found.")
            // }

            let allData = await MealkitService.getAllMealkit();

            allData = allData || [];
            const session = req.session;
            if (session.userid !== undefined && session.userid !== null && session.role === '1') {
                res.render('loadData', { layout: 'main', listExists: true, isLoggedIn: true, firstName: session.firstName, role: true, allData: allData });
            } else {
                res.redirect('/login');
            }

            //res.json(allMealkit);
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    static async apiAddData(req, res, next) {
        const errors = MealkitValidation.validationMealkitData(req);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.status(400).json({
                success: false,
                errors: errors
            });
        }
        let temp = await MealkitService.isAlreadyExist(req)
        if (temp.length > 0) {
            let errorsData = {
                title: 'This Meal already exists.'
            }
            return res.status(400).json({
                success: false,
                errors: errorsData,
                message: 'Create failed please enter valid data.'
            });
        }

        let data = {
            title: req.body.title,
            includes: req.body.includes,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            cookingTime: req.body.cookingTime,
            servings: req.body.servings,
            caloriesPerServing: req.body.caloriesPerServing,
            topMeal: req.body.topMeal !== undefined,
            imageUrl: req.file !== undefined ? req.file.filename ? '/' + req.file.filename : '' : ''
        }

        let dataAdded;
        if (req.body.id !== undefined) {
            data.imageUrl = req.file !== undefined ? req.file.filename ? '/' + req.file.filename : req.body.imageUrl : req.body.imageUrl;
            dataAdded = await MealkitService.update(req.body.id, data);
        } else {
            dataAdded = await MealkitService.add(data);
        }


        if (dataAdded) {

            let redirect;
            redirect = '/load-data/meal-kits';

            let data = {
                redirect: redirect
            }
            res.status(200).json({
                success: true,
                data: data,
                message: 'Added successful',
            })
        }
    }

    static async apiUpdateData(req, res, next) {

    }

    static async apiDeleteData(req, res, next) {
        try {

            let data = {
                "_id": req.body.id
            }
            let dataAdded = await MealkitService.deleteMealkit(data);

            if (dataAdded) {

                let redirect;
                redirect = '/load-data/meal-kits';

                let data = {
                    redirect: redirect
                }
                res.status(200).json({
                    success: true,
                    data: data,
                    message: 'Deleted successful',
                })
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    static async apiGetUpdateData(req, res, next) {
        try {
            const session = req.session;
            if (session.userid !== undefined && session.userid !== null) {
                let data = {
                    _id: req.params.id
                }

                const details = await MealkitService.getMealkitDetail(data);

                res.render('mealkit/add', { layout: 'main', listExists: true, isLoggedIn: true, firstName: session.firstName, role: '1', details: details });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    static async apiPostUpdateData(req, res, next) {

    }

    static async apiMenu(req, res, next) {
        try {
            const session = req.session;
            let data = await MealkitService.getMealsByCategory();
            res.render('menu', { layout: 'main', categoryMeal: data, listExists: true, isLoggedIn: session.firstName !== undefined, firstName: session.firstName, role: session.role == '1' });
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    static async apiHome(req, res, next) {
        try {
            const session = req.session;
            let data = await MealkitService.getTopMeals();
            res.render('index', { layout: 'main', topMeals: data, listExists: true, isLoggedIn: session.firstName !== undefined, firstName: session.firstName, role: session.role == '1' });
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    static async apiMealkitDetail(req, res, next) {
        try {
            const session = req.session;
            let data = {
                _id: req.params.id
            }

            const mealkits = await MealkitService.getMealkitById(data);
            if (!mealkits) {
                res.status(404).json("There are no mealkit yet!")
            }

            console.log('mealkits', mealkits)
            res.render('mealkit/details', { layout: 'main', listExists: true, isLoggedIn: session.firstName != undefined, firstName: session.firstName, role: session.role, mealkits: mealkits });
           
        } catch (error) {
            res.status(500).json({ error: error })
        }

    }
}