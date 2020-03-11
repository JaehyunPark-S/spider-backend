/**
 * @copyright Copyright 2020 Medium Corp. All rights reserved.
 * @license   ISC
 * @author    jaehyun.park@themedium.io
 * @file Router / 백엔드서버에서 스파이더 클라우드 서버에 데이터를 전달하는 API 모음
 */

let express = require('express');
const http = require('http');
let router = express.Router();

//배치잡 시작
router.get('/createjob', function (req, res, next) {
  let { deviceid, sapp, batchjob, batchcount, redirect_url } = req.query;

  var options = {
    host: '192.168.61.35',
    port: 12070,
    path: `/createjob?deviceid=${deviceid}&sapp=imagelog&batchjob=${batchjob}&batchcount=${batchcount}&redirect_url=http://192.168.61.51:4000/`,
  };

  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');

    var serverData = '';
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
      serverData += chunk;
    });

    response.on('end', function () {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json(
        JSON.parse(serverData)
      )
    })
  });
  httpreq.end();

});

//배치잡 확인하기
router.get('/getjob', function (req, res, next) {
  let { jobid } = req.query;
  var options = {
    host: '192.168.61.35',
    port: 12070,
    path: `/getjob?${jobid}`,
  };

  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');

    let serverData = '';
    response.on('data', function (chunk) {
      serverData = chunk;
      res.status(200).json({
        message: "success",
        serverData,
      });
    });
  });
  httpreq.end();
})


module.exports = router;