const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ });
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

const PORT = process.env.PORT || 3001;

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});




// Twilio Alerts
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const { Tempalert } = require('./models');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



async function getDevice(device, maxtemp, mintemp, number) {
    const response = await fetch(`https://flespi.io/gw/devices/${device}/telemetry/ble.sensor.temperature.1`, {
        method: 'GET',
        headers: {
            Authorization: 'FlespiToken e2SFPN6kTwArUxc4HjWilFsyiZUcSYYWOErrioCZK0gsogmTp9ZBCgXK5FKNszy4',
            Accept: 'application/json'
        }
    }).catch(err => { console.log(err) })

    let data = await response.json();
    let deviceTemp = data.result[0].telemetry['ble.sensor.temperature.1'].value
    
    if ((deviceTemp*1.8)+32 > maxtemp || (deviceTemp*1.8)+32 < mintemp) {
        console.log((deviceTemp*1.8)+32, 'Out of bounds', `Max Temp: ${maxtemp}  Min Temp: ${mintemp}`)
        client.messages
        .create({
            body: `Device ${device} has temperature outside threshold ${maxtemp}°F - ${mintemp}°F. Current temperature is ${((deviceTemp*1.8)+32).toFixed(1)}°F`,
            from: '+13253265027',
            to: `+1${number}`
        })
        .then(message => console.log(message.sid));
    } else {
        console.log((deviceTemp*1.8)+32, 'Within bounds', `Max Temp: ${maxtemp}  Min Temp: ${mintemp}`)
    }

    
}

function alert() {
    Tempalert.findAll({
        attributes: [
        'id', 
        'device',
        'number',
        'maxtemp',
        'mintemp'
        ],
        order: [['id', 'DESC']]
    }).then(data => {
        for (let i=0; i<data.length; i++) {
            getDevice(JSON.stringify(data[i].device), JSON.stringify(data[i].maxtemp), JSON.stringify(data[i].mintemp), JSON.stringify(data[i].number))
        }
        
    })
}

alert()
setInterval(function() {
    alert()
}, 300000)