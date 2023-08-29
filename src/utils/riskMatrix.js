const MatrixRules = [
    ['Very-High', 'Very-High', 'Critical'],
    ['High', 'Very-High', 'Critical'],
    ['Medium', 'Very-High', 'Severe'],
    ['Low', 'Very-High', 'Severe'],
    ['Very-Low', 'Very-High', 'Critical'],

    ['Very-High', 'High', 'Critical'],
    ['High', 'High', 'Critical'],
    ['Medium', 'High', 'Severe'],
    ['Low', 'High', 'Moderate'],
    ['Very-Low', 'High', 'Sustainable'],

    ['Very-High', 'Medium', 'Critical'],
    ['High', 'Medium', 'Severe'],
    ['Medium', 'Medium', 'Moderate'],
    ['Low', 'Medium', 'Moderate'],
    ['Very-Low', 'Medium', 'Sustainable'],

    ['Very-High', 'Low', 'Critical'],
    ['High', 'Low', 'Severe'],
    ['Medium', 'Low', 'Moderate'],
    ['Low', 'Low', 'Sustainable'],
    ['Very-Low', 'Low', 'Sustainable'],

    ['Very-High', 'Very-Low', 'Severe'],
    ['High', 'Very-Low', 'Moderate'],
    ['Medium', 'Very-Low', 'Sustainable'],
    ['Low', 'Very-Low', 'Sustainable'],
    ['Very-Low', 'Very-Low', 'Sustainable'],
];

module.exports.mapRiskRate = (impact, probability) => {
    const result = MatrixRules.find(rule => rule[0] === impact && rule[1] === probability);
    return result ? result[2] : null;
};

const residualMatrixRules = [
    ['Very-High', 'Very-High', 'Critical'],
    ['High', 'Very-High', 'Critical'],
    ['Medium', 'Very-High', 'Severe'],
    ['Low', 'Very-High', 'Severe'],
    ['Very-Low', 'Very-High', 'Critical'],

    ['Very-High', 'High', 'Critical'],
    ['High', 'High', 'Critical'],
    ['Medium', 'High', 'Severe'],
    ['Low', 'High', 'Moderate'],
    ['Very-Low', 'High', 'Sustainable'],

    ['Very-High', 'Medium', 'Critical'],
    ['High', 'Medium', 'Severe'],
    ['Medium', 'Medium', 'Moderate'],
    ['Low', 'Medium', 'Moderate'],
    ['Very-Low', 'Medium', 'Sustainable'],

    ['Very-High', 'Low', 'Critical'],
    ['High', 'Low', 'Severe'],
    ['Medium', 'Low', 'Moderate'],
    ['Low', 'Low', 'Sustainable'],
    ['Very-Low', 'Low', 'Sustainable'],

    ['Very-High', 'Very-Low', 'Severe'],
    ['High', 'Very-Low', 'Moderate'],
    ['Medium', 'Very-Low', 'Sustainable'],
    ['Low', 'Very-Low', 'Sustainable'],
    ['Very-Low', 'Very-Low', 'Sustainable'],
];

module.exports.residualMapRiskRate = (residualImpact, residualProbability) => {
    const result = residualMatrixRules.find(rule => rule[0] === residualImpact && rule[1] === residualProbability);
    return result ? result[2] : null;
};
