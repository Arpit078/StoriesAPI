const axios = require("axios")
const cheerio = require("cheerio")
require("dotenv").config();
const fs = require("fs")
const app = require("./app")
const {google} = require("googleapis")

const {MongoClient} = require("mongodb") 
// const uri = process.env.URI






const PORT = process.env.PORT || 5000 

// ----------part that crons at sending regular get requests so that render does not sleep!-----------//

const cron = require('node-cron');

const link_to_site = `https://stories-api.onrender.com/`


cron.schedule('0 */13 * * * *', () => {

axios.get(link_to_site, { 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
})
    .then((req,res) => {console.log(`ok`)})
    .catch((err)=>{
    // console.log(err)
    })

});




// --------------------------------------------------------------------------------------------------//
async function connect(){
  const client = new MongoClient(uri)
  const db = client.db("app-data")
  const col = db.collections("url")
  // collection.insertOne({"name":"arpit"})
  console.log("done")

}





let sendArr = []
async function scrape(link){
    await axios.get(link)
    .then((response)=>{
      const html = response.data
      const $ = cheerio.load(html)//$(".itemListElement")

      sendArr[0] = $("h3.post-title").text()
      sendArr[1] = $("div.post-body").text()
      // console.log(story_title,story_content)

  })
}


cron.schedule('0 0 * * *', async () => {
        //run task every day at 12 am
        const random_number = Math.floor(Math.random() * 96)
        fs.readFile("stories.json", async (err, data)=> {
          
          // Converting to JSON
          const story_url = JSON.parse(data);
          const link_today = story_url.premchand[random_number].url
        // if(link_today = link_yest){
        //     link_today = story_url.premchand[Math.floor(Math.random()*96)].url
        // }
    
        

        const date = new Date()
        
        
        const auth =new google.auth.GoogleAuth({
          keyFile : "cred.json",
          scopes: "https://www.googleapis.com/auth/spreadsheets"
        })
        const client = auth.getClient();
        
          const googlesheets = google.sheets({version:"v4",auth: client})
        
          const spreadsheetId = "1AeJoJQ2qEWy1y-3Fu2vP8917zOQb90nToplS6x5Z0Qk"
          
          const viewRows = googlesheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range:"data!A:C",
          })
          
          await scrape(link_today)
          console.log(sendArr[0],sendArr[1])

          const appendRows = googlesheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:"data!A:B",
            valueInputOption: "USER_ENTERED",
            resource:{
                values:[
                    [date,sendArr[0],sendArr[1]]
                ]
            }
          })
        })

        
       

});

// -----------------------------------------------------------------------------------------------------//




app.get("/",async (req,res)=>{
    const auth =new google.auth.GoogleAuth({
        keyFile : "cred.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
      })
      const client = await auth.getClient();
    
      const googlesheets = google.sheets({version:"v4",auth: client})
    
      const spreadsheetId = "1AeJoJQ2qEWy1y-3Fu2vP8917zOQb90nToplS6x5Z0Qk"
      
      const viewRows = await googlesheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"data!A:c",
      })
      const len = viewRows.data.values.length -1 
      const tareek = viewRows.data.values[len][0].slice(0,10)
      
     res.json({
        "date":tareek,
        "heading":viewRows.data.values[len][1],
        "content":viewRows.data.values[len][2]
       })    
             
    })
           
  app.get("/all", async (req,res)=>{
      const auth =new google.auth.GoogleAuth({
          keyFile : "cred.json",
          scopes: "https://www.googleapis.com/auth/spreadsheets"
        })
        const client = await auth.getClient();
      
        const googlesheets = google.sheets({version:"v4",auth: client})
      
        const spreadsheetId = "1AeJoJQ2qEWy1y-3Fu2vP8917zOQb90nToplS6x5Z0Qk"
        
        const viewRows = await googlesheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range:"data!A:c",
        })
        const len = viewRows.data.values.length -1 
        const tareek = viewRows.data.values[len][0].slice(0,10)
        let responseArr = []
        for(i=1;i<len+1;i++){
          responseArr.push({
            "date":tareek,
            "heading":viewRows.data.values[i][1],
            "content":viewRows.data.values[i][2]
           })
        }
       res.json(responseArr)    
               
             
  })
  






app.listen(PORT,(req,res)=>{
    console.log(`connected! at ${PORT}`)
})
