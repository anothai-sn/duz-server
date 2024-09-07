const config = require('../config/db_config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.animal = require('../models/animal_model.js')(sequelize, Sequelize);
db.animalType = require('../models/animalType_model.js')(sequelize, Sequelize);
db.description = require('../models/description_model.js')(sequelize, Sequelize);

// one to many : animal type
db.animalType.hasMany(db.animal, {
    onDelete: 'CASCADE'
});
db.animal.belongsTo(db.animalType);

// one to many : Description
db.animal.hasMany(db.description, {
    onDelete: 'CASCADE'
});
db.description.belongsTo(db.animal);

module.exports = db;