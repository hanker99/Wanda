const MealkitService = require("../services/MealkitService");

module.exports = class Mealkit{
    static async apiAllMealkitList(req, res, next){

    }
    
    static async apiMealkitDetail(req, res, next){
        try {
          const mealkits = await MealkitService.getAllMealkit();
          if(!mealkits){
             res.status(404).json("There are no article published yet!")
          }
          res.json(mealkits);
        } catch (error) {
           res.status(500).json({error: error})
        }
 
    }
}