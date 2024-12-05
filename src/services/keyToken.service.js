'use strict'
const keyToKenModel = require('../models/keytoken.model');
class KeyTokenService {
    static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyToKenModel.create({
            //     userId: userId,
            //     publicKey: publicKeyString,
            //     privateKey: privateKey
            // })
            // return tokens ? publicKeyString : null;

            // level xxx
            const filter = { userId: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
                options = { upsert: true, new: true };
            const tokens = await keyToKenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;
        } catch (err) {
            return err;
        }
    }
}


module.exports = KeyTokenService;