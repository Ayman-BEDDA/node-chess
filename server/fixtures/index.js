const roleFixture = require('./role');
const userFixture = require('./user');
const friendFixture = require('./friend');
const gameFixture = require('./game');
const buyFixture = require('./buy');
const articleFixture = require('./article');
const moneyFixture = require('./money');

async function generateAllTestData() {
    try {
        await roleFixture();
        await userFixture();
        await friendFixture();
        await gameFixture();
        await moneyFixture();
        await articleFixture();
        await buyFixture();
        console.log('All test data generated successfully');
    } catch (error) {
        console.error('Error generating test data: ', error);
    }
}

generateAllTestData();