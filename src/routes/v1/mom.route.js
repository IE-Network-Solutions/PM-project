const express = require('express');
const validate = require('../../middlewares/validate');
const { momValidation } = require('../../validations');
const { momController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');
const router = express.Router();

router
  .route('/')
  .post(authPermision.addProjectMomMiddleware, validate(momValidation.createMom), momController.createMom)
  .get(validate(momValidation.getMoms), momController.getMoms);

router.route('/project/:projectId').get(validate(momValidation.getByProject), momController.getByProject);

router
  .route('/:momId')
  .get(validate(momValidation.getMom), momController.getMom)
  .patch(authPermision.editProjectMomMiddleware, validate(momValidation.updateMom), momController.updateMom)
  .delete(authPermision.deleteProjectMomMiddleware, validate(momValidation.deleteMom), momController.deleteMom);

router.route('/comment').post(validate(momValidation.addComment), momController.addComment);

router.route('/comment/:momId').get(validate(momValidation.getComments), momController.getComments);
router.route('/getAllMOM/groupByProject').get(momController.groupMOMByProject);

module.exports = router;
