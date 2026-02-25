const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
    userId : String,
    title : String,
    summary: String,
    skills : [String],
    experience : String,
    education : String

})
const ResumeModel = mongoose.model("Resume", ResumeSchema);
module.exports = ResumeModel;