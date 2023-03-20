//GET - Home page
exports.homepage = async (req, res) => { 
    const locals = {
        title: "NodeJS Notes",
        description: "NodeJS Notes App.",
    }
    res.render('index', {
        locals,
        layout: "../views/layout/front-page"
    })
};

// GET - About page
exports.about = async (req, res) => { 
    const locals = {
        title: "NodeJS Notes",
        description: "NodeJS Notes App",
    }
    res.render('index', locals);
};