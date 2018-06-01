const request = require("request");
var cradle = require('cradle');
const async = require("async");


var db = new (cradle.Connection)().database('community-app');



var db = new(cradle.Connection)
("http://lyrane.cs.st-andrews.ac.uk:21157",
{auth:{username:"am447",
password:"CvMvsLR9"}})
.database("community-app");

/**
 * MVC Models for Forum App. Every time route is requested, it calls methods of this class to perform the Business logic so that Controllers 
 * to remain free from typical code. 
 * @class
 */

db.exists(function (err, exists) {
    if (err) {
        console.log("error", err);
    } else if (exists) {
        console.log("Database found. Yay!");
    } else {
        console.log("Database not found. Oh noez!");
        db.create();
}});


class ForumController {
    /**
     * Controller for Login. Called from the Route. It will do login if user specifies correct username and password, sends 200 Response otherwise
     * 404
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    doLogin(req, http_res) {
        var username = req.body.username;
        var password = req.body.password;

        if (username.length != 0 && password.length != 0) {
            db.get(username, function (err, doc) {
                if (err) {
                    if (err.error) {
                        http_res.status(400).send({ success: false, message: "User not exist" });
                    }
                } else {
                    if (doc.password === password) {
                        if (req.session.username && req.session.username === username) {
                            console.log("Already Logged in");
                        } else {
                            req.session.username = username;
                            console.log("Logged in successfully")
                        }
                        // http_res.status(200).render("/forum/forum-home", { success: true, message: "Login Successful" });
                        req.session.save(function (err) {
                            http_res.redirect("/forum/forum-home");
                        });
                    } else {
                        http_res.status(400).send({ success: false, message: "Wrong Credentials" });
                    }
                }
            });
        } else {
            http_res.status(400).send({ success: false, message: "Enter email address and password" });
        }
    }

    /**
     * Controller for Registration. Called from the Route. It will register the User and send the Response code with JSON to client.
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    doRegister(req, http_res) {
        var username = req.body.username;
        var password = req.body.password;
        var response = "";
        if (username.length != 0 && password.length != 0) {
            db.get(username, function (err, doc) {
                if (err) {
                    if (err.error === "not_found") {
                        db.save(username, {
                            password: password,
                        }, function (err, res) {
                            if (err) {
                                http_res.status(400).send({ success: false, message: "Error in inserting record" });
                            } else {
                                // http_res.status(200).send({ success: true, message: "Record inserted successfully" });
                                http_res.redirect("/forum/");
                            }
                        });
                    }
                } else {
                    http_res.status(400).send({ success: false, message: "User already exist" });
                }
            });
        } else {
            http_res.status(400).send({ success: false, message: "Enter valid data" });
        }
    }

    /**
     * Controller for Asking and Saving Question. Called from the forum-ask.ejs.
     * It will save the question into the database and redirect to the forum-home.ejs
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    saveQuestion(req, http_res) {
        var heading = req.body.heading;
        var category = req.body.category;
        var description = req.body.description;
        // var username = "admin";
        var username = req.session.username;
        _saveQuestion(heading, category, description, username)
        http_res.redirect("/forum/forum-home");
    }

    /**
     * Controller for Saving the Answer. Called from the forum-answer.ejs.
     * It will save the Answer of the question into the database and redirect to the forum-question.ejs
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    saveAnswer(req, http_res) {
        var id = req.body.id;
        var answer = req.body.answer;
        // var username = "admin";
        var username = req.session.username;
        _saveAnswer(id, answer, username);
        http_res.redirect(`/forum/forum-question/${id}`);
    }

    /**
     * Controller for All documents i.e. Question. Landing page after login page. 
     * It will Display all the questions asked by users. You can apply filter for City as well.
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    getAllQuestions(city, callback) {
        _getDocuments(city, function(data){
            var result = [];
            if(data){
                data.forEach(function(row){
                    var question = {};
                    question.id = row._id;
                    question.question = row.question;
                    question.description = row.description;
                    question.time = row.time;
                    question.category=row.category;
                    result.push(question);
                });
                //Sorting
                result.sort(function(a,b){
                    return new Date(b.time) - new Date(a.time);
                });
            }
            callback(result);
        });
    }

    /**
     * Controller for Getting the Question. Called from the forum-home.ejs.
     * It will pull the question from the database.
     * @function
     * @param {object} req - Request object from HTTP.
     * @param {object} res - Response object from HTTP.
     */
    getQuestion(id, callback){
        _getDocument(id, undefined,  function(data){
            if(data){
                //Sort Answers by decreasing date
                if(data.answers){
                    data.answers.sort(function(a,b){
                        return new Date(b.time) - new Date(a.time);
                    });
                }
                callback(data);
            }else{
                callback();
            }
        });
    }
}

function _saveQuestion(heading, category, description, username){
    var now = new Date();
    var question = {
        question: heading,
        category,
        description,
        username,
        docType: "question",
        time: now,
        answers: []
    };
    db.save(question, function(err, res){
        if(err){
            console.log("Error in Saving")
        }else{
            console.log("Record Saved");
        }
    });
}

function _saveAnswer(id, answer, username){
    db.get(id, function (err, doc) {
        if (err) {
            if(err.error === "not_found"){
                console.log("Document not found");
            }
        } else {
            var now = new Date();
            if(doc.answers)
                doc.answers.push({answer, time:now, username});
            else
                doc.answers = [{answer, time:now, username}];
            
            db.save(doc._id, doc, function(err, res){
                if(err){
                    console.log("Error in updating")
                }else{
                    console.log("Record Updated\n");
                }
            });
        }
    });
}

function _getDocuments(city, callback) {
    db.all(function (err, docs) {
        if (err)
            console.log(err);
        else
            if (docs.length > 1) {
                var result = [];
                async.forEachOf(docs, (doc, key, callback1) =>{
                    _getDocument(doc.id, city, function(data){
                        if(data){
                            result.push(data);
                        }
                        callback1();
                    });
                }, function(err){
                    if(err)
                        console.log(err);
                    callback(result);
                });
            }
    });
}
function _getDocument(id, city, callback) {
    db.get(id, function (err, doc) {
        if (err) {
            if (err.error === "not_found") {
                console.log("Document not found");
            }
            callback();
        } else {
            if (doc.docType === "question") {
                if(city === undefined){
                    callback(doc);
                }
                else{
                    if(doc.category === city || city === "all"){
                        callback(doc);
                    }
                    else{
                        callback();
                    }
                }
            }else{
                callback();
            }
        }
    });
}

module.exports = ForumController;