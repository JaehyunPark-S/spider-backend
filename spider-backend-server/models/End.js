const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const endSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jobid: { type: String || Number },
    batchidx: { type: Number },
    batchjob: {type: String },
    rect: {type: String || Number },
    text: {type: String },
});
{
    collection= 'ends'
}

module.exports = mongoose.model('End', endSchema)