const { CREATED, OK } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    async handleRefreshToken(req, res) {
        new OK({
            message: 'refresh token success',
            metadata: await AccessService.handleRefreshToken({ keyStore: req.keyStore, refreshToken: req.refreshToken, shop: req.shop })
        }).send(res)
    }
    async logout(req, res) {
        const result = await AccessService.logout(req.keyStore._id);
        console.log('result', result);
        new OK({
            message: 'logout success',
            metadata: result
        }).send(res)
    }
    async signIn(req, res) {
        const result = await AccessService.signIn(req.body.email, req.body.password, req.body.refreshToken);
        new OK({
            message: 'login success',
            metadata: result
        }).send(res)
    }
    async signup(req, res) {
        // Check sự tồn tại email
        // rồi thì trả về thông báo
        // nếu chưa thì create, tạo accestoken, refreshtoken
        const result = await AccessService.signUp(req.body.name, req.body.email, req.body.password);
        new CREATED({
            message: 'register success',
            metadata: result
        }).send(res)
    }
}

module.exports = new AccessController();