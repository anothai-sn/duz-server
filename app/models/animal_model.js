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
        behavior: {
            type: Sequelize.STRING,
            allowNull: false
        },
        habitat: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reproduction: {
            type: Sequelize.STRING,
            allowNull: false
        },
        diet : {
            type: Sequelize.STRING,
            allowNull: false
        },
        conservation: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.BLOB,
            allowNull: false
        },
        imageName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Animal;
};