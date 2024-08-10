const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerAdmin = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Admin.create({
            username,
            role,
            password: hashedPassword,
        });

        if (user) {
            const data = {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            };
            const authtoken = jwt.sign(data, process.env.JWT_SECRET);

            res.json({
                msg: "Registration successful",
                authtoken
            });
        }

    } catch (error) {
        console.error(error.message);
        res.status(400).send(error);
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Admin.findOne({ username });

        if (!user) return res.json({ msg: "Incorrect username", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.json({ msg: "Incorrect password", status: false });

        const data = {
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({
            msg: "Logged in successfully",
            authtoken
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
};


module.exports = {
    registerAdmin,
    loginAdmin,
};
