const Mealkit = require("../models/Mealkit");
var ObjectId = require('mongodb').ObjectId;

module.exports = class MealkitService {
    static async getAllMealkit() {
        try {

            //let test = await Mealkit.create({title: 'title 1', body: 'body 2', article_image: 'article_image 1',  date: 'date 12' });
            const allMealkit = await Mealkit.find().lean();
            return allMealkit;
        } catch (error) {
            console.log(`Could not fetch mealkit ${error}`)
        }
    }

    static async isAlreadyExist(req) {
        try {

            //let test = await Mealkit.create({title: 'title 1', body: 'body 2', article_image: 'article_image 1',  date: 'date 12' });
            let mealkit;
            if (req.body.id !== undefined) {
                mealkit = await Mealkit.find({ title: req.body.title, _id: { $ne: req.body.id } });
            } else {
                mealkit = await Mealkit.find({ title: req.body.title });
            }

            return mealkit;
        } catch (error) {
            console.log(`Could not fetch mealkit ${error}`)
        }
    }

    static async add(data) {
        try {

            //let test = await Mealkit.create({title: 'title 1', body: 'body 2', article_image: 'article_image 1',  date: 'date 12' });
            const mealkit = await Mealkit.create(data);
            return mealkit;
        } catch (error) {
            console.log(`Could not fetch mealkit ${error}`)
        }
    }
    static async update(id, data) {
        try {
            //let test = await Mealkit.create({title: 'title 1', body: 'body 2', article_image: 'article_image 1',  date: 'date 12' });
            const mealkit = await Mealkit.updateOne({ _id: new ObjectId(id) }, data);
            return mealkit;
        } catch (error) {
            console.log(`Could not fetch mealkit ${error}`)
        }
    }

    static async deleteMealkit(data) {
        try {

            //let test = await Mealkit.create({title: 'title 1', body: 'body 2', article_image: 'article_image 1',  date: 'date 12' });
            const mealkit = await Mealkit.deleteOne(data);
            return mealkit;
        } catch (error) {
            console.log(`Could not delete mealkit ${error}`)
        }
    }

    static async getMealkitDetail(data) {
        try {
            const mealkit = await Mealkit.findOne(data).lean();
            return mealkit;
        } catch (error) {
            console.log(`Could not delete mealkit ${error}`)
        }
    }

    static async getMealsByCategory() {
        try {

            const mealKit = await Mealkit.find().lean();
            const result = mealKit.reduce(function (r, a) {
                r[a.category] = r[a.category] || [];
                r[a.category].push(a);
                return r;
            }, Object.create(null));

            let dataObj = []
            for (const property in result) {

                let data = {
                    name: property,
                    data: [...result[property]]
                }
                dataObj.push(data)
            }

            return dataObj
        } catch (error) {
            console.log(`Could not delete mealkit ${error}`)
        }
    }

    static async getTopMeals() {
        try {
            const allMealkit = await Mealkit.find({topMeal: true}).lean();
            return allMealkit;
        } catch (error) {
            console.log(`Could not delete mealkit ${error}`)
        }
    }

    static async getMealkitById(data){
        try {
            const allMealkit = await Mealkit.findOne(data).lean();
            return allMealkit;
        } catch (error) {
            console.log(`Could not delete mealkit ${error}`)
        }
    }
}