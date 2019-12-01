const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const MentoringPropositions = require('../../../dist/models/sequelize/MentoringPropositions')
    .default;

async function inject(mp, debug) {
    await MentoringPropositions.create(mp);
    if (debug) console.info(chalk.white(`Inject mentoring proposition in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const mentoringProposition = {
            comment: faker.lorem.paragraph(5),
        };
        promises.push(inject(mentoringProposition, debug));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} mentoring propositions in database`));
};
