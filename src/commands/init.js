import inquirer from "inquirer";
import chalk from "chalk";
import licenses from "../licenses.js";
import advancedLicence from "../plugins/advancedLicence.js";
import recommend from "../engine.js";
import questions from "../questions.js";
import writeLicence from '../utils/writeLicence.js';

export default async function init(options) {
    const { debug, advanced } = options || {};

    console.log(chalk.cyanBright.bold("\n📋 LICENSE INITIALIZATION\n"));
    if (debug) {
        console.log(chalk.magentaBright("🔍 Debug mode enabled. Detailed reasoning will be shown."));
    }
    if (advanced) {
        console.log(chalk.yellowBright("⭐ Advanced mode enabled. Additional licenses included."));
    }

    inquirer.prompt(questions).then(async (answers) => {
        console.log(chalk.greenBright("✓ License information collected successfully!"));
        if (debug) {
            console.log(chalk.magentaBright("\n🔍 Your Answers:"));
            let answersTable = Object.fromEntries(Object.entries(answers).map(([feature, enabled]) => [
                feature,
                enabled ? '✅' : '❌'
            ]));
            console.table(answersTable);
        }

        let allLicenses;
        if (advanced) {
            console.log(chalk.yellowBright("⭐ Advanced license options enabled. Including additional licenses."));
            allLicenses = licenses.concat(advancedLicence);
        } else {
            allLicenses = licenses;
        }
        // Get license recommendations based on user answers
        const results = recommend(allLicenses, answers);

        // Display detailed reasoning if debug mode is enabled
        if (debug) {
            console.log(chalk.magentaBright("\n🏆 Top License Recommendations:"));
            results.forEach((res, index) => {
                console.log(chalk.cyanBright(`\n${index + 1}. ${res.name} (Score: ${res.score})`));

                if (res.reasons.length > 0) {
                    console.log(chalk.blueBright("📝 Reasons:"));
                    let reasons = [...new Set(res.reasons)];
                    reasons.forEach(reason => console.log(`  ${chalk.gray("→")} ${reason}`));
                }
            });
        }

        // Display the best recommendation
        const best = results[0];
        console.log(chalk.bgMagenta.white.bold(`\n 🎯 RECOMMENDED: ${best.name} `));

        if (best.reasons.length > 0) {
            console.log(chalk.blueBright("\n📝 Why this license:"));
            let uniqueReasons = [...new Set(best.reasons)];
            uniqueReasons.forEach(reason => console.log(`  ${chalk.greenBright("✓")} ${reason}`));
        }

        // write the recommended license to a file
        const licenceWritable = await inquirer.prompt([
            {
                type: "input",
                name: "userName",
                message: chalk.cyan("👤 Enter your name for the license (or leave blank for public domain):")
            },
            {
                type: "confirm",
                name: "write",
                message: chalk.cyan(`📝 Write the ${chalk.bold(best.name)} license to a LICENSE file?`)
            }
        ]);
        console.log("\n");
        if (licenceWritable.write) {
            try {
                writeLicence(best.id, licenceWritable.userName || "Public Domain");
            } catch (error) {
                console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to write LICENSE file:"));
                console.error(error);
            }
        }

    }).catch((error) => {
        // Exit gracefully if user cancels with Ctrl+C
        if (error.isTtyError || error.message.includes("User force closed the prompt")) {
            console.log(chalk.yellow("\n⊘ Operation cancelled."));
            process.exit(0);
        }
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to collect license information:"));
        console.error(error);
        process.exit(1);
    });
} 