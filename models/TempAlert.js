const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tempalert extends Model {};

Tempalert.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        device: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        maxtemp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mintemp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        messaged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },    
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'tempalert'
    }
);

module.exports = Tempalert;