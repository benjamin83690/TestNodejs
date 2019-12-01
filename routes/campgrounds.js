var express     = require('express'),
    router      = express.Router(),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware');


// Index Route (campground/index.ejs)
router.get("/", (req, res) => {    
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });   
});

// New Route (campground/new.ejs)
router.get('/new' , middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Create Route (campground/new.ejs)
router.post("/" , middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
        image = req.body.image;
        desc = req.body.description;
        author = {
            id: req.user._id,
            username: req.user.username
        }
        newCampground = {name: name, image: image, description: desc, author: author};

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', "Un nouveau camping a été créé !");
            res.redirect("/campgrounds");
        }
    });   
});

// Show Route (campground show.ejs)
router.get('/:id', (req, res) => {
    // Trouve un terrain de camping et trouve ces commentaires associés grace a la methode populate()
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Le Camping est introuvable ... 😒‍');
            res.redirect('back');
        } else {
            // console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });    
});

// Edit Campground Route(edit.ejs)
router.get('/:id/edit', middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});
// Update campground Route(edit.ejs)
router.put('/:id', middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('warning', "Camping modifier avec succes!");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

// Delete Campground Route (supprime le camping et ses commentaire associé)
router.delete("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash('info', "Camping supprimer avec succes!");
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;