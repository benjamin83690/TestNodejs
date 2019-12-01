var mongoose    = require('mongoose');
var Campground  = require('./models/campground');
var Comment     = require("./models/comment");

var data = [
    {
        name: "Club Med", 
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Superbe camping 3 étoiles *** , Animations , piscine, randonné à proximité et tout un tas d'autres choses .. ! "
        + " Cillum veniam cillum cupidatat tempor magna sint reprehenderit nostrud velit excepteur commodo quis non. Sit culpa nulla laboris in id. Anim est laborum esse officia aliquip ut exercitation excepteur magna aute occaecat eiusmod ullamco. Elit exercitation aliqua quis aute elit voluptate magna deserunt reprehenderit qui proident eu. Enim proident officia commodo enim exercitation eu. Duis nulla incididunt ipsum labore."
    },
    {
        name: "Camping paradise", 
        image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Des piscines à couper le souffle , des spas de luxes et pleins d'autres choses.. !"
        + " Cillum veniam cillum cupidatat tempor magna sint reprehenderit nostrud velit excepteur commodo quis non. Sit culpa nulla laboris in id. Anim est laborum esse officia aliquip ut exercitation excepteur magna aute occaecat eiusmod ullamco. Elit exercitation aliqua quis aute elit voluptate magna deserunt reprehenderit qui proident eu. Enim proident officia commodo enim exercitation eu. Duis nulla incididunt ipsum labore."
    },
    {
        name: "Camping de la Cigale", 
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Super camping a venir découvrir, venez vous couper du monde et profiter de la nature et de toutes ces superbes activités .. !"
        + " Cillum veniam cillum cupidatat tempor magna sint reprehenderit nostrud velit excepteur commodo quis non. Sit culpa nulla laboris in id. Anim est laborum esse officia aliquip ut exercitation excepteur magna aute occaecat eiusmod ullamco. Elit exercitation aliqua quis aute elit voluptate magna deserunt reprehenderit qui proident eu. Enim proident officia commodo enim exercitation eu. Duis nulla incididunt ipsum labore."
    }
]

function seedDB() {

    Campground.deleteMany({}, err => {
        if (err) {
        console.log(err); 
        }
        Comment.deleteMany({}, err => {
            if (err) {
                console.log(err)
            }        
            data.forEach(seed => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        Comment.create((err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            }
                        );
                    }
                });
            });
        });
    });
}

module.exports = seedDB;