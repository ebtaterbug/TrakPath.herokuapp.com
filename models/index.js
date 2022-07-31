const User = require('./User');
const Device = require('./Device');
const Tempalert = require('./TempAlert');

// create associations

User.hasMany(Device, {
    foreignKey: 'user_id'
});

User.hasMany(Tempalert, {
    foreignKey: 'user_id'
});

Device.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Tempalert.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});
  
module.exports = { User, Device, Tempalert};