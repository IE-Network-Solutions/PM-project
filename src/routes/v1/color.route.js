const express = require('express');
const { Color } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(Color.getColors)
    .post(Color.createColor);

router
    .route("/:id")
    .get(Color.getColor)
    .delete(Color.deleteColor)
    .patch(Color.updateColor)

module.exports = router;