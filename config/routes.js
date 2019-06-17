//Update the name of the controller below and rename the file.
const learningVocab = require("../controllers/learningVocab.js")

module.exports = function(app){
  app.get('/login', learningVocab.loginPage)
  app.post('/login', learningVocab.login)
  app.get('/register', learningVocab.register)
  app.post('/post', learningVocab.newUser)
  app.use(authenticateUser);
  app.get('/', learningVocab.index);
  app.get('/:language/train', learningVocab.trainingPage)//thoughts?
  app.get('/:language/newWord', learningVocab.wordForm)//thoughts?
  app.post('/:language/newWord', learningVocab.newWord)
  app.post('/:language/train', learningVocab.train)
  app.post('/logout', learningVocab.logout)

}

function authenticateUser(req,res,next){
  if(!req.session.user){
    res.redirect("/login")
  }
  else{
    next();
  }
}