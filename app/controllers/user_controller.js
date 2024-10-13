exports.home = (req, res) => {
    res.status(200).json({ content: "Home"});
};

exports.user = (req, res) => {
    res.status(200).json({ content: "User" });
};

exports.admin = (req, res) => {
    res.status(200).json({ content: "Admin"});
};