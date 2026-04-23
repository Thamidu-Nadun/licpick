export const score = (licence, answers) => {
    let score = 0;
    let reasons = [];

    for (const answer in answers) {
        if (licence.traits[answer] === undefined) continue;

        if (licence.traits[answer] === answers[answer]) {
            score += licence.weight[answer] || 1;
            reasons.push(...licence.explain);
        } else {
            score -= licence.weight[answer] || 1;
        }
    }

    return { score, reasons };
}

const recommend = (licences, answers) => {
    const result = licences.map(licence => {
        const res = score(licence, answers);
        return {
            ...licence,
            score: res.score,
            reasons: res.reasons
        }
    });

    return result.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default recommend;