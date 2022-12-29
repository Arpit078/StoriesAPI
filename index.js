const axios = require("axios")
const cheerio = require("cheerio")
require("dotenv").config();
const fs = require("fs")
const app = require("./app")
const random_number = Math.floor(Math.random() * 96)
const PORT = process.env.PORT || 5000 

let link =""

fs.readFile("stories.json", function(err, data) {
      
    // Check for errors
    if (err) throw err;
   
    // Converting to JSON
    const story_url = JSON.parse(data);
    //   console.log(story_url.links[random_number])
     link = story_url.premchand[random_number].url// giving story url from a list of stories
    //  console.log(story)

    //less go with local variable here!

app.get("/",(req,res)=>{
    axios.get(link)
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)//$(".itemListElement")

        const story_title = $("h3.post-title").text()
        const story_content = $("div.post-body").text()
        // console.log(story_title,story_content)

        res.json({
            "heading":story_title,
            "content":story_content
           })    
        })
             
    })
           

}) 






app.listen(PORT,(req,res)=>{
    console.log(`connected! at ${PORT}`)
})