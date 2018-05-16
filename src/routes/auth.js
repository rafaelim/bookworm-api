import express from 'express';
import User from '../models/user';

const router = express.Router();

router.post('/', (req,res) => {
    const { credentials } = req.body;
    User.findOne({ email: credentials.email })
        .then(user => {
            if(!user) {
                res.status(400).json({ errors: { global: "User doesn't exist" } });
                return;
            }
            if(!user.isValidPassword(credentials.password)) {
                res.status(400).json({ errors: { global: "Invalid credentials" } });
                return;
            }
            res.json({ user: user.toAuthJSON() });
        })
        .catch(err => {
            console.log(err);
        });
});

export default router;