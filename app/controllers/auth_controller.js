const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.genkey = (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    res.status(200).json({ password: hash });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid password!"
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret,
            {
                algorithm: 'HS256',
                expiresIn: 86400 // 24 hours
            }
        );

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0;i < roles.length; i++){
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).json({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });
};