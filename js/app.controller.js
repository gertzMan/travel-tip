import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

function onInit() {
	mapService
		.initMap()
		.then((map) => {
			console.log('Map is ready')
			map.addListener('click', ev => {
				const name = prompt('Place name?', 'Place 1')
				const lat = ev.latLng.lat()
				const lng = ev.latLng.lng()
				locService.saveLocation({ name, lat, lng })
				// renderPlaces()
				// renderMarkers()
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

// render Locations -> add .then(renderMarker(loc))
function onGetLocs() {
	locService.getLocs().then((locs) => {
		console.log('Locations:', locs)
		document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
		return locs
	})
		.then(locs => {
			locs.forEach(loc =>
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
		})
		.catch((err) => {
			console.log('err!!!', err)
		})
}
function onPanTo() {
	console.log('Panning the Map')
	mapService.panTo(35.6895, 139.6917)
}


