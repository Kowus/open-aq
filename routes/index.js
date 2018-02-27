const express = require('express'),
  router = express.Router(),
  passport = require('passport')
  ;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile', function (req, res, next) {
  res.redirect('/');
});
router.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));


module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/profile');
  else
    return next();
}

function needsGroup(group) {
  return function (req, res, next) {
    if (req.user && req.user.group === group) {
      res.locals.user = req.user;
      next();
    }
    else {
      req.session.message = "Unauthorized Access";
      res.status(401).redirect(`/login?next=${req.originalUrl}`);
    }
  };
}
