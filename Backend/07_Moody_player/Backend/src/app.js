const express = require('express')
const songRoutes = require('./routes/song.routes.js')

const app = express()
app.use(express.json());

// this will redirect all routes to the songRoutes
app.use("/", songRoutes)

module.exports = app;