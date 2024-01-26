const express = require('express');
const { CheckList } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(CheckList.getCheckLists)
    .post(CheckList.createChecklist);

router
    .route("/:id")
    .get(CheckList.getCheckList)
    .delete(CheckList.deleteCheckList)
    .patch(CheckList.updateCheckList)

router.route("/get-check-list/:id")
    .get(CheckList.getCheckListByMilestoneId)

module.exports = router;