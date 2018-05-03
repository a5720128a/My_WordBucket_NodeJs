//------------------------- setting and import -------------------------
var express = require('express'); //require the just installed express app
var app = express(); //then we call express
var Op = require('sequelize').Op;
var db = require('./models');
var Word = db.Word;
var Explanation = db.Explanation;

var Explanation_Word = Explanation.belongsTo(Word, {as: 'Explanation_Word'});
//Word.Explanation = Word.hasMany(Explanation);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var message = "";
var currentWord_id = 0;

app.set('view engine', 'ejs'); //template

//------------------------- functions -------------------------
var type = 1;
function addingNewWord (req, res, next) {  //post route for adding new word
  var word_ref = req.body.word_input
  var explanation_ref = req.body.explanation_input
  Word.findAll({
    where: {
      word: word_ref
    },
    attributes: ['id','word'],
    raw : true
  }).then(function(query) {
    var word_k = [];
    var id_k = []
    var ref = [];
    query.forEach(function(item) {
      word_k.push(item.word);
      id_k.push(item.id);
    });
    console.log(word_k)
    console.log(ref)
    //no-duplicate
    if (word_k.toString() == ref.toString()) {
      console.log("no-duplicate")
      if(word_ref == "" && explanation_ref == ""){
        type = 1;
        message = "Please enter the word.";
        return res.redirect("/message");
      }
      else if (word_ref != "" && explanation_ref == ""){
        message = ""
        Word.create({ 
          word: req.body.word_input,
        });  //add the new word from the post route into the array
      }
      else if (word_ref != "" && explanation_ref != ""){
        message = ""
        Explanation.create({
          Explanation_Word: {
            word: req.body.word_input,
          },
          explanation_text: req.body.explanation_input,
          like: 0,
          dislike: 0,
        }, {
          include: [ Explanation_Word ]
        });
      }
      res.status(200)
      res.redirect("/");  //after adding to the array go back to the root route 
    }
    //duplicate message "duplicate word, your explanation add to existing word."
    else {      
      var wordID_ref = id_k.toString()
      console.log("duplicate")
      //no explanation
      if (explanation_ref != "") {
        Explanation.create({
          ExplanationWordId: wordID_ref,
          explanation_text: req.body.explanation_input,
          like: 0,
          dislike: 0,
        });
        type = 1;
        message = "duplicate word, your explanation add to existing word.";
        return res.redirect("/message");
      }
      //have explanation
      else if (explanation_ref == "") {
        type = 1;
        message = "duplicate word.";
        return res.redirect("/message");
      }
    }
  }); 
}

function addingNewExplanation (req, res, next) {  //post route for adding new explanation
  var explanation_ref = req.body.explanation_input
  var wordID_ref = currentWord_id
  if(explanation_ref == ""){
    type = 2;
    message = "Please enter the explanation.";
    return res.redirect("/message");
  }else if (explanation_ref != ""){
    message = ""
    Explanation.create({
      ExplanationWordId: wordID_ref,
      explanation_text: req.body.explanation_input,
      like: 0,
      dislike: 0,
    });
  }
  res.redirect("/word/"+wordID_ref);  //after adding to the array go back to the root route    
}

function renderDisplayWithMessage(req, res) {  //render the ejs and display added word
  if (type == 1){
    var alphabets = ("abcdefghijklmnopqrstuvwxyz").split("");
    Word.findAll({
      attributes: ['id','word'],
      raw : true
    }).then(function(query) {
      var word = [];
      var id = [];
      query.forEach(function(item) {
        word.push(item.word);
        id.push(item.id);
      });
      res.render("index", { alphabets: alphabets , word: word , id: id , message: message });
    });
  }else if(type == 2){
    var wordID_ref = currentWord_id
    Word.findById(wordID_ref).then(function(query) {
      var word = query.word;
      Explanation.findAll({
        where: {
          ExplanationWordId: wordID_ref
        },
        attributes: ['ExplanationWordId','explanation_text','like','dislike'],
        raw : true
      }).then(function(ref) {
        var explanation = [];
        var like = [];
        var dislike = [];
        var wordID = [];
        wordID.push(wordID_ref);
        ref.forEach(function(item) {
          explanation.push(item.explanation_text);
          like.push(item.like);
          dislike.push(item.dislike);
        });
        res.render("detail", { word: word , wordID: wordID , explanation: explanation , message: message });
      });
    });
  }
}

