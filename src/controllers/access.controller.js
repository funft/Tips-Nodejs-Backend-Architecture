const { CREATED, OK } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    async logout(req, res) {
        const result = await AccessService.logout(req.keyStore._id);
        console.log('result', result);
        new OK('logout success', result).send(res)
    }
    async signIn(req, res) {
        const result = await AccessService.signIn(req.body.email, req.body.password, req.body.refreshToken);
        new OK('login success', result).send(res)
    }
    async signup(req, res) {
        // Check sự tồn tại email
        // rồi thì trả về thông báo
        // nếu chưa thì create, tạo accestoken, refreshtoken
        const result = await AccessService.signUp(req.body.name, req.body.email, req.body.password);
        new CREATED('register success', result).send(res)
    }
}

module.exports = new AccessController();