// var chai = require('chai'), chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// var app = 'localhost:3000';

const request = require('supertest');
const app = require('../server');
const expect = require('chai').expect;


/**
* creates a function to test wheather the api to register new users is working.
* @method
*/


describe("Forum Register Unit Test Cases", function(){
    describe("Register test 1 - New User", function () {
        it("should pass", function (done) {
            request(app)
                .post('/forum/register')
                .type('form')
                .send({
                    username: 'admin',
                    password: 'admin'
                })
                .expect(200)
                .end(done);
        });
    });

    describe("Register test 2 - Existing user", function () {
        it("should fail", function (done) {
            request(app)
                .post('/forum/register')
                .type('form')
                .send({
                    username: 'password',
                    password: 'password'
                })
                .expect(400)
                .end(done);
        });
    });

    describe("Register test 3 - Blank information", function () {
        it("should fail", function (done) {
            request(app)
                .post('/forum/register')
                .type('form')
                .send({
                    username: '',
                    password: ''
                })
                .expect(400)
                .end(done);
        });
    });
});
