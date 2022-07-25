// Initialize Map
var map = L.map('map').setView([40.23131324112799, -101.67139118070386], 4);
map.addControl(new L.Control.Fullscreen());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


var truckIcon = L.icon({
    iconUrl: '../assets/truck.png',

    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -20] // point from which the popup should open relative to the iconAnchor
});


let devices = []
let markers = []

async function getDevices() {
    let response = await fetch(`/api/devices`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await response.json();
    for (let i=0; i<data.length; i++) {
            devices.push(data[i].device)
    }
    getTelemetry(devices)
}


async function getTelemetry(params) {
    while(markers.length > 0) {
        markers.pop();
    }

    let response = await fetch(`https://flespi.io/gw/devices/${params.join()}/telemetry/ble.sensor.temperature.1,position`, {
        method: 'GET',
        headers: {
            Authorization: 'FlespiToken e2SFPN6kTwArUxc4HjWilFsyiZUcSYYWOErrioCZK0gsogmTp9ZBCgXK5FKNszy4',
            Accept: 'application/json'
        }
    })
    let data = await response.json();

    for (let i=0; i<data.result.length; i++) {
        var marker = L.marker([data.result[i].telemetry.position.value.latitude, data.result[i].telemetry.position.value.longitude], {icon: truckIcon}).addTo(map)

        if(data.result[i].telemetry['ble.sensor.temperature.1']) {
            marker.bindPopup(`<b> Speed: ${data.result[i].telemetry.position.value.speed}</b></br><b> Device ID: ${data.result[i].id}</b></br><b> Temperature: ${(((data.result[i].telemetry['ble.sensor.temperature.1'].value) * 1.8) + 32).toFixed(1)} °F</b></br><b> Last Report: ${Date(data.result[i].telemetry.position.ts*1000).toLocaleString()}</b>`)
        } else {
            marker.bindPopup(`<b> Speed: ${data.result[i].telemetry.position.value.speed}</b></br><b> Device ID: ${data.result[i].id}</b></br><b> Last Report: ${Date(data.result[i].telemetry.position.ts*1000).toLocaleString()}</b>`)
        }
        markers.push(marker)
    }
}

getDevices()
setInterval(function() {
    getDevices()
}, 600000)

document.querySelector('#refreshButton').addEventListener('click', getDevices);