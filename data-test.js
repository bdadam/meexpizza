const fs   = require('fs');
const yaml = require('js-yaml');

const getslug = text => require('speakingurl')(text, { lang: 'hu' });

const fileContent = fs.readFileSync('menu.yml', 'utf8');
const doc = yaml.safeLoad(fileContent);

const version = fileContent.match(/version\:\s([\S]+)/)[1];
const categories = Object.keys(doc);


console.log(version);

const convert = () => {

    return {

        categories

    };


    return doc;
};


// console.log(require('util').inspect(doc, { depth: null }));
