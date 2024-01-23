const Joi = require('joi');

const officequarterlyBudgetSchema = Joi.object({
    budgetAmount: Joi.number().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    budgetCategoryId: Joi.string().required(),
    currencyId: Joi.string().required(),
    projectId: Joi.string().required(),
});







const createBudget = {
    body: Joi.object().keys({
        // budgetAmount: Joi.number().required(),
        // from: Joi.date(),
        // to: Joi.date(),
        // budgetCategoryId: Joi.string().required(),
        // currencyId: Joi.string().required(),
        // projectId: Joi.string().required(),
        budgetsData: Joi.array().items(officequarterlyBudgetSchema).required(),
        from: Joi.date().required(),
        to: Joi.date().required(),

    })

};


const getBudget = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getBudgetByProject = {
    params: Joi.object().keys({
        projectId: Joi.required(),
        from: Joi.required(),
        to: Joi.required(),
    }),
};

// const getByProject = {
//     params: Joi.object().keys({
//         projectId: Joi.required(),
//     }),
// };







const updateBudget = {
    params: Joi.object().keys({
        id: Joi.required(),
    }),
    body: Joi.object()
        .keys({
            // name: Joi.string(),
            // budgetAmount: Joi.number(),
            // from: Joi.date(),
            // to: Joi.date(),
            // projectId: Joi.string(),
            // currencyId: Joi.string(),
            // budgetCategoryId: Joi.string(),

            budgetsData: Joi.array().items(officequarterlyBudgetSchema).required(),
            from: Joi.string().required(),
            to: Joi.string().required(),
        })
        .min(1),
};

const deleteBudget = {
    params: Joi.object().keys({
        id: Joi.required(),
    }),
};

module.exports = {
    createBudget,
    getBudget,
    getBudgetByProject,
    deleteBudget,
    updateBudget
    // getPaymentTerm,
    // getByProject,
    // updatePaymentTerm,
    // deletePaymentTerm
};
