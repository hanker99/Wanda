const Credential = require("../models/Credential");


module.exports = class CredentialService {

    static async setCredentials(data) {
        const credentials = await Credential.create(data);
    }

    static async getCredentials(key) {
        const credentials = await Credential.findOne({ 'name': key });
        return credentials
    }

}