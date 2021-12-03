import { model } from '../models/userModel';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { ExtractJwt, Strategy as JwtStategy } from 'passport-jwt';
import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';

// TODO: Add secret key generation
const jwtSecret = 'Add_secret_key_later';

// TODO: Add more commenting
passport.use(
    new BasicStrategy(async (username, password, done) => {
        const [user] = await model.getUserCredentials(username);

        // TODO: Remove password conversion before production
        if (!user.password.toString().startsWith('$argon2') || user.password.toString().search(/\$m=4096/u) !== -1) {
            console.log('Set new password');

            // user.password = await hash('default'); // Test 1
            user.password = await hash('default', { parallelism: 4, memoryCost: 2 ** 17, timeCost: 10 });
            model.modifyUser(user.user_id, { password: user.password });
            return done(null, user);
        }

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
export const getToken = (user) => sign({ userId: user.user_id }, jwtSecret, { expiresIn: 600 });
