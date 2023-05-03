import { utilService } from "./util.service"

const STORAGE_KEY = 'locationDB'

export const storageService = {
    post,   // Create
    get,    // Read
    put,    // Update
    remove, // Delete
    query,  // List 
}


function query() {
    // return locations
}

function remove(locationId) {
    // remove from local storage
    return query().then(locations => {
        const idx = locations.findIndex(location => location.id === locationId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${locationId} in: locations`)
        locations.splice(idx, 1)
        _save(locations)
    })
}

function post() {
    //
}

function get() {

}

function put() {

}



// Private functions
function _save(locations) {
    utilService.saveToStorage(STORAGE_KEY, locations)
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}