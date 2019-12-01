var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');


// HOME PAGE
router.get('/', (req, res) => {
    res.render("landing");
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect:'/'
}),(req, res) => {});

// Formulaire d'enregistrement (auth/register.ejs(get))
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Post du client sur le formulaire d'enregistrement  (auth/register.ejs(POST))
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.render("auth/register");
        }
        passport.authenticate("local")(req, res, () => {
        req.flash("success", "Bienvenue, " + user.username +" le profil a été créé avec success !! ");
        res.redirect("/campgrounds"); 
        });
    });
});

// login Route, voir le formulaire de connexion (auth/login.ejs(get))
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Post de la connection client (auth/login(POST))
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect:'/login'
}),(req, res) => {});

// Route Logout, déconnexion(get)
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("dark", "Profil déconnecté.. A très vite ! ");
    res.redirect('/campgrounds');
});

module.exports = router;