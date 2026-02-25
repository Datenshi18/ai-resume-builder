//Mongodb connection 
const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb connected")
    }
    catch(error){
        console.error("Mongodb connection error",error.message);
        process.exit(1);// “If the database connection fails, print the error and stop the server with an error status.”
    }
}
module.exports= connectDb;
