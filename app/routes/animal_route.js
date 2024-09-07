
module.exports = (app) => {
    const animal = require('../controllers/animal_controller.js');
    const router = require('express').Router();

    router.get('/', animal.findAll);
    router.get('/:id', animal.findOne);
    router.post('/create', animal.create);
    router.put('/update/:id', animal.update);
    router.delete('/delete/:id', animal.delete);

    app.use('/animals', router);
};