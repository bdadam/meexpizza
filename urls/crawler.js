
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

const startUrl = 'http://www.meexpizza.hu/';
const crawled = {};

const queue = async.queue(function(url, callback) {
    if (crawled[url]) {
        return callback();
    }

    request(url, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.warn('Failed: ', url);
            return callback(error);
        }

        const $ = cheerio.load(body);
        const urls = [];
        $('a').each((a,b, c) => urls.push($(b).attr('href')));

        const filteredUrls = urls.filter(u => u && u.startsWith && u.startsWith('http://www.meexpizza.hu/'));

        const noop = () => {};
        filteredUrls.forEach(u => {
            if (!crawled[u]) {
                queue.push(u);
            }
        });

        console.log('Crawled:', url);
        crawled[url] = true;
        callback();
    });
}, 2);

queue.push(startUrl);

queue.drain = () => {
    const content = Object.keys(crawled).join('\n');
    fs.writeFileSync(content, 'crawled.txt');
}
