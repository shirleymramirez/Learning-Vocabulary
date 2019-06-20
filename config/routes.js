//Update the name of the controller below and rename the file.
const learningVocab = require("../controllers/learningVocab.js")

module.exports = function(app){
  app.get('/login', learningVocab.loginPage)
  app.post('/login', learningVocab.login)
  app.get('/register', learningVocab.register)
  app.post('/register', learningVocab.newUser)
  app.post('/post', learningVocab.newUser)
  app.use(authenticateUser);
  app.get('/', learningVocab.index);
  app.get('/train', learningVocab.trainingPage)
  app.get('/newWord', learningVocab.wordForm)
  app.post('/newWord', learningVocab.newWord)
  app.post('/saveWord', learningVocab.saveWord)
  app.post('/updateWord', learningVocab.updateWord)
  app.post('/train', learningVocab.train)
  app.post('/deleteWord', learningVocab.deleteWord)
  app.get('/logout', learningVocab.logout)

}

function authenticateUser(req,res,next){
  if (!req.session.user){
    res.redirect("/login")
  }
  else{
    next();
  }
}