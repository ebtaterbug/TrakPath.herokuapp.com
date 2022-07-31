const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const deviceRoutes = require('./device-routes.js');
const alertRoutes = require('./alert-routes.js');

router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/alerts', alertRoutes);

module.exports = router;