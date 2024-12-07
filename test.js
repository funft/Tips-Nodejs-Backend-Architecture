const createTokenPairHs256 = require('./src/auths/authUtils').createTokenPairHs256
async function test() {
    const tokens = await createTokenPairHs256({ userId: "123", email: "email" }, 'private', 'public')
    console.log('tokens', tokens);

}

test()