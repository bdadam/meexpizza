const fs   = require('fs');
const yaml = require('js-yaml');

const doc = yaml.safeLoad(fs.readFileSync('menu.yml', 'utf8'));
const categories = Object.keys(doc);

console.log(categories);

// console.log(require('util').inspect(doc, { depth: null }));
