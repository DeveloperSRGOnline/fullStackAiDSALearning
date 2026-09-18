require('dotenv').config()
import app from "./src/app"
import connectToDB from "./src/db/db"
connectToDB()


app.listen(3000,()=>{
    console.log("Server running on port 3000")
})