import { model } from '../models/userModel';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { ExtractJwt, Strategy as JwtStategy } from 'passport-jwt';
import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET_KEY;

/**
 * Used to log users using password and username.
 */
passport.use(
    new BasicStrategy(async (username, password, done) => {
        const [user] = await model.getUserCredentials(username);

        try {
            if (await verify(user.password.toString(), password)) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    })
);

/**
 * Used to log users using json web tokens.
 */
passport.use(
    new JwtStategy(
        {
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (jwtPayload, done) => {
            const [user] = await model.getUser(jwtPayload.userId);
            if (user) return done(null, user);
            return done(null, false);
        }
    )
);

export const authenticateJwt = passport.authenticate('jwt', { session: false });
export const authenticateBasic = passport.authenticate('basic', { session: false });

/**
 * Gets a hash for user password that can be stored to database.
 * @param {string} passowrd user password
 * @returns
 */
export const getPaswordHash = (passowrd) => hash(passowrd, { parallelism: 4, memoryCost: 2 ** 17, timeCost: 10 });

/**
 * Create and sing json web token.
 * @param {import('../@types/userModel').user | import('../@types/userModel').userCredentials} user user for witch to create the token
 * @returns
 */
export const getToken = (user) => sign({ userId: user.user_id }, jwtSecret, { expiresIn: 1800 });
