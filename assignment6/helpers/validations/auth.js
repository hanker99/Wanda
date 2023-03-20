module.exports = {
    validationLogin(req) {

        let error = {}

        if (req.body.email == '' || req.body.email == null) {
            error.email = 'Username is required.'
        }
        if (req.body.role == '' || req.body.role == null) {
            error.role = 'Role is required.'
        }
        if (req.body.password == '' || req.body.password == null) {
            error.password = 'Password is required.'
        }
        return error
    },
    validationSignup(req) {

        let error = {}
        let emailExpression = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w{2,4}([-.]\w+)*$/;

        let passwordExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,11}$/;
        let passwordSmallExpression = /(?=.*[a-z])[a-z].{0,}$/;
        let passwordUpperExpression = /(?=.*[A-Z])[A-Z].{0,}$/;
        let passwordNumberExpression = /(?=.*\d)[\d].{0,}$/;
        let passwordSpecialExpression = /(?=.*[@$!%*?&])[@$!%*?&].{0,}$/;

        if (req.body.firstName == '' || req.body.firstName == null) {
            error.firstName = 'First name is required.'
        }
        if (req.body.lastName == '' || req.body.lastName == null) {
            error.lastName = 'Last name is required.'
        }
        if (req.body.email == '' || req.body.email == null) {
            error.email = 'Email is required.'
        } else if(!emailExpression.test(req.body.email)){
            error.email = 'Please enter valid email.'
        }
        if (req.body.password == '' || req.body.password == null) {
            error.password = 'Password is required.';
        } else if(!passwordSmallExpression.test(req.body.password)) {
            error.password = 'Enter at least one lowercase letter.';
        } else if(!passwordUpperExpression.test(req.body.password)) {
            error.password = 'Enter at least one uppercase letter.';
        } else if(!passwordNumberExpression.test(req.body.password)) {
            error.password = 'Enter at least one number.';
        } else if(!passwordSpecialExpression.test(req.body.password)) {
            error.password = 'Enter at least one symbol.';
        } else if(!passwordExpression.test(req.body.password)) {
            error.password = 'Password length must be between 8-12.';
        }

        if (req.body.gender == '' || req.body.gender == null) {
            error.gender = 'Gender is required.'
        }
        if (req.body.confirmPassword == '' || req.body.confirmPassword == null) {
            error.confirmPassword = 'Confirm password is required.'
        }else if (req.body.confirmPassword == '' || req.body.confirmPassword !== req.body.password) {
            error.confirmPassword = 'Password and confirm password must be same.'
        }
        if (req.body.term == '' || req.body.term == null) {
            error.term = 'Select term & conditions.'
        }
        return error
    }
}