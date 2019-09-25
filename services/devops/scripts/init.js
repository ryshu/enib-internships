// Init script
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var shelljs = require('shelljs');

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

function copyFolderSync(source, target) {
    var files = [];
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

function createIfNotExist(target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
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
