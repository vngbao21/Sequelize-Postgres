const controller = {};

controller.showList = (req, res) => {
    res.render("index");
}

controller.showDetails = (req, res) => {
    res.render("details");
}

module.exports = controller;