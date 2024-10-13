
module.exports = (app) => {
    const user = require('../controllers/user_controller');
    const router = require('express').Router();

    router.get('/', user.findAll);
    router.get('/:id', user.findOne);
    router.post('/create', user.create);
    router.put('/update/:id', user.update);
    router.delete('/delete/:id', user.delete);

    router.post('/createRole', user.createRole);

    app.use('/users', router);
};