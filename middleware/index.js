var Campground      = require('../models/campground'),
    Comment         = require('../models/comment'),
    middlewareObj   = {};

middlewareObj.checkCampgroundOwnerShip = (req, res, next) => {
    // l'utilisateur est-il connecté ?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Le camping est introuvable ... 😒');
                res.redirect("back");
            } else {
                // Possède-t-il le terrain de camping ?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "vous n'avez pas la permission d'access, veuillez vous enregistrer!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'Vous devez avoir un compte pour accéder à cela .. !');
        res.redirect('back');
    }
};


middlewareObj.checkCommentOwnerShip = (req, res, next) => {
    // l'utilisateur est-il connecté ?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Commentaire introuvable ... 😒');
                res.redirect("back");
            } else {
                // Est-il l'autheur du commentaire ?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "vous n'avez pas la permission d'access, veuillez vous enregistrer!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', "Vous devez être connecté pour le faire !");
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Veuillez créer votre compte ou bien veuillez-vous connecter s'il vous plaît!")
    res.redirect('/login');
};


module.exports = middlewareObj;