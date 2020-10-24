const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./db/queries')
const model = require("./models/models")
const request = require('request').defaults({
  headers: {'User-Agent': '5CAgent'}
});
const port = 9000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.post('/github', (req, res) => {
  let json = req.body;
  request.get(json.url, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      for (const github_repo of JSON.parse(body)) {
        let githubInfo = model.GithubInfo.fromJson(github_repo)
        await db.insertIntoDatabase(githubInfo)
      }
      res.send(JSON.stringify({"code": "success"}))
    }
  })
})
app.get('/github/:id',async(req,res)=>{

   const { id }  = req.params
    console.log(id);
   res.send(await db.selectFromDatabase(id));
    
  
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
