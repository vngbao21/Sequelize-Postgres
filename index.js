const express = require("express");
const app = express();
const port = 4000;
const expressHbs = require("express-handlebars");

app.use(express.static(__dirname + "/html"));
app.engine("hbs", expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
})) 
app.set("view engine", "hbs");

app.get("/", (req, res) => res.redirect("/blogs"));
app.use("/blogs", require("./routes/blogRouter.js"));

app.listen(port, () => console.log('Example app listening on port ${port}!'));