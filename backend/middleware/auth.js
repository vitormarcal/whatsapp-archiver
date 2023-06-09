const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({message: "Auth Error"});
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(401).send({message: "Invalid Token"});
    }
};