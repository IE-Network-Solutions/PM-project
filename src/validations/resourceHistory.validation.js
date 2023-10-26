const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createResourceHistory = {
    body: Joi.object().keys({
         action: Joi.string().required(),
        projectId: Joi.string().required(),
        taskId: Joi.string().required(),
        userId: Joi.string().required(),
        

    }),
    
};


module.exports = {
    createResourceHistory,
   
};
