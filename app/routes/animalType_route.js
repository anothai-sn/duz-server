
module.exports = (app) => {
    const animalType = require('../controllers/animalType_controller.js');
    const router = require('express').Router();

    router.get('/', animalType.findAll);
    router.get('/:id', animalType.findOne);
    router.post('/create', animalType.create);
    router.put('/update/:id', animalType.update);
    router.delete('/delete/:id', animalType.delete);

    app.use('/animalTypes', router);
};