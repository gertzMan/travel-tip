import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'locationDB'
const WEATHER_API_KEY = 'db01c6bc7f06c52f0fd3962192fd547a'
const MAP_API_KEY = 'AIzaSyCOBwLSYGfXaWo-1PFFb4Pz4Qh3-glhrHA'

export const locService = {
  saveLocation,
  removeLocation,
  getLocs,
  getWeather,
  getLocationCoords,
  getLocationData,
}

_createLocations()

function getLocs() {
  return storageService.query(STORAGE_KEY).then((locations) => {
    console.log(locations)
    return locations
  })
}

function saveLocation(location) {
  if (location.id) {
    return storageService.put(STORAGE_KEY, location)
  } else {
    location = _createLocation(
      location.name,
      location.lat,
      location.lng,
      location.weather
    )
    return storageService.post(STORAGE_KEY, location)
  }
}
//

function removeLocation(locationId) {
  return storageService.remove(STORAGE_KEY, locationId)
}

// {id, name, lat, lng, weather, createdAt, updatedAt}

// private create location
function _createLocation(name, lat, lng, weather) {
  const location = {}
  location.name = name
  location.lat = lat
  location.lng = lng
  location.createdAt = Date.now()
  location.updatedAt = Date.now()
  location.weather = weather
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
    {
      name: 'Greatplace',
      lat: 32.047104,
      lng: 34.832384,
      id: utilService.makeId(),
    },
    {
      name: 'Neveragain',
      lat: 32.047201,
      lng: 34.832581,
      id: utilService.makeId(),
    },
  ]

  utilService.saveToStorage(STORAGE_KEY, locs)
}

function getWeather(lat, lng) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`
  return axios.get(url).then((res) => console.log('res.data', res.data))
}

function getLocationCoords(locationString) {
  const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${MAP_API_KEY}`

  return axios
    .get(geocodingApiUrl)
    .then((response) => {
      if (response.data.results.length === 0) {
        throw new Error('Invalid location')
      }

      const { lat, lng } = response.data.results[0].geometry.location
      return { lat, lng }
    })
    .catch((error) => {
      console.error(error)
    })
}

function getLocationData(locationString) {
  const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${MAP_API_KEY}`

  return axios.get(geocodingApiUrl).then((response) => {
    if (response.data.results.length === 0) {
      throw new Error('Invalid location')
    }

    const { lat, lng } = response.data.results[0].geometry.location
    const name = response.data.results[0].formatted_address

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
    return axios.get(weatherApiUrl).then((response) => {
      const { main, description, icon } = response.data.weather[0]
      const temperature = response.data.main.temp
      const createdAt = new Date().toISOString()

      const weatherData = {
        name,
        lat,
        lng,
        weather: {
          main,
          description,
          temperature,
          icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        },
        createdAt,
      }
      return weatherData
    })
  })
}
