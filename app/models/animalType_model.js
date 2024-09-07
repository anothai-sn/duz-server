module.exports = (sequelize, Sequelize) => {
    const AnimalType = sequelize.define("animalType", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return AnimalType;
};