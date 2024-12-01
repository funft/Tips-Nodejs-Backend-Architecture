const AccessService = require('../services/access.service');

class AccessController {
    async signup(req, res) {
        try {
            // Check sự tồn tại email
            // rồi thì trả về thông báo
            // nếu chưa thì create, tạo accestoken, refreshtoken
            const result = await AccessService.signUp(req.body.name, req.body.email, req.body.password);
            res.status(201).json(
                result
            )
        } catch (err) {
            console.log('err', err);
            return res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new AccessController();