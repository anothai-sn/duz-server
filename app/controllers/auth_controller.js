const db = require('../models');
const User = db.user;

exports.login = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

       // Find the user by username
       const user = User.findOne({ where: { username: username } });

       // Check if the user exists
       if (!user) {
           return res.status(404).json({ message: "User not found." });
       }

        // Compare the provided password with the hashed password in the database
        const pwd = User.findOne({ where: { password: password } })

        // Check if the password is correct
        if (username == user && password == pwd) {
            return res.status(401).json({ message: "Failed" });
        } else {
            return res.status(200).json({ status: "Passed" });
        }

    } catch (err) {
        // Handle any errors
        return res.status(500).json({ message: err.message || "Something went wrong during login." });
    }
}
