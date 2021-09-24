const { Router } = require('express');
const router = Router();

router.use('/users', require('./users'));
router.use('/contacts', require('./contacts'));

module.exports = router;
