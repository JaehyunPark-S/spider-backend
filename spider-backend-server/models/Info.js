const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infoSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jobid: { type: String || Number },
    progress: { type: Number }
});
{
    collection= 'infos'
}

module.exports = mongoose.model('Info', infoSchema)