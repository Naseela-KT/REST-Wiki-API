const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine',"ejs");

app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/wikiDB");

const articleSchema=new mongoose.Schema({
    title:String,
    content:String
});

const Article=mongoose.model("Article",articleSchema);

///////////for All Document////////////////////////////////////////

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,result){
        if(!err){
            res.send(result);
        }
        else{
            console.log(err);
        }
    })
})
.post(function(req,res){

    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully Added new Document");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted All Document");
        }else{
            res.send(err);
        }
    })
});

///////////////For One Document///////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,result){
        if(result){
            res.send(result);
        }else{
            res.send("Not Found");
        }
    })
})
.put(function(req,res){
    Article.update({title:req.params.articleTitle},
        {
            title:req.body.title,
            content:req.body.content
        },
        {overwrite:true},
        function(err,result){
            if(!err){
                res.send("Success");
            }
        });
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err,result){
            if(!err){
                res.send("Success");
            }else{
                res.send("Error");
            }
        }
        );
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err,result){
            if(!err){
                res.send("Deleted");
            }
            else{
                res.send(err);
            }
        })
})


app.listen(3000);