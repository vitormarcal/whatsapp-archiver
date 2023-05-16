const express = require('express');
const {User} = require("../models");
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // Extract email and password from the req.body object
        const {email, password} = req.body;

        // Check if the email is already in use
        let userExists = await User.findOne({where: {email}});

        if (userExists) {
            res.status(401).json({message: "Email is already in use."});
            return;
        }

        // Define salt rounds
        const saltRounds = 10;

        // Hash password
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) throw new Error("Internal Server Error");

            // Create a new user
            let user = new User({
                email, password: hash,
            });

            // Save user to database
            user.save().then(() => {
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                jwt.sign(payload, "randomString", {
                    expiresIn: 10000
                }, (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                });
            });
        });
    } catch (err) {
        return res.status(401).send(err.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        // Extract email and password from the req.body object
        const {email, password} = req.body;

        // Check if user exists in database
        let user = await User.findOne({where: {email}});

        if (!user) {
            return res.status(401).json({message: "Invalid Credentials"});
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {


                const payload = {
                    user: {
                        id: user.id
                    }
                };
                jwt.sign(payload, "randomString", {
                    expiresIn: 10000
                }, (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                });

            } else {
                console.log(err);
                return res.status(401).json({message: "Invalid Credentials"});
            }

        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

module.exports = router;