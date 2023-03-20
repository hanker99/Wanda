const User = require("../models/User");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);


module.exports = class AuthService {

    static async register(body) {
        try {
            let tempData = body;
            delete tempData.confirmPassword;
            tempData.password = await bcrypt.hashSync(body.password, salt);
            // Store hash in your password DB.
            const user = await User.create(tempData);
            // const allArticles = await  User.find();
            return user;
        } catch (error) {
            console.log(`Could not register user ${error}`)
        }
    }

    static async isUserExist(body) {
        try {
            const user = await User.findOne({ email: body.email })
            if (user !== null) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(`Could not find user ${error}`)
        }
    }

    static async isAuthenticated(body, req) {

        try {
            const user = await User.findOne({ email: body.email })

            const session = req.session;
            session.userid = user._id;
            session.role = body.role;
            session.firstName = user.firstName;
            session.email = user.email;
            req.session.save(function (err) {
            })

            let isValid = await bcrypt.compareSync(body.password, user.password)
            if (isValid) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(`Could not autheticate user ${error}`)
        }
    }

}