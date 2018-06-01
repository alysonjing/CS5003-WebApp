var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);


var server = require('../server');


/**
* creates a function to test GET and POST requests from our api.
* @method
* @param res
* @param err
*/

describe('API', function() {
    it('should be able to POST questions to the forum and save it to the database', function() {
        let question = { heading: "Cancelled Class", category: "City name", description: "CS5003 class got cancelled", username: "Simon"}
        chai.request(server)
        .post('/savequestion')
        .send(question)
        .end( function(err,res) {
            res.should.have.status(200);
            res.text.should.be.a('string');
            let obj = JSON.parse(res.text);
            obj.should.have.property('id');
            obj.id.should.equal(5);
            obj.should.have.property('description');
            obj.text.should.be.a('string');
            obj.should.have.property('category');
            obj.category.should.equal('St Andrews');
        });
    });

    it('should be able to GET the forum question page and display all questions', function() {
      chai.request(server)
      .get('/forum-question/:id')
	    .end( function(err,res) {
        res.should.have.status(200);
        let obj = JSON.parse(res.text);
        obj.should.have.property('id');
        obj.id.should.equal(7)
	   });
  });

  it('should be able to GET the forum answer page to display specific questions', function() {
    chai.request(server)
    .get('/forum-answer/:id')
    .end(function (err,res) {
      res.should.have.status(200);
      let obj = JSON.parse(res.text);
      obj.should.have.property('id');
      obj.id.should.equal(2);
    });
  });

  it('should be able to POST answers from the forum to the database and save them', function(){
    let answer = { id: 1, answer: "Yes, roads are blocked", username: "Simon"}
    chai.request(server)
    .post('/saveanswer')
    .send(answer)
    .end(function (err, res){
      res.should.have.status(200);
      res.text.should.be.a('string');
    });
  });

  it ('should be able to logout users from the forum', function() {
    chai.request(server)
    .get('/logout')
    .end(function(err, res){
      res.should.have.status(200);
    });
  });
});
