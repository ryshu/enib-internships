// Init script
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

var src, dest;

function copyFileSync(source, target) {
    var targetFile = target;
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

try {
    // Copy env file
    src = path.resolve(__dirname, '../../.env');
    dest = path.resolve(__dirname, '../../dist');
    copyFileSync(src, dest);

    console.info(chalk.blue('Service initialized.'));
} catch (error) {
    console.error(error);
}