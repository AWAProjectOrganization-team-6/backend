import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import user from './routes/user';
import login from './routes/login';
import restaurant from './routes/restaurant';
import product from './routes/product';
import passport from 'passport';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(passport.initialize());

app.use('/login', login);
app.use('/user', user);
app.use('/restaurant', restaurant);
app.use('/product', product);

module.exports = app;
