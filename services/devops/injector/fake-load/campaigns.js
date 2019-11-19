const faker = require('faker');
const chalk = require('chalk');

faker.locale = 'fr';
const Campaigns = require('../../../dist/models/Campaigns').default;
const InternshipTypes = require('../../../dist/models/InternshipTypes').default;

const categories = require('../../../dist/configs/data/categories').defaultCategories;

async function inject(c, category, debug) {
    const created = await Campaigns.create(c);
    await created.setCategory(category);
    if (debug) console.info(chalk.white(`Inject campaign "${c.name}" in database`));
}

module.exports = async function(quantity = 100, debug = false) {
    const q = quantity > categories.length ? categories.length : quantity;

    // Get all types to associate a type to our fake categories
    const types = await InternshipTypes.findAll();
    // If label doesn't exist, inject them
    if (types.length !== categories.length) {
        const todo = Object.assign([], categories);
        types.forEach((t) => {
            const found = todo.findIndex((td) => td === t.label);
            if (found !== -1) todo.splice(found, 1);
        });
        await Promise.all(todo.map((t) => InternshipTypes.create({ label: t })));
    }

    const promises = [];
    for (let i = 0; i < q; i++) {
        const campaign = {
            name: faker.lorem.words(3),
            description: faker.lorem.paragraphs(3),
            startAt: faker.random.number({ min: 1571347682, max: 1576618082 }),
            endAt: faker.random.number({ min: 1576618082, max: 1581974882 }),
            semester: faker.random.arrayElement([
                'S1',
                'S2',
                'S3',
                'S4',
                'S5',
                'S6',
                'S7',
                'S8',
                'S9',
                'S10',
            ]),
            maxPropositions: faker.random.number(20),
        };
        promises.push(inject(campaign, types[i].id, debug));
    }

    await Promise.all(promises);
    console.info(chalk.blue(`Successfully inject ${q} campaigns in database`));
};
