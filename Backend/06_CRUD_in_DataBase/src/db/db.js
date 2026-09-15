const mongoose = require("mongoose")

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to DB...")
    })
}

module.exports = connectToDB