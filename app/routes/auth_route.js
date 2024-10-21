
module.exports = (app) => {
    const auth = require('../controllers/auth_controller');
    const router = require('express').Router();

    router.post('/login', auth.login);

    app.use('/auth', router);
};