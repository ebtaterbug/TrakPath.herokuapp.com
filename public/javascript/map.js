// Initialize Map
var map = L.map('map').setView([40.23131324112799, -101.67139118070386], 4);
map.addControl(new L.Control.Fullscreen());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var icon = L.icon({
    iconUrl: '../assets/arrow.png',

    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -20] // point from which the popup should open relative to the iconAnchor
});


let devices = []


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();

    
    var time = date + ' ' + month + ' ' + year + ' ' + `${(hour<=12) ? hour : hour-12}` + ':' + `${(min<10) ? '0' : ''}` + min + `${(hour<12) ? ' AM' : ' PM'}`

    return time;
}

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

var markers = []

async function getTelemetry(params) {

    let response = await fetch(`https://flespi.io/gw/devices/${params.join()}/telemetry/ble.sensor.temperature.1,position,solar.panel.charging.status,battery.level,ble.sensor.humidity.1,engine.ignition.status`, {
        method: 'GET',
        headers: {
            Authorization: 'FlespiToken e2SFPN6kTwArUxc4HjWilFsyiZUcSYYWOErrioCZK0gsogmTp9ZBCgXK5FKNszy4',
            Accept: 'application/json'
        }
    })
    let data = await response.json();

    if (markers.length) {
        for (let i=0; i<data.result.length; i++) { 
            markers[i].unbindPopup()
            markers[i].setLatLng([data.result[i].telemetry.position.value.latitude, data.result[i].telemetry.position.value.longitude], {icon: icon})
            let speed = Math.round((data.result[i].telemetry.position.value.speed)/1.609)

            if(data.result[i].telemetry['ble.sensor.temperature.1']) {
                markers[i].bindPopup(`

                <b> ${(speed==0)?'Stopped':'Moving'} on ${timeConverter(data.result[i].telemetry.position.ts)}</b></br>
                <b> Speed: ${speed} Mph</b></br>
                <b> Device ID: ${data.result[i].id}</b></br><b> Temperature: ${(((data.result[i].telemetry['ble.sensor.temperature.1'].value) * 1.8) + 32).toFixed(1)} °F - ${timeConverter(data.result[i].telemetry['ble.sensor.temperature.1'].ts)}</b></br>
                <b> Solar Charging: ${data.result[i].telemetry['solar.panel.charging.status'].value}</b></br><b>Battery: ${data.result[i].telemetry['battery.level'].value}%</b></br><b>Humidity: ${data.result[i].telemetry['ble.sensor.humidity.1'].value}%</b></br>            
                
                `)
            } else {
                markers[i].bindPopup(`
                
                <b> ${(speed==0)?'Stopped':'Moving'} on ${timeConverter(data.result[i].telemetry.position.ts)}</b></br>
                <b> Speed: ${Math.round((data.result[i].telemetry.position.value.speed)/1.609)} Mph</b></br>
                <b> Device ID: ${data.result[i].id}</b></br>
                <b> Ignition: ${(data.result[i].telemetry['engine.ignition.status'].value)?'On':'Off'}</b>
                `)
            }

        }
    } else {
        for (let i=0; i<data.result.length; i++) {
            var marker = L.marker([data.result[i].telemetry.position.value.latitude, data.result[i].telemetry.position.value.longitude], {icon: icon}, {rotationAngle: data.result[i].telemetry.position.value.direction}).addTo(map)
            markers.push(marker)
            let speed = Math.round((data.result[i].telemetry.position.value.speed)/1.609)

            if(data.result[i].telemetry['engine.ignition.status'].value) {
                marker.bindPopup(`

                <b>${(speed==0)?'Stopped':'Moving'} on ${timeConverter(data.result[i].telemetry.position.ts)}</b></br>
                <b> Speed: ${Math.round((data.result[i].telemetry.position.value.speed)/1.609)} Mph</b></br>
                <b> Device ID: ${data.result[i].id}</b></br><b> Temperature: ${(((data.result[i].telemetry['ble.sensor.temperature.1'].value) * 1.8) + 32).toFixed(1)} °F - ${timeConverter(data.result[i].telemetry['ble.sensor.temperature.1'].ts)}</b></br>
                <b> Solar Charging: ${data.result[i].telemetry['solar.panel.charging.status'].value}</b></br><b>Battery: ${data.result[i].telemetry['battery.level'].value}%</b></br><b>Humidity: ${data.result[i].telemetry['ble.sensor.humidity.1'].value}%</b></br>            
                
                `)
            } else {
                marker.bindPopup(`
                
                <b> ${(speed==0)?'Stopped':'Moving'} on ${timeConverter(data.result[i].telemetry.position.ts)}</b></br>
                <b> Speed: ${Math.round((data.result[i].telemetry.position.value.speed)/1.609)} Mph</b></br>
                <b> Device ID: ${data.result[i].id}</b></br>
                <b> Ignition: ${(data.result[i].telemetry['engine.ignition.status'].value)?'On':'Off'}</b>
                `)
            }
        }
    }

}

getDevices()
setInterval(function() {
    getTelemetry(devices)
}, 30000)