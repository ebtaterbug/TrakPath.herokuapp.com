const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const { Tempalert } = require('./models');
const fetch = require('node-fetch');
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
// async function getDevice(device, maxtemp, mintemp, number, messaged, alertId) {
//     try {
//         const response = await fetch(`https://flespi.io/gw/devices/${device}/telemetry/ble.sensor.temperature.1`, {
//             method: 'GET',
//             headers: {
//                 Authorization: 'FlespiToken e2SFPN6kTwArUxc4HjWilFsyiZUcSYYWOErrioCZK0gsogmTp9ZBCgXK5FKNszy4',
//                 Accept: 'application/json'
//             }
//         })

//         let data = await response.json();
//         let deviceTemp = (data.result[0].telemetry['ble.sensor.temperature.1'].value*1.8)+32

//         if (messaged==='false' && (deviceTemp > maxtemp || deviceTemp < mintemp)) {
            
//             console.log(deviceTemp, 'Out of bounds', `Max Temp: ${maxtemp}  Min Temp: ${mintemp}  Messaged: ${messaged}`)
//             client.messages
//             .create({
//                 body: `Device ${device} has temperature outside threshold ${maxtemp}°F - ${mintemp}°F. Current temperature is ${deviceTemp}°F`,
//                 from: '+13253265027',
//                 to: `+1${number}`
//             })
//             .then(message => console.log(message.sid));

//             Tempalert.update({ messaged: true }, { where: { id: alertId } }) 
            

//         } 
        
//         else if (deviceTemp < maxtemp && deviceTemp > mintemp) {

//             console.log(deviceTemp, 'Within bounds', `Max Temp: ${maxtemp}  Min Temp: ${mintemp}  Messaged: ${messaged}`)
//             Tempalert.update({ messaged: false, }, { where: { id: alertId } })

//         } 
        
//         else {

//             console.log(deviceTemp, 'No Change', `Max Temp: ${maxtemp}  Min Temp: ${mintemp}  Messaged: ${messaged}`)
            
//         }

//     } catch (error) {
//         console.log(error)
//     }    
// }

// function alert() {
//     Tempalert.findAll({
//         attributes: [
//         'id', 
//         'device',
//         'number',
//         'maxtemp',
//         'mintemp',
//         'messaged'
//         ],
//         order: [['id', 'DESC']]
//     }).then(data => {
//         for (let i=0; i<data.length; i++) {
//             getDevice(JSON.stringify(data[i].device), JSON.stringify(data[i].maxtemp), JSON.stringify(data[i].mintemp), JSON.stringify(data[i].number), JSON.stringify(data[i].messaged), JSON.stringify(data[i].id))
//         }
        
//     })
// }

// setInterval(function() {
//     alert()
// }, 300000)