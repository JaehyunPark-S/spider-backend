/**
 * @copyright Copyright 2020 Medium Corp. All rights reserved.
 * @license   ISC
 * @author    jaehyun.park@themedium.io
 * @file Database, Web-Front 와 연결을 해줌
 */

let Info = require('../models/Info');
let mongoose = require('mongoose');
let Image = require('../models/Image');
let End = require('../models/End');
let multer = require('multer');
let fs = require('fs');
const DIR = './public/';


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

/**
 * 웹프론트에서 백앤드서버로 이미지를 전송한다.
 * @constructor
 * @param {Object} req Get delivered router
 * @param {Object} res Get delivered router
 * @return {Object} Image data
 */

module.exports.fileUpload = (req, res) => {
    return new Promise(function (resolve, reject) {

        let uploads = upload.array('file', 10);
        /**
         * @method uploads
         * @function
         * @inner
         * @memberOf fileUpload
         * @description Multer를 이용하여 파일을 db와 로컬에 저장해준다.
         * @return {Object} Image data
         */
        uploads(req, res, (err) => {
            let reqFiles = [];
            let url = req.protocol + '://' + req.get('host')
            for (var i = 0; i < req.files.length; i++) {
                reqFiles.push(url + '/public/' + req.files[i].filename)
            }
            let image = new Image({
                _id: new mongoose.Types.ObjectId(),
                imgCollection: reqFiles
            });

            image.save().then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        })
    });
}

/**
 * 데이터베이스에 저장된 이미지파일을 반환
 * @constructor
 * @return {Object} Images data
 */
module.exports.getImages = async () => {
    return await Image.find()
    // let result = Image.find().then(data => {
    //     return data;
    // });
    // return result;
}

/**
 * 데이터베이스에 저장된 유저 정보를 반환
 * @constructor
 * @return {Object} Database users information
 */
module.exports.getInfos = async () => {
    return await Info.find()
    // let result = Info.find().then(data => {
    //     return data;
    // })
    // return result;
}

/**
 * jobid에 해당하는 결과를 반환
 * @constructor
 * @param {String} jobid ID of the information you want to find
 * @return {Object} Result corresponding to jobid
 */
module.exports.getResult = async (jobid) => {
    return await End.find({ jobid })
    // let result = End.find({ jobid }).then(data => {
    //     console.log(data)
    //     return data;
    // })
    // return result;
}

/**
 * jobid에 해당하는 진행률을 반환
 * @constructor
 * @param {String} jobid ID of the information you want to find
 * @return {number} Progress corresponding to jobid
 */
module.exports.getProgress = async (jobid, req) => {
    return (await Info.findOne({ jobid })).progress
    // let result = Info.findOne({ jobid }).then(data => {

    //     console.log(data.progress)
    //     return data.progress;
    // });
    // return result;
}

/**
 * 노드서버에서 분석한 이미지파일에대한 결과를 DB에 저장
 * @constructor
 * @param {String} jobid Jobid corresponding to the image analyzed
 * @param {Number} batchidx Which image
 * @param {String} batchjob face or ocr or apr
 * @param {Number} rect Size
 * @param {String} text Kind of image
 * @return {Object} Data stored in db
 */
module.exports.setResult = async (jobid, batchidx, batchjob, rect, text) => {
    let end = new End({
        _id: new mongoose.Types.ObjectId(),
        jobid: jobid,
        batchidx: batchidx,
        batchjob: batchjob,
        rect: rect,
        text: text,
    });

    return await end.save();

    // let result = end.save().then(data => {
    //     return data
    // })
    // console.log("----------")
    // console.log(result)
    // return result;
}

/**
 * jobid생성
 * @constructor
 * @param {String} jobid New jobid
 * @param {Number} progress Progress corresponding to the jobid
 * @return {Object} Data stored in db
 */
module.exports.createJobId = (jobid, progress, res) => {
    let info = new Info({
        _id: new mongoose.Types.ObjectId(),
        jobid: jobid,
        progress: progress
    });

    info.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: "save sucessful",
            infoCreated: {
                _id: result._id,
                jobid: jobid,
                progress: progress
            }
        });
    })
}

/**
 * 백앤드에서 노드서버로 이미지 전달
 * @constructor
 * @param {String} jobid Jobid corresponding to the image
 * @param {Number} batchidx Which image
 * @return {Object} Image data
 */
module.exports.getImage = (jobid, batchidx) => {
    return new Promise(function (resolve, reject) {
        let files = fs.readdirSync(DIR);
        fs.readFile(DIR + files[batchidx], (err, data) => {
            if (!err) {
                console.log(data)
                resolve(data)
            }
            else {
                reject(err);
            }
        })
    })
}