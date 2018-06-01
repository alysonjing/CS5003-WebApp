// var chai = require('chai'), chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// var app = 'localhost:3000';

const request = require('supertest');
const app = require('../server');
const expect = require('chai').expect;


/**
* creates a function to test whether the api to login is working.
* @method
*/

describe("Forum Login Unit Test Cases", function(){
    describe("Login test 1 - Right Credentials", function () {
        it("should pass", function (done) {
            request(app)
                .post('/forum/login')
                .type('form')
                .send({
                    username: 'admin',
                    password: 'admin'
                })
                .expect(200)
                .end(done);
        });
    });

    describe("Login test 2 - Wrong Credentials", function () {
        it("should fail", function (done) {
            request(app)
                .post('/forum/login')
                .type('form')
                .send({
                    username: 'crazy',
                    password: 'krazy'
                })
                .expect(400)
                .end(done);
        });
    });

    describe("Login test 3 - Blank credentials", function () {
        it("should fail", function (done) {
            request(app)
                .post('/forum/login')
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
