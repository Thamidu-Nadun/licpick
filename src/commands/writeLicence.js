import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeLicence = async (options) => {
    const { licence: licenceName } = options;
    if (!licenceName) {
        console.error(chalk.red("Please provide a licence name to write using the -l or --licence option."));
        return;
    }

    if (!/^[a-zA-Z0-9_.\-]+$/.test(licenceName)) {
        console.error(chalk.red("Invalid licence name. Only letters, numbers, underscores, hyphens, and dots are allowed."));
        return;
    }

    const licenceFilePath = path.join(__dirname, "..", "templates", "licence", `${licenceName}.txt`);
    const licenceSnippetPath = path.join(__dirname, "..", "templates", "snippet", `${licenceName}.txt`);

    if (!fs.existsSync(licenceFilePath)) {
        console.error(chalk.red(`Licence template '${licenceName}' does not exist in the templates directory.`));
        return;
    }

    try {
        const answer = await inquirer.prompt([{
            type: "input",
            name: "userName",
            message: "Enter your name for the license (or leave blank for public domain):"
        }]);
        var userName = answer.userName || "Public Domain";
    } catch (error) {
        if (error.isTtyError || error.message.includes("User force closed the prompt")) {
            console.log(chalk.yellow("\nOperation cancelled."));
            process.exit(0);
        }
    }

    if (fs.existsSync(licenceSnippetPath)) {
        console.warn(chalk.yellow(`A snippet for '${licenceName}' already exists. It will be overwritten.`));
    };

    let licenceContent = fs.readFileSync(licenceFilePath, "utf-8");
    let licenceSnippet = fs.readFileSync(licenceFilePath, "utf-8");

    licenceContent = licenceContent.replaceAll("[fullname]", userName).replaceAll("[year]", new Date().getFullYear());
    licenceSnippet = licenceSnippet.replaceAll("[fullname]", userName).replaceAll("[year]", new Date().getFullYear());

    const outputPath = path.join(process.cwd(), "LICENSE");
    const snippetOutputPath = path.join(process.cwd(), 'licence-header.txt');

    try {
        fs.writeFileSync(outputPath, licenceContent, "utf-8");
        console.log(chalk.green(`Successfully wrote ${licenceName} license to ${outputPath}.`));
    } catch (error) {
        console.error(chalk.red("Failed to write LICENSE file:"));
        console.error(error);
    }

    try {
        fs.writeFileSync(snippetOutputPath, licenceSnippet, "utf-8");
        console.log(chalk.green(`Successfully wrote ${licenceName} license snippet to ${snippetOutputPath}.`));
    } catch (error) {
        console.error(chalk.red("Failed to write licence snippet file:"));
        console.error(error);
    }
}

export default writeLicence;