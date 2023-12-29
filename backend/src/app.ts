import 'dotenv/config';
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import logger from "morgan";
import cors from 'cors';
import Session from 'express-session';
import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import JwtStrategy from 'passport-jwt';
import {Strategy as JwtStrategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from './models/userModel.ts';
// import passportLocalMongoose from 'passport-local-mongoose';

import indexRouter from './routes/index.ts';
import usersRouter from './routes/users.ts';

const app = express();

// Set up mongoose connection
import mongoose from 'mongoose';
mongoose.set("strictQuery", false);
const mongoDB = process.env.SECRET_KEY;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(Session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
  console.log(err)
});

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: process.env.JWT_KEY,
}

passport.use(
  new JwtStrategy(options, async (username, password, done) => {
    try {
      console.log('random')
      console.log(username, password)
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      console.log('some error')
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.listen(3000, "localhost", () => {
  console.log("listening")
})

// module.exports = app;
