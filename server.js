const path = require("path")
const linkUpService = require("./modules/linkUpService")
const authService = require("./modules/authService")

const express = require("express")
const app = express()

const multer = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const HTTP_PORT = 8080

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.errMsg = null
    res.locals.successMsg = null
    next()
})

// const upload = multer();

// const storage = multer.diskStorage({
//     destination: 'public/images/',
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname));
//     },
//   });

const upload = multer();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});


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







app.get("/profiles/position/:id", (req, res) => {
    linkUpService.getProfileByPositionID(req.params.id).then((profile) => {
        // res.json(profile)
        res.render('profiles', {
            profiles: [profile]
        })
    }).catch((err) => {
        res.send(err)
    })
})

app.get('/positions/new', (req, res) => {
    res.render('addPositions')
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

app.get('/profiles/new', (req, res) => {
    linkUpService.getAllPositions().then((positions) => {
        res.render('addProfiles', {
            positions: positions
        })
    }).catch((err) => {
        res.send(err)
    })
})

app.post('/positions/new', (req, res) => {
    linkUpService.addPosition(req.body).then(() => {
        res.redirect("/positions")
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })
})

app.post('/profiles/new', upload.single('image'), function (req, res, next) {
    if (req.file) {
    // API from: https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result)
                } else {
                  reject(error)
                }
              }
            );

          streamifier.createReadStream(req.file.buffer).pipe(stream)
        })
    }

    async function upload(req) {
        let result = await streamUpload(req)
        console.log(result)
        return result
    }

    upload(req).then((uploaded) => {
        console.log(uploaded.url)
        // req.body.image = uploaded.url 
        processUpload(uploaded.url)
    })
    } else {
        processUpload("")
    }

    function processUpload(uploadURL) {
        req.body.image = uploadURL
        linkUpService.addProfile(req.body).then(() => {
            res.redirect("/")
        }).catch((err) => {
            console.log(err)
            res.send(err)
        })

    }

    
    // console.log(req.file)
    // res.send(req.body)
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

app.get("/register", (req,res) => {
    res.render("register")
})

app.post("/register", (req,res) => {
   authService.registerUser(req.body).then((success) => {
        res.render("register", {
        successMsg: success,
        })
    }).catch((err) => {
       res.render("register", {
           errMsg: err,
       })
   })
// res.send(req.body)
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    // authService.loginUser(req.body).then(() => {

    // })
    // res.send(req.body)
})

app.get('*', function(req, res){
    res.sendStatus(404)
})




linkUpService.initialize()
.then(authService.initialize)
.then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on "+ HTTP_PORT)
    })
}).catch((err) => {
    console.log(err)
})




