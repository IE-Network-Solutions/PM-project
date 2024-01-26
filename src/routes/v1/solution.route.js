const express = require('express');
const { Solution } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(Solution.getSolutions)
    .post(Solution.createSolution);

router
    .route("/:id")
    .get(Solution.getSolution)
    .delete(Solution.deleteSolution)
    .patch(Solution.updateSolution)

module.exports = router;