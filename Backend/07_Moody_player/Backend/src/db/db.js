const mongoose = require('mongoose')


async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.log("DB Connection Failed")
    }
}

module.exports = connectToDB;