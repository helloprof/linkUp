const path = require("path")
const linkUpService = require("./linkUpService")

const express = require("express")
const app = express()
const HTTP_PORT = 8080


app.get("/", (req, res) => {
    // req.get("User-Agent")
    res.send("hello")
})

app.get("/profiles", (req, res) => {
    linkUpService.getAllProfiles().then((profiles) => {
        res.json(profiles)
    }).catch((err) => {
        console.log(err)
    })
    // let profiles = await linkUpService.getAllProfiles()
})


app.get("/profiles/position/:id", (req, res) => {
    linkUpService.getProfileByPositionID(req.params.id).then((profile) => {
        res.json(profile)
    }).catch((err) => {
        res.send(err)
    })
})

app.get("/profiles/:id", (req, res) => {
    // linkUpService.getPositionByID(req.params.id)
    res.send(req.params.id)
})

app.get('*', function(req, res){
    res.sendStatus(404)
})


app.listen(HTTP_PORT, () => {
    console.log("server listening on "+ HTTP_PORT)
})



