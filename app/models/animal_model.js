module.exports = (sequelize, Sequelize) => {
    const Animal = sequelize.define("animal", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        animalName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Animal;
};