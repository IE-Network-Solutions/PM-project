const Joi = require('joi');
/**
 * @module officeBudget
*/
/**
 * Schema for the office quarterly budget.
 * @type {object}
 * @property {number} budgetAmount - The budget amount.
 * @property {Date} from - Start date of the budget period.
 * @property {Date} to - End date of the budget period.
 * @property {string} budgetCategoryId - ID of the budget category.
 * @property {string} currencyId - ID of the currency.
 * @property {string} projectId - ID of the project.
 */
const officequarterlyBudgetSchema = Joi.object({
    budgetAmount: Joi.number().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    budgetCategoryId: Joi.string().required(),
    currencyId: Joi.string().required(),
    projectId: Joi.string().required(),
});


const officequarterlyBudgetUpdateSchema = Joi.object({
    budgetAmount: Joi.number().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    budgetCategoryId: Joi.string().required(),
    currencyId: Joi.string().required(),
    projectId: Joi.string().required(),
    id:Joi.string().required(),
});
/**
 * Schema for creating a budget.
 * @type {object}
 * @property {object} body - Request body.
 * @property {array} body.budgetsData - Array of budget data.
 * @property {Date} body.from - Start date for the budget.
 * @property {Date} body.to - End date for the budget.
 */
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

/**
 * Schema for retrieving budget data.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number.
 */
const getBudget = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Schema for retrieving budget data by project ID and date range.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project.
 * @property {Date} params.from - Start date for the budget.
 * @property {Date} params.to - End date for the budget.
 */
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
/**
 * Schema for updating budget data.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.id - ID of the budget.
 * @property {object} body - Request body.
 * @property {array} body.budgetsData - Array of updated budget data.
 * @property {string} body.from - Start date for the budget (as a string).
 * @property {string} body.to - End date for the budget (as a string).
 */
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
            budgetAmount: Joi.number().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
            budgetCategoryId: Joi.string().required(),
            currencyId: Joi.string().required(),
            projectId: Joi.string().required(),
            id:Joi.string().required(),
        })
        .min(1),
};
/**
 * Schema for deleting budget data.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.id - ID of the budget to delete.
 */
const deleteBudget = {
    params: Joi.object().keys({
        id: Joi.required(),
    }),
    body: Joi.object()
    .keys({
   
        id:Joi.string().required(),
    })
    .min(1),
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
