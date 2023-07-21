const roleFixture = require('./role');
const userFixture = require('./user');
const friendFixture = require('./friend');
const gameFixture = require('./game');
const buyFixture = require('./buy');
const articleFixture = require('./article');
const moneyFixture = require('./money');
const ownFixture = require('./own')

async function generateAllTestData() {
    try {

        await ownFixture();
        console.log('All test data generated successfully');
    } catch (error) {
        console.error('Error generating test data: ', error);
    }
}

generateAllTestData();