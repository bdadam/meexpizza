const args = require('yargs')
                .command('add', 'Add new item')
                .demand(1)

                .describe('c', 'Category')
                .alias('c', 'category')

                .describe('n', 'Name')
                .alias('n', 'name')

                .argv;

console.log(args);

const path = require('path');
const Datastore = require('nedb');

const db = {
    cat: new Datastore({ filename: path.resolve(__dirname, './cat.nedb'), autoload: true }),
    food: new Datastore({ filename: path.resolve(__dirname, './food.nedb'), autoload: true }),
};

db.cat.insert({ id: 1, name: 'Pizzakenyér', text: '' });
db.cat.insert({ id: 2, name: 'Sajtos-fokhagymás pizzakenyér', text: 'sajt, fokhagyma, fűszerkeverék' });
