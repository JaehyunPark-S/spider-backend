/**
 * @copyright Copyright 2020 Medium Corp. All rights reserved.
 * @license   ISC
 * @author    jaehyun.park@themedium.io
 * @file Router / 클라이언트가 호출할 수 있는 API모음
 */

let express = require('express');
let router = express.Router();

let Info = require('../models/Info');
let userLib = require('./clientApiLib');


// DB에 이미지 업로드
router.post('/upload-images', async (req, res, next) => {
    let {file} = req.body;
    let result = await userLib.fileUpload(req, res)
    console.log(result)
    res.json(
        result
    )
})

// DB에 저장된 이미지정보 확인
router.get("/getimages", async (req, res, next) => {
    let result = await userLib.getImages();
    if(result.length === 0) {
        res.status(404).json({
            err: "Images not found"
        })
    }
    res.json(
        result
    )
});

// jobid에 대해 progress정보를 업데이트하고 데이터가 없으면 생성하는 함수를 호출
router.get('/updatejob', (req, res, next) => {
    let { jobid, progress } = req.query;
    Info.findOne({ jobid: jobid }, function (err, data) {
        if (!data) {
            userLib.createJobId(jobid, progress, res);
            return;
        }
                if (err) return res.status(500).json({ error: 'database failure' });

        if (req.query.progress) data.progress = req.query.progress;
        data.save(function (err) {
            if (err) res.status(500).json({ error: 'failed to update' });
            res.json({ message: `Now progress is ${req.query.progress}%` });
        });
    });
})

// 현재 jobid에대한 progress정보를 확인
router.get("/getprogress", async (req, res, next) => {
    let { jobid } = req.query
    let result = await userLib.getProgress(jobid)
    res.json(
        result
    )
});

// DB에 저장된 jobid, progress정보를 확인
router.get("/getinfos", async (req, res, next) => {
    let result = await userLib.getInfos();
    res.json(
        result
    )
});

// 노드들에게 이미지 전송
router.get("/getimage", async (req, res, next) => {
    let { jobid, batchidx } = req.query;
    let result = await userLib.getImage(jobid, batchidx)
    if(result.length === 0){
        res.stataus(404).json({
            err: "Image not found"
        })
    }
    res.end(
        result
        )
});

// 분석결과를 반환받는다. 
router.get("/setresult", async (req, res, next) => {
    let { jobid, batchidx, batchjob, rect, text } = req.query;
    let result = await userLib.setResult(jobid, batchidx, batchjob, rect, text);
    console.log(result)
    res.json(
        result
    )
});

//결화를 보여준다
router.get("/getresult", async (req, res, next) => {
    let { jobid } = req.query;
    let result = await userLib.getResult(jobid)
    if (result.length === 0) {
        return res.status(404).json({ error: "jobid not found" })
    }
    res.json(
        result
    )
});

module.exports = router;