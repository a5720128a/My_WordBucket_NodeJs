//------------------------- setting and import -------------------------
var express = require('express'); //require the just installed express app
var app = express(); //then we call express
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
      res.render("index", { word: word , id: id , message: message });
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
        ref.forEach(function(item) {
          explanation.push(item.explanation_text);
          like.push(item.like);
          dislike.push(item.dislike);
          wordID.push(item.ExplanationWordId);
        });
        res.render("detail", { word: word , wordID: wordID , explanation: explanation , message: message });
      });
    });
  }
}

function renderDisplay(req, res) {  //render the ejs and display added word
  message = ""
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
    res.render("index", { word: word , id: id , message: message , message: message });
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
      attributes: ['ExplanationWordId','explanation_text','like','dislike'],
      raw : true
    }).then(function(ref) {
      var explanation = [];
      var like = [];
      var dislike = [];
      var wordID = [];
      ref.forEach(function(item) {
        explanation.push(item.explanation_text);
        like.push(item.like);
        dislike.push(item.dislike);
        wordID.push(item.ExplanationWordId);
      });
      res.render("detail", { word: word , wordID: wordID , explanation: explanation , message: message });
    });
  });
}

// ------------------------- call function -------------------------

app.use('/addword', addingNewWord); //call function add word

app.use('/word/:id/addexplanation', addingNewExplanation);

app.get('/message', renderDisplayWithMessage);

app.get('/', renderDisplay) 
//the server is listening on port 3000 for connections

app.get('/word/:id',view_word)

var server = app.listen(3000, function () {
  //db.sequelize.sync();
  console.log('Example app listening on port 3000')
});

module.exports = server //for test
