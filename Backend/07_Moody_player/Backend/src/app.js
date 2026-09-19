const express = require('express')
const cors = require('cors')
const songRoutes = require('./routes/song.routes.js')

const app = express()

app.use(cors())
app.use(express.json());

// this will redirect all routes to the songRoutes
app.use("/", songRoutes)

module.exports = app;