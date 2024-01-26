const express = require('express');
const { Quality } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(Quality.createQuality);

router.route('/:id')
    .get(Quality.getProjectByIdForQualityChecking)

module.exports = router;
