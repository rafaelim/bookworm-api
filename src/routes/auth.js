import express from 'express';
import User from '../models/user';
import { sendResetPasswordEmail } from '../mailer';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({ email: credentials.email })
        .then(user => {
            if (!user) {
                res.status(400).json({ errors: { global: "User doesn't exist" } });
                return;
            }
            if (!user.isValidPassword(credentials.password)) {
                res.status(400).json({ errors: { global: "Invalid credentials" } });
                return;
            }
            res.json({ user: user.toAuthJSON() });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/confirmation', (req, res) => {
    const token = req.body.token;

    User.findOneAndUpdate(
        { confirmationToken: token },
        { confirmationToken: "", confirmed: true },
        { new: true }
    ).then((user) =>
        user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({}))

})

router.post('/reset_password_request', (req, res) => {
    const email = req.body.email;

    User.findOne(
        { email: email }
    ).then((user) => {
        if (!user) {
            res.status(400).json({ errors: { global: "There is no user with such email" } });
            return;
        }
        sendResetPasswordEmail(user);
        res.json({});
    });
})

router.post("/validate_token", (req,res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, err => {
        if(err) {
            res.status(401).json({});
        }
        res.json({});
    })
})

router.post("/reset_password", (req,res) => {
    const { password, token } = req.body.data;
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if(err) {
            res.status(401).json({ errors: { global: "Invalid token"}});
            return;
        }
        User.findOne({ _id: decode._id })
            .then(user => {
                if(!user) {
                    res.status(400).json({ errors: { global: "Invalid token"} });
                    return;
                } 
                user.setPassword(password);
                user.save().then(() => res.json({}));
            })
    })
})

export default router;