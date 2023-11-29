const profiles = require("./data/profiles.json")
const positions = require("./data/positions.json")
const schools = require("./data/schools.json")

const env = require("dotenv")
env.config()

const Sequelize = require('sequelize');
let sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
})

const Profile = sequelize.define('Profile', {
    profileID: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true, // automatically increment the value
    }, 
    name: Sequelize.STRING, 
    username: Sequelize.STRING, 
    bio: Sequelize.TEXT,
    province: Sequelize.TEXT,
    // position
    // skills: Sequelize.STRING,
    image: Sequelize.STRING

})
const Position = sequelize.define("Position", {
    positionID: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true, // automatically increment the value
    }, 
    name: Sequelize.STRING
})


Profile.belongsTo(Position, { foreignKey: 'positionID'})


const profilesUpdated = []

function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            console.log("POSTGRES DB SYNC'd")
            resolve()
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}


function getAllProfiles() {
    return new Promise((resolve, reject) => {
        // if (profiles.length < 1) {
        //     reject("no profiles found!")
        // } else {
        //     resolve(profiles)
        // }
        Profile.findAll().then((profiles) => {
            resolve(profiles)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getProfileByID(id) {

    return new Promise((resolve, reject) => {

        const returnedProfile = profiles.filter((profile) => profile.id == id);
        if (returnedProfile) {
            resolve(returnedProfile[0])
        } else {
            reject("profile not found!")
        }
    })
}

function getProfileByPositionID(id) {

    return new Promise((resolve, reject) => {
        Profile.findOne({
            where: {
                positionID: id,
              },
        }).then((profile) => {
            resolve(profile)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
        // const returnedProfile = profiles.filter((profile) => profile.position == id);
        // if (returnedProfile.length > 0) {
        //     resolve(returnedProfile[0])
        // } else {
        //     reject("profile not found")
        // }
    })
}

function getPositionByID(id) {
    return new Promise((resolve, reject) => {

        const returnedPosition = positions.filter((position) => position.id == id);
        console.log("errors")
        console.log(returnedPosition)
        if (returnedPosition < 1) {
            reject("position not found!")
        } else {
            resolve(returnedPosition[0])
        }
    })
}

function getAllPositions() {
    return new Promise((resolve, reject) => {
        Position.findAll().then((positions) => {
            if (positions.length > 0) {
                resolve(positions)
            } else {
                reject("No positions found!")
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

function addPosition(formData) {
    return new Promise((resolve, reject) => {
        Position.create(formData).then((data) => {
            resolve()
        }).catch((err) => {
            reject(err)
        })
    })
}

function addProfile(formData) {
    return new Promise((resolve, reject) => {
        Profile.create(formData).then((data) => {
            resolve()
        }).catch((err) => {
            reject(err)
        })
    })
}
// getPositionsByID(1).then((data) => console.log(data))

module.exports = {
    initialize,
    getAllProfiles,
    getProfileByID,
    getPositionByID,
    getProfileByPositionID,
    getAllPositions,
    addPosition,
    addProfile
}
