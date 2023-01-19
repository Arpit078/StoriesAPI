
const express = require("express")
const app = express()
const cors = require("cors")


app.use(express.json())
app.use(cors({
    // origin:"http://localhost:19006",
    origin:"https://arpitverma.me",
    // origin:"http://localhost:5500"
  }))

module.exports = app