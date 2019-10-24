const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const MentoringPropositions = require('../../../dist/models/MentoringPropositions').default;

module.exports = async function(quantity = 100, debug = false) {
    const promises = [];
    for (let i = 0; i < quantity; i++) {
        const mentoringProposition = {
            comment: faker.lorem.paragraph(5),
        };
        promises.push(
            new Promise(async (resolve, reject) => {
                try {
                    await MentoringPropositions.create(mentoringProposition);
                    if (debug)
                        console.info(chalk.white(`Inject mentoring proposition in database`));

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }),
        );
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${quantity} mentoring propositions in database`));
};
