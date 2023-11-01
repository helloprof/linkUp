const profiles = require("./data/profiles.json")
const positions = require("./data/positions.json")
const schools = require("./data/schools.json")

const profilesUpdated = []

function getAllProfiles() {
    return new Promise((resolve, reject) => {
        if (profiles.length < 1) {
            reject("no profiles found!")
        } else {
            resolve(profiles)
        }
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

        const returnedProfile = profiles.filter((profile) => profile.position == id);
        if (returnedProfile.length > 0) {
            resolve(returnedProfile[0])
        } else {
            reject("profile not found")
        }
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
        if (positions.length < 1) {
            reject("no profiles found!")
        } else {
            resolve(positions)
        }
    })
}
// getPositionsByID(1).then((data) => console.log(data))

module.exports = {
    getAllProfiles, 
    getProfileByID,
    getPositionByID,
    getProfileByPositionID,
    getAllPositions
}
