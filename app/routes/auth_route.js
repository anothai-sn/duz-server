
module.exports = (app) => {
    const auth = require('../controllers/auth_controller');
    const router = require('express').Router();

    router.get('/login', auth.login);

    app.use('/auth', router);
};