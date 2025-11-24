const bcrypt = require('bcrypt');

async function generateHashes() {
    const password = '123456';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    const hash3 = await bcrypt.hash(password, 10);

    console.log('Admin hash:', hash1);
    console.log('Shop hash:', hash2);
    console.log('User hash:', hash3);
}

generateHashes();


