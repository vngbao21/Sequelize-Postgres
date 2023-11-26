const express = require("express");
const app = express();
const port = 3000;
const expressHbs = require("express-handlebars");

app.use(express.static(__dirname + "/html"));
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        showDate: (date) => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        times: function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i+1);
            return accum;
        }
    }
})
);
app.set("view engine", "hbs");

app.get("/", (req, res) => res.redirect("/blogs"));
app.use("/blogs", require("./routes/blogRouter"));

app.get("/createTables", (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() => {
        res.send("Tables created!");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));