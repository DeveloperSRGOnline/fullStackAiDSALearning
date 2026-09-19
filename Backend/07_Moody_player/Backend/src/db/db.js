const mongoose = require('mongoose')


async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.log("DB Connection Failed:", error.message)
    }
}

module.exports = connectToDB;