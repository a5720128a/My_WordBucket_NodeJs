//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var db = require('../models');
var Word = db.Word;
var Explanation = db.Explanation;
var chai = require('chai');
var expect = require('chai').expect;
var superagent = require('superagent');
var supertest = require('supertest');
var index = require('../index.js');
var should = chai.should();
var request = require('request');

var server = supertest.agent("http://localhost:3000/");

describe('Unit testing', function(){
    
    //------------HomePageTest------------//
    it('test_uses_home_template', function(done){
        server
        .get("")
        .expect(200)
        .end(function(err, res){
            res.status.should.equal(200);
            done();
        });
    });

    //------------NewWordTest------------//
    it('test_redirect_after_add_word', function(done){
        server
        .post("addword")
        .send({word_input: "JA",explanation_input: "VA"})
        .expect("Content-type",/json/)
        .expect(302)
        .end(function(err, res){
            res.status.should.equal(302);
            done();
        });
    });

    it('test_save_POST_after_add_word', function(done){
        server
        .post("addword")
        .send({word_input: "JA",explanation_input: "VA"})
        .expect("Content-type",/json/)
        .expect(302)
        .end(function(err, res){
            res.status.should.equal(302);
            
            Word.create({ 
              word: "TEST",
            }).then( function (test) {
              // do some tests on article here
              test.destroy();
              done();
            });
        });
    });

    //------------NewExplanationTest------------//
    it('test_can_save_a_POST_request_to_an_existing_word', function(done){
        server
        .post("word/1/addexplanation")
        .send({word_input: "JA",explanation_input: "VA"})
        .expect("Content-type",/json/)
        .expect(302)
        .end(function(err, res){
            res.status.should.equal(302);
       
            Explanation.create({ 
              ExplanationWordId: 1,
              explanation_text: "Test",
              like: 0,
              dislike: 0,
            }).then( function (test) {
              // do some tests on article here
              test.destroy();
              done();
            });
        });
    });
    it('test_redirects_to_word_view', function(done){
        server
        .post("word/1/addexplanation")
        .send({word_input: "JA",explanation_input: "VA"})
        .expect("Content-type",/json/)
        .expect(302)
        .end(function(err, res){
            res.status.should.equal(302);
            done();
        });
    });


    //------------SearchAndBrowseTest------------//
    it('test_render_after_POST', function(){
        server
        .post("search/x")
        .send({search_input: "x"})
        .expect("Content-type",/json/)
        .expect(302)
        .end(function(err, res){
            res.status.should.equal(302);
            done();
        });
    });

/* ================== future test ==================

    //------------VoteTest------------//
    it('test_redirects_like_to_word_view', function(){
        
    });
    it('test_redirects_dislike_to_word_view', function(){
        
    });

    
*/

});
