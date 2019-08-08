const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var NameCondition = require('./modules/name-filter')

var app = express()

app.listen(process.env.PORT || 3000)

app.get('/', (req, res) => {
    res.send('hello.');
})

app.get('/info', (req, res) => {

    var url = req.query.url || 'https://twitter.com/' + req.query.user;

    console.log('>>' + req.query.url);

    request({
        url: url,
        method: 'get'
    }, (_err, _req, body) => {

        console.log('>>scraiping start.');

        const $ = cheerio.load(body)

        // console.log('b')

        if(_err) {
            res.send({
                message: 'エラーが発生しました。'
            })
        }
        
        $('a.ProfileHeaderCard-nameLink.u-textInheritColor.js-nav').each((i, elem) => {

            const username = $(elem).text();
            console.log(username);

            let condition = new NameCondition(url, username);

            res.send(condition.booth);

        });
    });
})