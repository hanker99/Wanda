const CredentialsService = require("../services/CredentialService");

module.exports = class Credential {
    static async setCrential(req, res, next) {

        let data  = {
            name: 'sendgrid',
            type: 'sendgrid',
            value: 'xyz'
        }
        await CredentialsService.setCredentials(data)

        res.status(200).json({
            success: true,
            message: 'Saved successful',
        })
    }
}