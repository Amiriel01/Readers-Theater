import passport from "passport";

export default function (req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            // Forward any passport-related errors to the error handler
            return next(err);
        }

        if (!user) {
            // If there is no user, return an error
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // If there is a user, proceed to the next middleware
        console.log('passport check');
        req.user = user;
        return next();
    })(req, res, next);
}