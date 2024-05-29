'use strict'
const express = require('express');
const { apikey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apikey
router.use(apikey);

// check permission
router.use(permission('000'));

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

// router.get('/', (req, res,next) => {
//     return res.status(200).json(
//         { message: 'Hello World' }
//     );
// })
module.exports = router;