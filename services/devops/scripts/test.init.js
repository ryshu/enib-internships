// Init script
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

function createIfNotExist(target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
}

try {
    createIfNotExist(
        path.resolve(__dirname, '../../src', process.env.BASE_STORAGE_DIR || 'caches'),
    );

    console.info(chalk.blue('Service initialized.'));
} catch (error) {
    console.error(error);
}
