import inquirer from "inquirer";
import chalk from "chalk";
import licenses from "../licenses.js";
import advancedLicence from "../plugins/advancedLicence.js";
import recommend from "../engine.js";
import questions from "../questions.js";
import writeLicence from '../utils/writeLicence.js';

export default async function init(options) {
    const { debug } = options || {};

    console.log(chalk.cyan("LICENCE INIT"));
    if (debug) {
        console.log(chalk.magenta("Debug mode enabled. Detailed reasoning will be shown."));
    }

    inquirer.prompt(questions).then(async (answers) => {
        console.log(chalk.green("License information collected successfully!"));
        if (debug) {
            console.log(chalk.magenta("Your Answers:"));
            console.log(answers);
        }

        const allLicenses = [...licenses, ...advancedLicence];
        // Get license recommendations based on user answers
        const results = recommend(allLicenses, answers);

        // Display detailed reasoning if debug mode is enabled
        if (debug) {
            console.log(chalk.magenta("\nTop License Recommendations:"));
            results.forEach((res, index) => {
                console.log(chalk.yellow(`\n${index + 1}. ${res.name} (Score: ${res.score})`));

                if (res.reasons.length > 0) {
                    console.log(chalk.blue("Reasons:"));
                    res.reasons.forEach(reason => console.log(`  • ${reason}`));
                }
            });
        }

        // Display the best recommendation
        const best = results[0];
        console.log(chalk.magentaBright(`\nRecommended License: ${best.name}`));

        if (best.reasons.length > 0) {
            console.log(chalk.blue("Reasons:"));
            best.reasons.forEach(reason => console.log(`  ${chalk.green("✔")} ${chalk.dim(reason)}`));
        }

        // write the recommended license to a file
        const licenceWritable = await inquirer.prompt([
            {
                type: "input",
                name: "userName",
                message: "Enter your name for the license (or leave blank for public domain):"
            },
            {
                type: "confirm",
                name: "write",
                message: `Do you want to write the ${best.name} license to a LICENSE file?`
            }
        ]);
        if (licenceWritable.write) {
            try {
                writeLicence(best.id, licenceWritable.userName || "Public Domain");
            } catch (error) {
                console.error(chalk.red("Failed to write LICENSE file:"));
                console.error(error);
            }
        }


    }).catch((error) => {
        console.error(chalk.red("An error occurred while collecting license information:"));
        console.error(error);
    });
} 