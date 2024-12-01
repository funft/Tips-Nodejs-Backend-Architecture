'use strict'
const KeyToKenModel = require('../models/keytoken.model');
class KeyTokenService {
    static async createKeyToken(user, publicKey) {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await KeyToKenModel.create({
                user: user,
                publicKey: publicKeyString
            })
            return tokens ? publicKeyString : null;
        } catch (err) {
            return err;
        }
    }
}


module.exports = KeyTokenService;