import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import licenses from "../licenses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeLicence = async (options) => {
    let { licence: licenceName } = options;
    if (!licenceName) {
        try {
            const licenceAnswer = await inquirer.prompt([
                {
                    type: "select",
                    name: "licenceId",
                    message: chalk.cyan("📜 Select a licence to write:"),
                    loop: false,
                    choices: licenses.map(licence => ({
                        name: `${licence.name} ${chalk.dim(`(${licence.id})`)}`,
                        value: licence.id
                    }))
                }
            ]);
            licenceName = licenceAnswer.licenceId;
            console.log(chalk.green(`✓ Selected licence: ${chalk.bold(licenceName)}`));
        } catch (error) {
            if (error.isTtyError || error.message.includes("User force closed the prompt")) {
                console.log(chalk.yellow("\n⊘ Operation cancelled."));
                process.exit(0);
            }
            console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to select a licence:"));
            console.error(error);
            return;
        }
    };


    if (!/^[a-zA-Z0-9_.\-]+$/.test(licenceName)) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + " Invalid licence name. Only letters, numbers, underscores, hyphens, and dots are allowed.");
        return;
    }

    const licenceFilePath = path.join(__dirname, "..", "templates", "licence", `${licenceName}.txt`);
    const licenceSnippetPath = path.join(__dirname, "..", "templates", "snippet", `${licenceName}.txt`);

    if (!fs.existsSync(licenceFilePath)) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` Licence template '${licenceName}' does not exist in the templates directory.`));
        return;
    }

    try {
        const answer = await inquirer.prompt([{
            type: "input",
            name: "userName",
            message: chalk.cyan("👤 Enter your name for the license (or leave blank for public domain):")
        }]);
        var userName = answer.userName || "Public Domain";
    } catch (error) {
        if (error.isTtyError || error.message.includes("User force closed the prompt")) {
            console.log(chalk.yellow("\n⊘ Operation cancelled."));
            process.exit(0);
        }
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to get user input:"));
        console.error(error);
        return;
    }

    if (fs.existsSync(licenceSnippetPath)) {
        console.warn(chalk.yellow(`⚠ A snippet for '${licenceName}' already exists. It will be overwritten.`));
    };

    let licenceContent = fs.readFileSync(licenceFilePath, "utf-8");
    let licenceSnippet = fs.readFileSync(licenceSnippetPath, "utf-8");

    licenceContent = licenceContent.replaceAll("[fullname]", userName).replaceAll("[year]", new Date().getFullYear());
    licenceSnippet = licenceSnippet.replaceAll("[fullname]", userName).replaceAll("[year]", new Date().getFullYear());

    const outputPath = path.join(process.cwd(), "LICENSE");
    const snippetOutputPath = path.join(process.cwd(), 'licence-header.txt');

    try {
        fs.writeFileSync(outputPath, licenceContent, "utf-8");
        console.log(chalk.green(`✓ Successfully wrote ${chalk.bold(licenceName)} license to ${chalk.underline(outputPath)}`));
    } catch (error) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to write LICENSE file:"));
        console.error(error);
    }

    try {
        fs.writeFileSync(snippetOutputPath, licenceSnippet, "utf-8");
        console.log(chalk.green(`✓ Successfully wrote ${chalk.bold(licenceName)} license snippet to ${chalk.underline(snippetOutputPath)}`));
    } catch (error) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Failed to write licence snippet file:"));
        console.error(error);
    }
}

export default writeLicence;