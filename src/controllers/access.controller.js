const { CREATED } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    async signup(req, res) {
        // Check sự tồn tại email
        // rồi thì trả về thông báo
        // nếu chưa thì create, tạo accestoken, refreshtoken
        const result = await AccessService.signUp(req.body.name, req.body.email, req.body.password);
        new CREATED('register success', result).send(res)
    }
}

module.exports = new AccessController();