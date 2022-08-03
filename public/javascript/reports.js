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

async function getReports(e) {
    e.preventDefault()
    document.querySelector(".reports").innerHTML = ''

    const device = document.querySelector('#device').value.trim()
    let startDate = Date.parse(document.querySelector('.start-date').value.trim())
    let endDate = Date.parse(document.querySelector('.end-date').value.trim())

     startDate = startDate+25200000
     endDate = endDate+25200000

    let response = await fetch(`https://flespi.io/gw/devices/${device}/messages?data=%7B%22from%22%3A${startDate.toString().substr(0, startDate.toString().length - 3)}%2C%22to%22%3A${endDate.toString().substr(0, endDate.toString().length - 3)}%7D`, {
      method: 'GET',
      headers: {
          Authorization: 'FlespiToken e2SFPN6kTwArUxc4HjWilFsyiZUcSYYWOErrioCZK0gsogmTp9ZBCgXK5FKNszy4',
          Accept: 'application/json'
      }
  })

  let data = await response.json()

  const html = data.result
    .map(report => {
        if (report["position.latitude"] || report['ble.sensor.temperature.1']) {
            return `
            <div class="px-2 my-2 w-100 d-flex justify-content-between border report">
                <p class="m-0 small">${timeConverter(report.timestamp)}</p>
                <a class="m-0 small" target="_blank" href="https://www.google.com/maps/search/${report["position.latitude"] || ''},${report["position.longitude"] || ''}">${report["position.latitude"] || ''}, ${report["position.longitude"] || ''}</a>
                <p class="m-0 small">${Math.round((report['position.speed'])/1.609)} Mph</p>
                <p class="m-0 small">${(report['engine.ignition.status'])?'Ignition On':'Ignition Off'}</p>
            </div>
            `
        }
    }).join("")

    document.querySelector(".reports").insertAdjacentHTML("afterbegin", html)
}

document.querySelector('.new-post-form').addEventListener('submit', getReports);