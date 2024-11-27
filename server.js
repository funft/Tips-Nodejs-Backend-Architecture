// file này ko bao giờ đụng, dùng kết nối network của nodejs, đụng thì đụng file app
const app = require('./src/app');
const PORT = 3055;
const server = app.listen(PORT, () => {
    console.log('WSV eCommerce start in port', PORT);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server is closed');
        return process.exit(0);
    });
    // Báo lỗi khi server bị đóng
    // notify.send('ping...')
})