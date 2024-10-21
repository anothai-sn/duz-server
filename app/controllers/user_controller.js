const db = require('../models');
const User = db.user;
const Role = db.role;

exports.findAll = (req, res) => {
    try {
        User.findAll({
            attributes: ["id", "username", "password"],
            include: [{
                model: Role,
                attributes: ["role"]
            }]
        }).then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(400).json({message: err.meassage} || "Something wrong, Can't find animal type data..")});
    } catch(err) {
        console.log(err);
    };
};

exports.findOne = (req, res) => {
    try {
      User.findOne({
        where: { username: req.params.username },  // Search based on the username
        attributes: ["id", "username", "password"],  // Select specific attributes from the User model
        include: [{
          model: Role,  // Include the related Role model
          attributes: ["role"]  // Select the 'role' attribute from the Role model
        }]
      })
      .then((data) => {
        if (data) {
          res.status(200).json(data);  // Return the found data with a 200 status
        } else {
          res.status(404).json({ message: `User with username: ${req.params.username} not found.` });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: err.message || `Something went wrong while fetching user: ${req.params.username}.` });
      });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Internal Server Error.' });  // Handle any unexpected errors
    }
  };
  

exports.create = async (req, res) => {
    try {
        if (!req.body.username || !req.body.roleId) {
            return res.status(400).json({ message: "Data can't be empty!" });
        }

        const generateCredentials = () => {
            const randomDigits = Math.floor(10000 + Math.random() * 9000); // generates a 4-digit random number
            const randomDigitsUser = Math.floor(1000 + Math.random() * 9000); // generates a 4-digit random number
            const genUsername = `@${req.body.username}${randomDigitsUser}`;
            const genPassword = `duz${randomDigits}`;
            return { genUsername, genPassword };
        };

        let credentials;
        let isDuplicate = true;

        while (isDuplicate) {
            // Generate username and password
            credentials = generateCredentials();

            // Check if username or password already exists in the database
            const existingUser = await User.findOne({
                where: {
                        username: credentials.genUsername,
                        password: credentials.genPassword
                }
            });

            // If no user is found with the generated username or password, break the loop
            if (!existingUser) {
                isDuplicate = false;
            }
        }

        // Create user with unique username and password
        await User.create({
            username: credentials.genUsername,
            password: credentials.genPassword,
            roleId: req.body.roleId
        });

        res.status(200).json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message || "Something went wrong, couldn't create user" });
    }
};



exports.update = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Not found user!" });
        }

        // Function to generate a new password
        const generateCredentials = () => {
            const randomDigits = Math.floor(10000 + Math.random() * 9000); // generates a 4-digit random number
            const genPassword = `duz${randomDigits}`;
            return genPassword
        };

        // Find the user by ID to get the username
        const user = await User.findByPk(req.params.id, { attributes: ["username"] });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Generate new password
        const newPassword = await generateCredentials(user.username);

        // Update the user with the new password and roleId
        await User.update(
            {
                password: newPassword,
                roleId: req.body.roleId
            },
            {
                where: { username: req.params.username }
            }
        );

        res.status(200).json({ message: "User has been updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message || "Something went wrong, can't change user." });
    }
};

exports.delete = (req, res) => {
    try {
        User.destroy({
            where: { username:req.params.username }
        }).then(data => {
            if(data == 1) {
                res.status(200).json({message: "User deleted"});
            } else {
                res.status(500).json({message: "User failed"});
            }
        }).catch(err => {
            res.status(500).json({message: err.meassage});
        })
    } catch(err) {
        res.status(400).json({message: err.meassage});
    }
};

exports.createRole = (req, res) => {
    try {
        if(!req.body.role) {
            return res.status(400).json({Message: "Data can't empty!"});
        }

        Role.create({role: req.body.role}).then(
            res.status(200).json({message: "Role created"})
        ).catch(err => {
            res.status(500).json({message: err.meassage || "Something wrong, Can't create Role.."});
        }) 
    } catch(err) {
        res.status(400).json({message: err.meassage || "Error 400"});
    }
}

