const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forum/forumController");
const controller = new forumController();
const moment = require("moment");

//Landing page of Forum Page
router.get("/", function(req, res){
    res.render("forum/login");
});

//Login Handler
router.post("/login", controller.doLogin);

//Render Register Page
router.get("/registerlink", function(req, res){
    res.render("forum/register");
});

//Registration Page Handler
router.post("/register", controller.doRegister);

//Forum home with Filter
router.post("/forum-home-filter", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.getAllQuestions(req.body.category, function(data){
            res.render("forum/forum-home.ejs", {data, moment, selected: req.body.category});
        });
    }
});
//Forum home with Normal Process
router.get("/forum-home", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.getAllQuestions(req.query.city, function(data){
            res.render("forum/forum-home.ejs", {data, moment, selected:"all"});
        });
    }
});

//Render Forum-Ask Page
router.get("/forum-ask", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        res.render("forum/forum-ask");
    }
});

//Saves the Question in the CouchDB Database
router.post("/savequestion", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.saveQuestion(req, res);
    }
});

//Displays the Forum-Question page with Specific Question
router.get("/forum-question/:id", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.getQuestion(req.params.id, function(data){
            data.data = data;
            data.moment = moment;
            res.render("forum/forum-question.ejs", {data});
        });
    }
});

//Displays the Forum-Answer page with Specific Question
router.get("/forum-answer/:id", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.getQuestion(req.params.id, function(data){
            res.render(`forum/forum-answer`, {data});
        });
    }
});

//Saves the Answer for the question
router.post("/saveanswer", function(req, res){
    if(!req.session.username){
        res.redirect("/forum/");
    }else{
        controller.saveAnswer(req, res);
    }
});

//Logout from application
router.get("/logout", function(req, res){
    console.log("From logout", req.session.username);
    req.session.destroy(function(err){
        res.redirect("/forum/");
    });
});


module.exports = router;
