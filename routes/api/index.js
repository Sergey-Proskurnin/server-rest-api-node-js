const { Router } = require('express');
const router = Router();
const path = require("path");

router.use('/users', require('./users'));
router.use('/contacts', require('./contacts'));
router.use('/privacy-policy', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../public/privacy-policy.html'));
});
    
module.exports = router;
