const express = require('express');
//const validate = require('../../middlewares/validate');
////const { resourceHistoryValidation } = require('../../validations');
const authPermision = require('../../middlewares/authPermissionStore');

const { stakholderController } = require('../../controllers');

const router = express.Router();

router.route('/').post(authPermision.addProjectStakHolderMiddleware, stakholderController.createStakHolder);

router.route('/').get(stakholderController.getStakHolders);
router.route('/:id').get(stakholderController.getStakHoldersById);

router.route('/:id').delete(authPermision.deleteProjectStakeholderMiddleware, stakholderController.deleteStakHoldersById);

router.route('/:id').patch(authPermision.editProjectStakeholderMiddleware, stakholderController.updateStakHoldersById);

router.route('/project/:project_id').get(stakholderController.getStakHoldersByProject_Id);
module.exports = router;
