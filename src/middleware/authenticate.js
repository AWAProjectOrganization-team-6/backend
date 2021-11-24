import { model } from '../models/userModel';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { ExtractJwt, Strategy as JwtStategy } from 'passport-jwt';
import { hash, verify } from 'argon2';

passport.use(
    new BasicStrategy(async (username, password, done) => {
        const [user] = await model.getUserCredentials(username);

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
            secretOrKey: 'Secret_key',
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
 * Gets a hash for user password that can be stored to database
 * @param {string} passowrd user password
 * @returns
 */
export const getPaswordHash = (passowrd) => hash(passowrd, { parallelism: 4, memoryCost: 2 ** 17, timeCost: 10 });
