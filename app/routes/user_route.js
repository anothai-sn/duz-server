
module.exports = (app) => {
    const user = require('../controllers/user_controller');
    const router = require('express').Router();

    router.get('/', user.findAll);
    router.get('/:username', user.findOne);
    router.post('/create', user.create);
    router.put('/update/:username', user.update);
    router.delete('/delete/:username', user.delete);

    router.post('/createRole', user.createRole);

    app.use('/users', router);
};