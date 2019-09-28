var express = require('express');
var router = express.Router();
const cypress = require('cypress')
const fs = require('fs');
const public_directory = "./public/";
var CypressTest = require('../models/cypress-test.model');

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/* GET home page. */
router.post('/', function (req, res, next) {

  cypress.run({
    spec: './cypress/integration/color_palette_test.spec.js',
    config: {
      video: false
    }

  })
    .then((results) => {
      let data = results.runs[0];
      let id = makeid(12);
      if (data.error === null) {
        data.screenshots.map((s, i) => {
          s.name = `${id}_${i}.png`;
          if (!fs.existsSync(public_directory)) {
            fs.mkdirSync(public_directory);
          }
          fs.copyFile(s.path, `${public_directory}${s.name}`, (err) => {
            if (err) throw err;
            s.path = `${public_directory}${s.name}`;
          });
        });
        let test = {
          reporterStats: data.reporterStats,
          error: data.error,
          screenshots: data.screenshots
        }
        CypressTest.create(test, function (err, post) {
          if (err) return next(err);
          res.send({
            code: 200,
            data: post
          });
        });
      } else {
        res.send({
          code: 201,
          data: {
            reporterStats: data.reporterStats,
            error: data.error
          }
        });
      }
    })
    .catch((err) => {
      res.send({
        code: 202,
        error: err
      });
    })
});

router.get('/', function (req, res, next) {
  CypressTest.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

router.get('/last', function (req, res, next) {
  CypressTest.findOne(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

module.exports = router;