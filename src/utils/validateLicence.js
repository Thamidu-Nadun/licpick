const validateLicence = (licence) => {
    const errors = [];

    // validate licence id
    if (!/^[a-z0-9.\-]+$/.test(licence.id)) {
        errors.push("Licence must have a valid 'id' (string).");
    }

    // validate licence name
    if (typeof licence.name !== "string" || licence.name.trim() === "") {
        errors.push("Licence must have a valid 'name' (non-empty string).");
    }

    // validate traits
    if (typeof licence.traits !== "object" || licence.traits === null) {
        errors.push("Licence must have a valid 'traits' object.");
    }

    // validate weight
    const weights = licence.weight || {};
    for (const w in weights) {
        const val = weights[w];

        if (!Number.isFinite(val) || val < 0 || val > 10) {
            errors.push(`Weight for '${w}' must be a number between 0 and 10.`);
        }
    }

    // validate explain
    if (!Array.isArray(licence.explain) || licence.explain.some(e => typeof e !== "string")) {
        errors.push("Licence must have a valid 'explain' array of strings.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

export default validateLicence;