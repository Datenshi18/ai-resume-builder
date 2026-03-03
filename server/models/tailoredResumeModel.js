const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const tailorResumeSchema = new Schema({
    userId: ObjectId,
    masterResumeId: ObjectId,
    jobDescription: String,
    tailoredResume: String,
    createdAt: Date

})
const tailorResumeModel = mongoose.model("tailoredResume", tailorResumeSchema);
module.exports = tailorResumeModel;
