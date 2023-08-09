// module.exports.riskImpactkMatrixRules = [

//     { impact: 'Very-High', probability: 'Very-High', rating: 'Critical' },
//     { impact: 'High', probability: 'Very-High', rating: 'Critical' },
//     { impact: 'Medium', probability: 'Very-High', rating: 'Severe' },
//     { impact: 'Low', probability: 'Very-High', rating: 'Severe' },
//     { impact: 'Very-Low', probability: 'Very-High', rating: 'Critical' },

//     { impact: 'Very-High', probability: 'High', rating: 'Critical' },
//     { impact: 'High', probability: 'High', rating: 'Critical' },
//     { impact: 'Medium', probability: 'High', rating: 'Severe' },
//     { impact: 'Low', probability: 'High', rating: 'Moderate' },
//     { impact: 'Very-Low', probability: 'High', rating: 'Sustainable' },

//     { impact: 'Very-High', probability: 'Medium', rating: 'Critical' },
//     { impact: 'High', probability: 'Medium', rating: 'Severe' },
//     { impact: 'Medium', probability: 'Medium', rating: 'Moderate' },
//     { impact: 'Low', probability: 'Medium', rating: 'Moderate' },
//     { impact: 'Very-Low', probability: 'Medium', rating: 'Sustainable' },

//     { impact: 'Very-High', probability: 'Low', rating: 'Critical' },
//     { impact: 'High', probability: 'Low', rating: 'Severe' },
//     { impact: 'Medium', probability: 'Low', rating: 'Moderate' },
//     { impact: 'Low', probability: 'Low', rating: 'Sustainable' },
//     { impact: 'Very-Low', probability: 'Low', rating: 'Sustainable' },

//     { impact: 'Very-High', probability: 'Very-Low', rating: 'Severe' },
//     { impact: 'High', probability: 'Very-Low', rating: 'Moderate' },
//     { impact: 'Medium', probability: 'Very-Low', rating: 'Sustainable' },
//     { impact: 'Low', probability: 'Very-Low', rating: 'Sustainable' },
//     { impact: 'Very-Low', probability: 'Very-Low', rating: 'Sustainable' },
// ];

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

// module.exports.residualRiskResidualImpactMatrixRules = [

//     { residualImpact: 'Very-High', residualProbability: 'Very-High', rating: 'Critical' },
//     { residualImpact: 'High', residualProbability: 'Very-High', rating: 'High' },
//     { residualImpact: 'Medium', residualProbability: 'Very-High', rating: 'Critical' },
//     { residualImpact: 'Low', residualProbability: 'Very-High', rating: 'High' },
//     { residualImpact: 'Very-Low', residualProbability: 'Very-High', rating: 'Critical' },

//     { residualImpact: 'Very-High', residualProbability: 'High', rating: 'Critical' },
//     { residualImpact: 'High', residualProbability: 'High', rating: 'High' },
//     { residualImpact: 'Medium', residualProbability: 'High', rating: 'Critical' },
//     { residualImpact: 'Low', residualProbability: 'High', rating: 'High' },
//     { residualImpact: 'Very-Low', residualProbability: 'High', rating: 'Critical' },

//     { residualImpact: 'Very-High', residualProbability: 'Medium', rating: 'Critical' },
//     { residualImpact: 'High', residualProbability: 'Medium', rating: 'High' },
//     { residualImpact: 'Medium', residualProbability: 'Medium', rating: 'Critical' },
//     { residualImpact: 'Low', residualProbability: 'Medium', rating: 'High' },
//     { residualImpact: 'Very-Low', residualProbability: 'Medium', rating: 'Critical' },

//     { residualImpact: 'Very-High', residualProbability: 'Low', rating: 'Critical' },
//     { residualImpact: 'High', residualProbability: 'Low', rating: 'High' },
//     { residualImpact: 'Medium', residualProbability: 'Low', rating: 'Critical' },
//     { residualImpact: 'Low', residualProbability: 'Low', rating: 'Highs' },
//     { residualImpact: 'Very-Low', residualProbability: 'Low', rating: 'Critical' },

//     { residualImpact: 'Very-High', residualProbability: 'Very-Low', rating: 'Critical' },
//     { residualImpact: 'High', residualProbability: 'Very-Low', rating: 'High' },
//     { residualImpact: 'Medium', residualProbability: 'Very-Low', rating: 'Critical' },
//     { residualImpact: 'Low', residualProbability: 'Very-Low', rating: 'High' },
//     { residualImpact: 'Very-Low', residualProbability: 'Very-Low', rating: 'Critical' },
// ];