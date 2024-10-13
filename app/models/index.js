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
db.user = require("./user_model")(sequelize, Sequelize);
db.role = require("./role_model")(sequelize, Sequelize);

// one to many : user & role
db.role.hasMany(db.user, {
    onDelete: 'CASCADE'
});
db.user.belongsTo(db.role);

// one to many : animal & type
db.animalType.hasMany(db.animal, {
    onDelete: 'CASCADE'
});
db.animal.belongsTo(db.animalType);

module.exports = db;