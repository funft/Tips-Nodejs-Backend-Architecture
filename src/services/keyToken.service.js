'use strict'
const keyToKenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

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
    static async findByUserId(userId, select = { name: 1, email: 1, status: 1, roles: 1 }) {
        const foundShop = await keyToKenModel.findOne({
            userId: userId
        }).select(select).lean();
        return foundShop;
    }

    static async removeKeyToken({ keyStoreId }) {
        const result = await keyToKenModel.findOneAndDelete({ _id: new Types.ObjectId(keyStoreId) });
        console.log('result delKey', result);
        return result
    }
}


module.exports = KeyTokenService;