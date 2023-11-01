const path = require("path")
const linkUpService = require("./linkUpService")

const express = require("express")
const app = express()
const HTTP_PORT = 8080

app.set('view engine', 'ejs')

app.use(express.static("public"))

app.get("/", (req, res) => {
    // req.get("User-Agent")
    // res.sendFile(path.join(__dirname, "/views/profiles.html"))
    
    linkUpService.getAllProfiles().then((profiles) => {
        res.render('profiles', {
            profiles: profiles
        })
        // res.sendFile(path.join(__dirname, "/views/profiles.html"))
    }).catch((err) => {
        console.log(err)
    })
})

// app.get("/profiles", (req, res) => {
//     if (req.query.profileID) {
//         res.send("yup that's it")
//     }
//     linkUpService.getAllProfiles().then((profiles) => {
//         res.json(profiles)
//         // res.sendFile(path.join(__dirname, "/views/profiles.html"))
//     }).catch((err) => {
//         console.log(err)
//     })
//     // let profiles = await linkUpService.getAllProfiles()
// })


app.get("/positions", (req, res) => {
    linkUpService.getAllPositions().then((positions) => {
        res.render('positions', {
            positions: positions
        })
    }).catch((err) => {
        res.status(500).end()
    })
})


app.get("/positions/:id", (req, res) => {
    linkUpService.getPositionByID(req.params.id).then((position) => {
        res.render('positionCard', {
            position: position
        })
    }).catch((err) => {
        res.status(500).end()
    })
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
    // res.send(req.params.id)
    linkUpService.getProfileByID(req.params.id).then((profile) => {
        res.render('profiles', {
            profiles: [profile]
        })
    })
})

app.get('*', function(req, res){
    res.sendStatus(404)
})


app.listen(HTTP_PORT, () => {
    console.log("server listening on "+ HTTP_PORT)
})



