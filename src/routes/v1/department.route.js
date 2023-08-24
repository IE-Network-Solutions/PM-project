




const express = require('express');
const validate = require('../../middlewares/validate');
const { departmentValidation } = require('../../validations');
const { departmentController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(validate(departmentValidation.getDepartments), departmentController.getDepartments);

router
    .route('/:departmentId')
    .get(validate(departmentValidation.getDepartment), departmentController.getDepartmentById)


module.exports = router;

