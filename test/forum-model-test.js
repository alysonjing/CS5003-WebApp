var mocha = require('mocha');
var chai = require('chai');
var model = require('../controllers/forum/forumController');
var should = chai.should();
var expect = chai.expect();

/**
* creates a function to test our model
* @method
*/

describe('Model', function() {
    it('should be up and working when users login', function() {
        let testLogin = new model.ForumController();
        should.exist(testLogin); //.should.not.be.an('undefined');
        testLogin.should.be.instanceof(model.ForumController);
    });
});
