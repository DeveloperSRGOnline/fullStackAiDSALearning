const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../services/storage.service');
const Song = require('../models/song.model');

// its for file handling , we store file in ram temperary
const upload = multer({storage:multer.memoryStorage()})

// song upload , create in db.
router.post("/songs",upload.single("audio"), async (req, res) => {

    const fileData = await uploadFile(req.file)
    
    // saving song in db
    const song = await Song.create({
        title:req.body.title,
        artist:req.body.artist,
        mood:req.body.mood,
        url:fileData.url
    })

    res.json({
        message:"Song created successfully.",
        song:song
    })
})

// get method for getting songs
router.get("/songs",async(req,res)=>{
    const {mood} = req.query
    
    const songs = await Song.find({
        mood:mood
    })

    res.status(200).json({
        songs:songs
    })
})


module.exports = router;