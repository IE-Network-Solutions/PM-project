const express = require('express');
const router = express.Router();
const { Evalution } = require('../../controllers');

router
    .route('/')
    .post(Evalution.createEvalution)
    .get(Evalution.getEvalutions);

router.route("/:id")
    .get(Evalution.getEvalution);

router.route("/edit")
    .patch(Evalution.updateEvalution);

router.route("/get-evalution-by-milestone-id/:id")
    .get(Evalution.getEvalutionByMilestoneId)
router.route("/send-to-doo/:id")
    .patch(Evalution.sendToDOO);
router.route('/export-evaluation-to-excel-per-milestone/:id')
    .get(Evalution.exportEvaluationToExcelPerMilestone);

router.route('/export-evaluation-to-excel-per-project/:id')
    .get(Evalution.exportEvaluationToExcelPerProject)

router.route('/get-sent-milestones-by-manager/project')
    .get(Evalution.getSentMilestonesByManager)


module.exports = router

