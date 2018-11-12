const readDir = require('fs').readdirSync;
const files = readDir('./src/components');
const entry = {};
files.forEach(file => {
    const name = file.split('.')[0];
    entry[name] = './src/components/' + file;
});
module.exports = entry;