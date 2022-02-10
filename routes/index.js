const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { Err404 } = require('../errors/Err404');

router.use(require('./noAuth'));

// routes requiring authorization:
router.use(auth);
router.use(require('./users'));
router.use(require('./movies'));

router.use('*', (req, res, next) => {
  next(new Err404('Page not found'));
});

module.exports = router;
