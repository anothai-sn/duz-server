const db = require('../models');
const User = db.user;

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Find the user by username
        const data = await User.findOne({ where: { username: username }});

        // Check if the user exists
        if (!data.username) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare the provided password with the hashed password in the database

        // Check if the password is correct
        if (username == data.username && password == data.password) {
            return res.status(200).json({ status: "Pass" });
        } else {
            return res.status(401).json({ status: "Fail" });
        }

    } catch (err) {
        // Handle any errors
        return res.status(500).json({ message: err.message || "Something went wrong during login." });
    }
};

