var express = require('express');
var router = express.Router();
const cypress = require('cypress')
const fs = require('fs');
const resemble = require('resemblejs');
const compareImages = require("resemblejs/compareImages");
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


function compareImgs(img1, img2, oncomplete) {
  var diff = resemble(`./public/${img1}.png`)
    .compareTo(`./public/${img2}.png`)
    .onComplete(oncomplete);
}




/* GET home page. */
router.post('/', function (req, res, next) {
  let test = {
    requester: req.body.requester
  }

  CypressTest.create(test, function (err, newTest) {
    if (err) return next(err);

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

          newTest.reporterStats = data.reporterStats;
          newTest.error = data.error;
          newTest.screenshots = data.screenshots;
          if (newTest.reporterStats.passes === newTest.reporterStats.tests) {
            newTest.status = "success";
          } else {
            newTest.status = "failed";
          }
          /*newTest.save().then(result => {
            res.send({
              code: 200,
              data: result
            });
          }).catch(err => {
            console.log("err", err);
            res.send({
              code: 201,
              data: {
                reporterStats: data.reporterStats,
                error: data.error
              }
            });
          });*/
          if (data.screenshots.length === 2) {

            compareImgs(`${id}_0`, `${id}_1`, (data) => {

              console.log("data", data)
              fs.writeFileSync(`${public_directory}${id}_diff.png`, data.getBuffer());
              newTest.resemble = data;
              newTest.resemble['img'] = `${id}_diff.png`;
              newTest.save().then(result => {
                res.send({
                  code: 200,
                  data: result
                });
              }).catch(err => {
                console.log("err", err);
                res.send({
                  code: 201,
                  data: {
                    reporterStats: data.reporterStats,
                    error: data.error
                  }
                });
              });
            })
          } else {
            newTest.save().then(result => {
              res.send({
                code: 200,
                data: result
              });
            }).catch(err => {
              console.log("err", err);
              res.send({
                code: 201,
                data: {
                  reporterStats: data.reporterStats,
                  error: data.error
                }
              });
            });
          }


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
        console.log("err", err);
        res.send({
          code: 202,
          error: err
        });
      })

  });
});

router.get('/', function (req, res, next) {
  CypressTest.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

router.get('/last', function (req, res, next) {
  CypressTest.findOne(function (err, products) {
    if (err) {
      res.json({ code: 400, message: "Error consultando", error: err })
    } else {
      res.json(products);
    }
  }).sort('-creation_date');
});

module.exports = router;