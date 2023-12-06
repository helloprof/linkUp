const mongoose = require('mongoose');

let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
})

let User; // to be defined on new connection (see initialize)


function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.MONGO_URI)
        db.on('error', (err) => {
            reject(err) // reject the promise with the provided error
        })
        db.once('open', () => {
            User = db.model("users", userSchema)
            console.log("Users Schema Mongo Ready")
            resolve()
        })
    })
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Your passwords do not match!")
        }

        bcrypt
            .hash(userData.password, 10)
            .then((hash) => {
                userData.password = hash
                let newUser = new User(userData)
                newUser.save().then(() => {
                    resolve("User registered!")
                }).catch((err) => {
                    if (err.code == 11000) {
                        reject("Username already taken!")
                    } else {
                        reject("There was an error creating user: " + err)
                    }
                })
            }).catch((err) => {
                reject("Password error!")
            })
            .catch((err) => {
                console.log(err); // Show any errors that occurred during the process
            });
    })
}

function loginUser(userData) {
    console.log("hello")
}

module.exports = {
    initialize,
    // loginUser,
    registerUser
}