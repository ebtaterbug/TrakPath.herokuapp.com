const User = require('./User');
const Device = require('./Device');

// create associations

User.hasMany(Device, {
    foreignKey: 'user_id'
});

Device.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

  
module.exports = { User, Device };