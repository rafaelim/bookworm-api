import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import auth from './routes/auth';
import users from './routes/users';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';

dotenv.config();
const app = express();
app.use(bodyParse.json());
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL)
import bcrypt from 'bcrypt-nodejs';

app.use('/api/auth', auth);
app.use('/api/users', users);

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(8080, () => console.log("Running on localhost:8080"));