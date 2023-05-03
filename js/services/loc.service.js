import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'locationDB'

export const locService = {
    saveLocation,
    removeLocation,
    getLocs
}

_createLocations()

function getLocs() {
    return storageService.query(STORAGE_KEY)
        .then(locations => {
            console.log(locations)
            return locations
        })
}

function saveLocation(location) {
    if (location.id) {
        return storageService.put(STORAGE_KEY, location)
    } else {
        location = _createLocation(location.name, location.lat, location.lng)
        return storageService.post(STORAGE_KEY, location)
    }
}
// 

function removeLocation(locationId) {
    return storageService.remove(STORAGE_KEY, locationId)
}


// {id, name, lat, lng, weather, createdAt, updatedAt}

// private create location
function _createLocation(name, lat, lng) {
    const location = {}
    location.name = name
    location.lat = lat
    location.lng = lng
    location.createdAt = Date.now()
    location.updatedAt = Date.now()
    return location
}

function _createLocations() {
    let locations = utilService.loadFromStorage(STORAGE_KEY)
    if (!locations || !locations.length) {
        _createDemoLocs()
    }
}

function _createDemoLocs() {
    const locs = [
        { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
        { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]

    utilService.saveToStorage(STORAGE_KEY, locs)
}




