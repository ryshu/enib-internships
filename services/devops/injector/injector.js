// Init script
const path = require('path');
const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');

if (!fs.existsSync(path.resolve(__dirname, '../../dist'))) {
    console.error(error);
    process.exit(1);
}

program
    .option('-v, --verbose', 'Log every injection done')
    .option('-q, --quantity <number>', 'Quantity to inject', 100)
    .option('--businesses', 'Inject businesses')
    .option('--campaigns', 'Inject campaigns')
    .option('--internships', 'Inject internships')
    .option('--internships-types', 'Inject internships types')
    .option('--mentors', 'Inject mentors')
    .option('--mentoring-propositions', 'Inject mentoring propositions')
    .option('--students', 'Inject students')
    .option('--files', 'Inject files')
    .parse(process.argv);

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../dist/.env') });

require('../../dist/configs/instances/database'); // Only import to setup
require('../../dist/configs/setup/database'); // Only import to setup

const BusinessesLoader = require('./fake-load/businesses');
const CampaignsLoader = require('./fake-load/campaigns');
const InternshipsLoader = require('./fake-load/internships');
const MentorsLoader = require('./fake-load/mentors');
const MentoringPropositionsLoader = require('./fake-load/mentoring-propositions');
const StudentsLoader = require('./fake-load/students');
const FilesLoader = require('./fake-load/files');

// TODO: Handle multiple state for internships
// TODO: Add a demo setup CMD

Promise.resolve().then(async () => {
    try {
        if (program.businesses) await BusinessesLoader(program.quantity, program.verbose);
        if (program.campaigns) await CampaignsLoader(program.quantity, program.verbose);
        if (program.internships) await InternshipsLoader(program.quantity, program.verbose);
        if (program.mentors) await MentorsLoader(program.quantity, program.verbose);
        if (program.mentoringPropositions)
            await MentoringPropositionsLoader(program.quantity, program.verbose);
        if (program.students) await StudentsLoader(program.quantity, program.verbose);
        if (program.files) await FilesLoader(program.quantity, program.verbose);

        console.info(chalk.blue('Successfully setup data.'));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
