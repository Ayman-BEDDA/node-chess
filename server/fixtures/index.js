const roleFixture = require('./role');
const userFixture = require('./user');
const friendFixture = require('./friend');
const gameFixture = require('./game');

async function generateAllTestData() {
    try {
        await roleFixture();
        await userFixture();
        await friendFixture();
        await gameFixture();
        console.log('All test data generated successfully');
    } catch (error) {
        console.error('Error generating test data: ', error);
    }
}

generateAllTestData();