function renderDisplay(req, res) {  //render the ejs and display added word
  message = ""
  var alphabets = ("abcdefghijklmnopqrstuvwxyz").split("");
  Word.findAll({
    attributes: ['id','word'],
    raw : true
  }).then(function(query) {
    var word = [];
    var id = [];
    query.forEach(function(item) {
      word.push(item.word);
      id.push(item.id);
    });
    res.render("index", { alphabets: alphabets , word: word , id: id , message: message , message: message });
  });
}

function view_word(req, res) { //view word detail
  message = "";
  var wordID_ref = Number(req.params.id)
  currentWord_id = wordID_ref
  Word.findById(wordID_ref).then(function(query) {
    var word = query.word;
    Explanation.findAll({
      where: {
        ExplanationWordId: wordID_ref
      },
      attributes: ['id','ExplanationWordId','explanation_text','like','dislike'],
      raw : true
    }).then(function(ref) {
      var explanation = [];
      var like = [];
      var dislike = [];
      var wordID = [];
      var explanationID = [];
      wordID.push(wordID_ref);
      ref.forEach(function(item) {
        explanation.push(item.explanation_text);
        like.push(item.like);
        dislike.push(item.dislike);
        explanationID.push(item.id);
      });
      res.render("detail", { word: word , wordID: wordID , explanationID : explanationID , explanation: explanation , like : like , dislike : dislike , message: message });
    });
  });
}

function searchWord(req, res) { //search word
  if (req.body.search_input) {
    var search_ref = req.body.search_input.toString();
    var by_word = "yes";
  }else {
    var search_ref = req.params.word.toString();
    var by_word = "no";
  }
  var word = [];
  var id = [];
  if (by_word == "yes") {
    if(search_ref == ""){
      message = "Please enter the word.";
      return res.render("search", { word: word , id: id , message: message });
    }
    else if (search_ref != ""){
      message = ""
      Word.findAll({
        where: {
          word: {
            $like: "%"+search_ref+"%"
          }
        },
        attributes: ['id','word'],
        raw : true
      }).then(function(query) {
        query.forEach(function(item) {
          word.push(item.word);
          id.push(item.id);
        });
        return res.render("search", { word: word , id: id , message: message })
      });
    }
  }else if (by_word == "no") { 
    if(search_ref == ""){
      message = "Please enter the word.";
      return res.render("search", { word: word , id: id , message: message });
    }
    else if (search_ref != ""){
      message = ""
      Word.findAll({
        where: {
          word: {
            $like: search_ref+"%"
          }
        },
        attributes: ['id','word'],
        raw : true
      }).then(function(query) {
        query.forEach(function(item) {
          word.push(item.word);
          id.push(item.id);
        });
        return res.render("search", { word: word , id: id , message: message })
      });
    }
  }
}

function likeExplanation(req, res) { //like explanation function
  var wordID_ref = Number(req.params.wordid)
  var explanationID_ref = Number(req.params.explanationid)
  Explanation.findAll({
    where: {
      id: explanationID_ref
    },
    attributes: ['id','explanation_text','like','dislike'],
    raw : true
  }).then(function(ref) {
    var like = [];
    ref.forEach(function(item) {
      like.push(item.like);
    });
    Explanation.update({
      like: Number(like.toString())+1
    },{where: {
      id: explanationID_ref
    }});
    console.log(Number(like.toString())+1)
    return res.redirect("/word/"+wordID_ref);
  });
}

function dislikeExplanation(req, res) { //dislike explanation function
  var wordID_ref = Number(req.params.wordid)
  var explanationID_ref = Number(req.params.explanationid)
  Explanation.findAll({
    where: {
      id: explanationID_ref
    },
    attributes: ['id','explanation_text','like','dislike'],
    raw : true
  }).then(function(ref) {
    var dislike = [];
    ref.forEach(function(item) {
      dislike.push(item.dislike);
    });
    Explanation.update({
      dislike: Number(dislike.toString())+1
    },{where: {
      id: explanationID_ref
    }});
    console.log(Number(dislike.toString())+1)
    return res.redirect("/word/"+wordID_ref);
  });
}


// ------------------------- path and call function -------------------------

app.use('/addword', addingNewWord); //call function add word

app.use('/word/:id/addexplanation', addingNewExplanation);

app.use('/word/:wordid/:explanationid/like', likeExplanation);

app.use('/word/:wordid/:explanationid/dislike', dislikeExplanation);

app.use('/search/:word', searchWord);

app.get('/message', renderDisplayWithMessage);

app.get('/', renderDisplay) 
//the server is listening on port 3000 for connections

app.get('/word/:id',view_word)

var server = app.listen(3000, function () {
  //db.sequelize.sync();
  console.log('Example app listening on port 3000')
});

module.exports = server //for test
