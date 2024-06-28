const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const newUser = req.body
        const takenUserEmail = await user.findOne({ email: newUser.email });
        const takenUsername = await user.findOne({ username: newUser.username });
        if (takenUserEmail || takenUsername) {
            return res.status(403).send({ message: 'Username or Email is already registered!' })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newUser.password, salt)

            const dbUser = new user({
                username: newUser.username.toLowerCase(),
                email: newUser.email.toLowerCase(),
                password: hashedPassword
            })
            dbUser.save()
            return res.status(201).send({ message: 'Successfully registered new user' })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ message: 'Error registering user!' })
    }
}


exports.loginUser = async (req, res) => {
    const userLoggingIn = req.body;
    const existingUser = await user.findOne({ username: userLoggingIn.username })
    if (!existingUser) {
        return res.status(401).send({ message: "Invalid username or password!" })
    }
    const isPasswordCorrect = await bcrypt.compare(userLoggingIn.password, existingUser.password);
    if (isPasswordCorrect) {
        const payload = {
            id: existingUser._id,
            username: existingUser.username
        }
        jwt.sign(
            payload,
            "secret_key_that_needs_to_be_changed",
            { expiresIn: 3 * 24 * 60 * 60 },
            (error, token) => {
                if (error) {
                    return res.status(400).send({ message: error.message })
                }
                return res.status(200).send({
                    message: "Success",
                    token: "Bearer " + token
                })
            }
        )
    } else {
        return res.status(401).send({ message: "Invalid username or password!" })
    }
}
