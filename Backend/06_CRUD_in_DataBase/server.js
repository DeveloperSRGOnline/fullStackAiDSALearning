require("dotenv").config()
const express = require("express")
const connectToDB = require("./src/db/db.js")
const noteModel = require('./src/models/note.model.js')
connectToDB()

const app = express()
app.use(express.json())

// create
app.post('/notes', async (req, res) => {
    const { title, description } = req.body

    console.log(title, description)

    const note = await noteModel.create({
        title,
        description
    })

    res.json({
        message:"Note created successfully",
        note
    })
})

// read
app.get("/notes", async (req,res)=>{
    const notes = await noteModel.find()

    res.json({
        message:"Notes fetched successfully",
        notes
    })
})

// delete
app.delete("/notes/:id",async(req,res)=>{
    const {id} = req.params
    await noteModel.findByIdAndDelete(id)

    res.json({
        message:"Note deleted successfully"
    })
})

// update
app.patch("/notes/:id",async (req,res)=>{
    const {id} = req.params
    const {title,description} = req.body

    await noteModel.findByIdAndUpdate(id,{title,description})
    
    res.json({
        message:"Note updated successfully",
        updatedNote:{
            title,
            description
        }
    })
})



app.listen(3000, () => {
    console.log("Server is running on port", 3000)
})