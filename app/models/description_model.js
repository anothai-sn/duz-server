module.exports = (sequelize, Sequelize) => {
    const Description = sequelize.define("description", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        behavior: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hobitat: {
            type: Sequelize.STRING,
            allowNull: false
        },
        breeding: {
            type: Sequelize.STRING,
            allowNull: false
        },
        conservation: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Description;
};