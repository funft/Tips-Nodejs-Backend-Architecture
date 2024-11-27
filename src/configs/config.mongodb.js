const dotenv = require('dotenv');
dotenv.config();

const dev = {
    app: {
        port: process.env.PORT_DEV || 3000
    },
    mongodb: {
        url: process.env.DEV_MONGODB_URL
    }
}
const pro = {
    app: {
        port: process.env.PORT_PRO || 3005
    },
    mongodb: {
        url: process.env.PRO_MONGODB_URL
    }
}
if (process.env.NODE_ENV === 'production') {
    module.exports = pro
}
else {
    module.exports = dev
}