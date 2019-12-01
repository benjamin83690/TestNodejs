// Téléchargement des modules , importations des modules sur le fichier app.js
const   express         = require("express"),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        flash           = require('connect-flash'),
        passport        = require('passport'),
        localStrategy   = require('passport-local'),
        methodOverride  = require('method-override'),
        Campground      = require("./models/campground"),
        Comment         = require("./models/comment"),
        User            = require('./models/user'),
        seedDB          = require('./seeds'),
        app             = express();

const   indexRoutes         = require('./routes/index'),
        campgroundRoutes    = require('./routes/campgrounds'),
        commentRoutes       = require('./routes/comments');

// Connection à la base de donnée Atlas Mongodb 
mongoose.connect("mongodb+srv://benjamin83:Salernes83@benjamin-6ag8m.azure.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('connect DB');
}).catch(err => {
    console.log('Error', err.message);
});
mongoose.set('useFindAndModify', false);

/*  Public-> Lie le fichiers Css,  
    set("engine", "ejs")-> raccourcir les itinéraires,  
    + Utilisations des modules importé plus haut (ex= bodyparser qui sert a récupérer les donnés) 
*/
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Welcome back Harry Potter",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// initialise la variable currentUser sur toutes les pages pour ne pas recevoir de msg d'erreur
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    res.locals.dark = req.flash('dark');
    next();
});
// Utilisation des routes requise dans l'app, le premier paramêtre sert a raccourcir les initénaire dans leurs fichiers
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () => {
    console.log('Listen !');
});