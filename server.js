const exp = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { reset } = require("nodemon");

app = exp();
app.use(bodyParser.urlencoded({extended : true}));
app.use(exp.static('public'));
app.set('view engine', 'ejs');

// creating connection with mongoose
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/wikiDb", {useNewUrlParser : true});

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = new mongoose.model("Article", articleSchema);

// var item1 = new Article({
//     title : "REST",
//     content : "Rest is short for representational state transfer. It's an architectural style for designing APIs."
// });

// var item2 = new Article({
//     title : "HTML",
//     content : "HTML is the standard markup language for Web pages. With HTML you can create your own Website."
// });

// var item3 = new Article({
//     title : "CSS",
//     content : "CSS is the language we use to style an HTML document. CSS describes how HTML elements should be displayed."
// })

// var item4 = new Article({
//     title : "JS",
//     content : "JavaScript is the world's most popular programming language. JavaScript is the programming language of the Web."
// })

// var defaultItems = [item1, item2, item3, item4];

// Article.insertMany(defaultItems, function(err, res)
// {
//     if(err)console.log(err);
//     else console.log("successfully added to the db");
// })

app.route("/articles")
    .get(function(req, res)
    {
        Article.find(function(err, result)
        {
            if(err)res.send(err);
            else res.send(result);
        })
    })
    .post(function(req, res)
    {
        let formTitle = req.body.title;
        let formContent = req.body.content;

        var newArticle = new Article({title : formTitle, content : formContent});

        newArticle.save(function(err)
        {
            if(err)res.send(err);
            else res.send("added \n\n" + newArticle);
        })
    })
    .delete(function(req, res)
    {
        Article.deleteMany(function(err)
        {
            if(err)res.send(err);
            else res.send("deleted all articles");
        })
    });

app.route("/articles/:articletitle")
    .get(function(req, res)
    {
        let articleName = req.params.articletitle;
        Article.find({title : articleName}, function(err, result)
        {
            if(err)
            {
                console.log(err);
                res.send(err);
            }
            else 
            {
                if(result.length > 0)res.send(result);
                else res.send("no article with such title exists");
            }
        })
    })

    .put(function(req, res)
    {
        let articleName = req.params.articletitle;
        Article.updateOne
        (
            {title : articleName},
            {title : req.body.title, content : req.body.content},
            // {overwrite : true},
            function(err)
            {
                if(err)
                {
                    console.log(err);
                    res.send(err);
                }
                else res.send("Successfully updated");
            }
        )
    })

    .patch(function(req, res)
    {
        let articleName = req.params.articletitle;
        Article.updateOne
        (
            {title : articleName},
            {$set : {content : req.body.content}},
            function(err, result)
            {
                if(err){console.log(err); res.send(err);}
                else res.send("successfully updated");
            }
        )
    })
    
    .delete(function(req, res)
    {
        let articleName = req.params.articletitle;
        Article.deleteOne
        (
            {title : articleName},
            function(err, result)
            {
                if(err){console.log(err); res.send(err);}
                else res.send("successfully deleted article : " + articleName);
            }
        )
    })

app.listen(3000, function(err)
{
    if(err)console.log(err);
    else console.log("successfully started server at post 3000");
})