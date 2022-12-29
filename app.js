
const express = require("express")
const app = express()
const cors = require("cors")


app.use(express.json())
app.use(cors({
    origin:"http://127.0.0.1:5500",
    // origin:"https://arpitverma.me",
    // origin:"http://localhost:5500"
  }))

module.exports = app