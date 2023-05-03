import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.getWeather = locService.getWeather
window.onSearchLoc = onSearchLoc

function onInit() {
  mapService
    .initMap()
    .then((map) => {
      console.log('Map is ready')
      map.addListener('click', (ev) => {
        const name = prompt('Place name?', 'Place 1')
        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        locService.saveLocation({ name, lat, lng }).then(() => {
          if (!isTableHidden()) {
            onGetLocs()
          }
        })
      })
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService
    .getLocs()
    .then((locs) => {
      console.log('Locations:', locs)
      showTable()
      renderLocs(locs)
      return locs
    })
    .then((locs) => {
      locs.forEach((loc) =>
        mapService.addMarker({ lat: loc.lat, lng: loc.lng })
      )
    })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      onPanTo(pos.coords.latitude, pos.coords.longitude)
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo(lat, lng) {
  console.log('Panning the Map')
  mapService.panTo(lat, lng)
}

function onRemoveLoc(id) {
  locService
    .removeLocation(id)
    //   locService.getLocs().then((locs) => renderLocs(locs))
    .then(() => onGetLocs())
}

function onSearchLoc() {
  let txt = document.querySelector('#search-text').value
  // let coord = locService
  //   .getLocationCoords(txt)
  //   .then((res) => getWeather(res.lat,res.lng)).then(res=>)
  locService
    .getLocationData(txt)
    .then((location) => locService.saveLocation(location))
}

//TODO: complete
function onPanSearch() {}

//rendering

function renderLocs(locs) {
  console.log('locs', locs)
  let strHTML = locs
    .map(
      (loc) =>
        `<tr>
		  <td>${loc.name}</td>
		  <td>${loc.lat}</td>
		  <td>${loc.lng}</td>
		  <td> <button class='update-btn' onclick="onPanTo(${loc.lat},
        ${loc.lng})">Go</button></td>
		  <td> <button class='delete-btn' onclick="onRemoveLoc('${loc.id}')">Delete</button></td>
		  </tr>    `
    )
    .join('')
  document.querySelector('.locs').innerHTML = strHTML
}

function showTable() {
  document.querySelector('.table-container').classList.remove('hidden')
}

function isTableHidden() {
  return document.querySelector('.table-container').classList.contains('hidden')
}
