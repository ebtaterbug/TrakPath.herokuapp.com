function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (min < 10) {
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + '0' + min
    } else {
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min
    }
    return time;
}


async function getReports(e) {
    e.preventDefault()
    document.querySelector(".reports").innerHTML = ''

    const device = document.querySelector('#device').value.trim()
    const startDate = Date.parse(document.querySelector('.start-date').value.trim() + ' PST')
    const endDate = Date.parse(document.querySelector('.end-date').value.trim() + '  PST')

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
        return `
        <div class="px-2 my-2 w-100 d-flex justify-content-between border">
            <p class="m-0 small">${timeConverter(report.timestamp)} PST</p>
            <a class="m-0 small" target="_blank" href="https://www.google.com/maps/search/${report["position.latitude"] || ''},${report["position.longitude"] || ''}">${report["position.latitude"] || ''}, ${report["position.longitude"] || ''}</a>
            <p class="m-0 small">${(((report['ble.sensor.temperature.1']) * 1.8) + 32).toFixed(1)} °F</p>
        </div>
        `
    }).join("")
    document.querySelector(".reports").insertAdjacentHTML("afterbegin", html)
}

document.querySelector('.new-post-form').addEventListener('submit', getReports);