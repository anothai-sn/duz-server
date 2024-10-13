const { authJwt } = require("../middlewere/index");
const controller = require("../controllers/user_controller");

module.exports = (app) => {
    app.get("/login/home", controller.home);
    app.get("/login/user", [authJwt.verifyToken], controller.user);
    app.get("/login/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.admin);
}