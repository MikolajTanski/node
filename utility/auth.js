

import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";

import { usersController } from "../controllers/controllers.js";

passport.serializeUser( (user, done) => {
    // funkcja otrzymuje zautoryzowanego usera z authUser()
    // wywołujemy done i passport zapisze id usera do
    // req.session.passport.user
    // w ten sposób dane użytkownika zapisane są w sesji czyli np { id: 5, name: "user#001", surname: "Kowalski" }
    // To id będzie użyte przez deserializeUser() do pobrania pełnych danych użytkownika
    console.log("serializeUser(), user.id:", user.id);
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    // funkcja na podstawie przekazanego id pobiera pełne dane
    // użytkownika np z bazy i zwraca je do done(), dzięki temu
    // trafia on do req.user i może być użyty gdziekolwiek w apce
    try {
        const userDb = await usersController.getById(id)
        console.log("deserializeUser(), userDb:", userDb);
        done(null, userDb);
    } catch (err) {
        done(err);
    }
} );

// rejestracja usera na stronie
passport.use(
    "local-signup",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const userExists = await usersController.getUserByEmail(email);
            if (userExists) {
                // jest już w bazie user
                return done(null, false); // kończymy bo user o tym email istnieje w bazie
            }

            const userDb = await usersController.createUser({
                name: req.body.name,
                surname: req.body.surname,
                email: email,
                password: password,
                address: req.body.address,
                age: req.body.age,
                schoolId: req.body.schoolId
            });
            console.log(userDb);
            return done(null, userDb); // user jest zarejestrowany
        } catch (err) {
            done(err);
        }
    })
);




const authUser = async (req, email, password, done) => {
    // authuser to funkcja pozwalająca na autoryzację użytkownika, zwraca zautoryzowanego 
    // użytkownika np z bazy, authUser używana jest przez strategię do autoryzacji usera

    try {
        const authenticatedUser = await usersController.getUserByEmail(email);

        if (!authenticatedUser) {
            // nie ma usera w bazie z tym email
            return done(null, false);
        }

        if (!usersController.validPassword(password, authenticatedUser)) {
            // złe hasło
            return done(null, false);
        }

        return done(null, authenticatedUser); // zwracamy zalogowanego usera, prawidłowy email i poprawne hasło
    } catch (err) {
        return done(err);
    }
}

passport.use(
    "local-login",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    authUser)
);

export {
    passport
};
