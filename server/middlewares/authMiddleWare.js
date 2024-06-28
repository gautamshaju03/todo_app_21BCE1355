const jwt = require('jsonwebtoken');
exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (token) {
        jwt.verify(
            token,
            "my_secret_key_but_it_is_not_secure",
            (error, decoded) => {
                if (error) {
                    return res.status(401).send({
                        isLoggedIn: false,
                        message: "Failed to authenticate"
                    })
                }
                req.user = {};
                req.user.id = decoded.id;
                req.user.username = decoded.username;
                next();
            })
    } else {
        res.status(401).send({ message: 'Not Logged in. Signup or Login to access this resource!' })
    }
}