const controller = require("../controllers/auth_controller");

module.exports = (app) => {
    app.post(
        "/login/auth/genkey", controller.genkey
    );

    app.post(
        "/login/auth/signin", controller.signin
    );
};