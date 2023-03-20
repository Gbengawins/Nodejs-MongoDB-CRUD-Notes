const mongoose = require("mongoose");
const Note = require("../models/Note");

//GET
exports.dashboard = async (req, res) => { 
    let perPage = 12;
    let page = req.params.page || 1;

    const locals = {
        title: "Dashboard",
        description: "NodeJS Notes App."
    };

    try {
        const notes = await Note.aggregate([
            { $sort: { updateAt: -1 } },
            { $match: { user: mongoose.Types.ObjectId } },
            {
                $project: {
                    title: { $substr: [ "$title", 0, 30 ] },
                    body: { $substr: [ "$body", 0, 100 ] },
                }
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        
        const count = await Note.count();

        res.render("dashboard/index", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
    }
};

//GET - single
exports.dashboardViewNote = async (req, res) => { 
    const note = await Note.findById({ _id: req.params.id })
        .where({ user: req.user.id })
        .lean();
    
    if (note) {
        res.render("dashboard/view-note", {
            noteID: req.params.id,
            note,
            layout: "../views/layouts/dashboard",
        });
    } else { 
        res.send("Error: No dashboard found!");
    }
};

//PUT - Specific note
exports.dashboardUpdateNote = async (req, res) => { 
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updateAt: Date.now() }
        ).where({ user: req.user.id });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
};

//DELETE - Specific note
exports.dashboardDeleteNote = async (req, res) => { 
    try {
        await Note.deleteOne({ _id: req.params.id })
            .where({ user: req.user.id });
        res.redirect("/dashboard");
    } catch (error) { 
        console.log(error);
    }
};

//GET - Add notes
exports.dashboardAddNote = async (req, res) => { 
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
};

//POST - Add notes
exports.dashboardAddNoteSubmit = async (req, res) => { 
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
};

//GET -Search for notes
exports.dashboardSearch = async (req, res) => { 
    try {
        res.render("dashboard/search", {
          searchResults: "",
          layout: "../views/layouts/dashboard",
        });
    } catch (error) {
        console.log(error);
    }
};

//POST - Search for notes
exports.dashboardSearchSubmit = async (req, res) => { 
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Note.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
            { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          ],
        }).where({ user: req.user.id });

        res.render("dashboard/search", {
          searchResults,
          layout: "../views/layouts/dashboard",
        });
    } catch (error) {
        console.log(error);
    }
};