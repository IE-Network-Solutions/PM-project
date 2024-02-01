const express = require('express');
const { Criteria } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(Criteria.getCriterias)
    .post(Criteria.createCriteria);

router
    .route("/:id")
    .get(Criteria.getCriteria)
    .delete(Criteria.deleteCriteria)
    .patch(Criteria.updateCriteria)

module.exports = router;