const knex = require("../db/knex.js");
const translator = require('../config/GoogleAPI.js');

module.exports = {
  index: function(req, res) {
    res.render('index', {user: req.session.user});
  },
  loginPage: function(req, res) {
    res.render('login');
  },
  login: function(req,res){
    knex("users").where({email: req.body.email})
    .then((rows)=>{
      var user = rows[0];
      if(user && user.password === req.body.password){
        knex("users").where({email: req.body.email}).update({
          language: req.body.language.substr(0,2)
        })
        .then(()=>{
          knex("users").where({email: req.body.email}).then(rows=>{
            let currUser=rows[0];
            req.session.user = currUser;
            req.session.save(err=>{
              if(err){
                console.error(err);
              }
            })
          });
          knex("words").where({user_id:req.session.user.id}).update({//maybe this could cause an issue if they lgin when the past user didn't log out
            status:"blue",
            count:0
          }).then(result=>{
            res.redirect("/");
          })
          .catch(error=>console.log(error))
        })
        .catch(err=>console.log(err));
      }
      else{
        res.redirect("/");
      }
    })
    .catch(err=>{
      console.log(err);
    })
  },
  register: function(req,res){
    res.render('register');
  },
  newUser: function(req,res){
    if(req.body.password!=req.body.confirmpass){
      res.redirect("/register");
      return;
    }
    knex("users").insert({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      language: req.body.language.substring(0,2)
    })
    .then(()=>{
      knex("users").where({email: req.body.email})
      .then((rows)=>{
        var user = rows[0];
        req.session.user = user;
        res.redirect("/");
      })
      .catch(err=>{
        console.log(err);
      })
    })
    .catch(err=>{
      console.log(err);
    })
  },

  trainingPage: function(req,res){
    // get words from the database based on user's input word
    knex('words').orderBy('updated_at', 'asc')
    .where({language: req.session.user.language})
    .where({ user_id: req.session.user.id })
    .whereNot({status: 'green'})
    .then((results)=> {
      if(results.length==0){
        res.redirect('/')
      }
      else{
        knex('words')
        .where({ user_id: req.session.user.id })
        .where({language: req.session.user.language})
        .where({status: 'green'})
        .then(rows=>{
          let greenWords = rows.length;
          knex('words')
          .where({ user_id: req.session.user.id })
          .where({language: req.session.user.language})
          .where({status: 'yellow'})
          .then(rows=>{
            let yellowWords = rows.length;
            knex('words')
            .where({ user_id: req.session.user.id })
            .where({language: req.session.user.language})
            .where({status: 'red'})
            .then(rows=>{
              let redWords = rows.length;
              knex('words')
              .where({language: req.session.user.language})
              .where({ user_id: req.session.user.id })
              .then(rows=>{
                let totalWords = rows.length
                res.render('train', { 
                  translatedWord: results[0] , 
                  greenWords: greenWords, 
                  redWords: redWords, 
                  yellowWords: yellowWords,
                  totalWords: totalWords
                });
              })
            })
          })
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  },

  wordForm: function(req,res){
    //if they haven't done the post request, we'll pass an empty string
    knex("words")
    .where({user_id: req.session.user.id})
    .where({language: req.session.user.language})
    .then(result=>{//result is an array of objects
      res.render('newWord',{translatedWord: "...", engWord: "type your word here", dictionary: result, language: req.session.user.language})
    })
  },
  newWord: function(req,res){
    knex("words")
    .where({user_id: req.session.user.id})
    .where({language: req.session.user.language})//this should load the page with only words from the current session language??? not working
    .then(result=>{//result is an array of objects\
      async function getWord(word =req.body.inputWord,language= req.session.user.language){
        let newWord = await translator(word,language)
        res.render('newWord', {translatedWord:newWord, engWord:word, dictionary:result, language: req.session.user.language})
      }
      getWord();
    })
     

  },
  saveWord: function(req, res){
    let translatedWord = req.body.outputWord;
    if(translatedWord=="..."){
      res.redirect('/spanish/newWord')
    }
    else{
      let englishWord = req.body.inputWord;
      knex("users").where({email: req.session.user.email}).then(rows=>{
        let userID = rows[0].id;
        knex("words").insert({//should check if we already have the word & same translation in db
          word: englishWord,
          translation: translatedWord,
          user_id: userID,
          language: req.session.user.language,
          count: 0,
          status: 'blue'
        }).then(result=>{
          res.redirect('/spanish/newWord');
        })
        .catch(err=>console.log(err));
      })
      .catch(err=>console.log(err));
    }
  },

  train: function(req,res){
      if (req.body.inputWord === req.body.answer ) {
        knex('words').where({id: req.body.hiddenWord}).then(rows=>{
          if(rows[0].count==2){
            knex('words').where({id: req.body.hiddenWord}).update({
              count: rows[0].count+1,
              status: 'green'
            })
            .update('updated_at', knex.fn.now())
            .catch(err=>console.log(err));
          }
          else if(rows[0].count==0){
            if(rows[0].status=='blue'){
              knex('words').where({id: req.body.hiddenWord}).update({
                count: rows[0].count+1,
                status: 'green'
              })
              .update('updated_at', knex.fn.now())
              .catch(err=>console.log(err));
            }
            else{
              knex('words').where({id: req.body.hiddenWord}).update({
                count: rows[0].count+1,
                status: 'yellow'
              })
            .update('updated_at', knex.fn.now())
            .catch(err=>console.log(err));
            }
          }
          else {
            knex('words').where({id: req.body.hiddenWord}).update({
              count: rows[0].count+1
            })
            .update('updated_at', knex.fn.now())
            .catch(err=>console.log(err));
          }
        })
        .then(result=>{
          req.session.save(function(err){
            if(err){
              console.error(err);
            }
            res.redirect("/spanish/train");
  
          })
        })
        
      }
      else{
        knex('words').where({id: req.body.hiddenWord}).then(rows=>{
          knex('words').where({id: req.body.hiddenWord}).update({
            count: 0,
            status: 'red'
          })
          .update('updated_at', knex.fn.now())
          .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
        req.session.save(function(err){
          if(err){
            console.error(err);
          }
          res.redirect("/spanish/train");
        })
      }
  },

  logout: function(req,res){

  }
}
