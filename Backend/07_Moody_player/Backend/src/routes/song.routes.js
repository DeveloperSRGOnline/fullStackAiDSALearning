const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../services/storage.service');

// its for file handling , we store file in ram temperary
const upload = multer({storage:multer.memoryStorage()})

// song upload , create in db.
router.post("/songs",upload.single("audio"), async (req, res) => {
    console.log(req.body)
    console.log(req.file)

    const fileData = await uploadFile(req.file)
    console.log(fileData)
    res.json({
        message:"Song created successfully.",
        song:{
           data:req.body,
           file:req.file
        }
    })
})


module.exports = router;