import { FIELDS, CATEGORY_WEIGHTS, ANSWER_OPTIONS } from '../data/fields';

export const calculateScores = (answers) => {
  const scores = {};
  let totalWeightedScore = 0;
  let hasExclusionFail = false;
  let exclusionFailures = [];
  let totalAnswered = 0;
  let totalFields = 0;

  FIELDS.exclusion.forEach(field => {
    if (answers[field.id] === 'no') {
      hasExclusionFail = true;
      exclusionFailures.push(field.label);
    }
  });

  Object.entries(FIELDS).forEach(([category, fields]) => {
    totalFields += fields.length;
    
    if (category === 'exclusion') {
      const answered = fields.filter(f => answers[f.id]).length;
      totalAnswered += answered;
      scores[category] = hasExclusionFail ? 0 : (answered === fields.length ? 100 : 50);
      return;
    }

    let categoryScore = 0;
    let totalWeight = 0;

    fields.forEach(field => {
      const answer = answers[field.id];
      if (answer) {
        totalAnswered++;
        const option = ANSWER_OPTIONS.find(o => o.value === answer);
        categoryScore += option.score * (field.weight || 1);
        totalWeight += field.weight || 1;
      }
    });

    if (totalWeight > 0) {
      scores[category] = (categoryScore / totalWeight) * 100;
      totalWeightedScore += scores[category] * CATEGORY_WEIGHTS[category];
    } else {
      scores[category] = null;
    }
  });

  const overallScore = hasExclusionFail ? 0 : totalWeightedScore;
  const completionPercent = Math.round((totalAnswered / totalFields) * 100);
  
  return {
    categoryScores: scores,
    overallScore,
    hasExclusionFail,
    exclusionFailures,
    completionPercent,
    recommendation: hasExclusionFail ? 'NO-GO' : 
      overallScore >= 80 ? 'GO' :
      overallScore >= 60 ? 'CONDITIONAL GO' :
      overallScore >= 40 ? 'REVIEW REQUIRED' : 'NO-GO'
  };
};

export const getFieldLabel = (fieldId) => {
  for (const fields of Object.values(FIELDS)) {
    const field = fields.find(f => f.id === fieldId);
    if (field) return field.label;
  }
  return fieldId;
};
