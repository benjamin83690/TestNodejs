var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware/index');


// Page D'ajout d'un nouveau commentaire (commentts/new.ejs(get))
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Ajout du commentaire sur le camping associé et redirection sur sa page (comments/new.ejs(POST))
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', "Une erreur s'est produite ... ");
                    console.log(err);
                } else {
                    // ajouter le username et l'id au commmentaire
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // sauvregarder le commentaire
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', "Votre commentaire a été ajouté avec succes!");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// Route Edit commentaire
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Camping introuvable ... 😒");
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// Route Update Comment
router.put('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('warning', "Votre commentaire a été modifié avec succes!");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

// Route Delete Comment 
router.delete('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            req.flash('info', "Votre message a été supprimer avec succes!");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;
