import chalk from "chalk";
import licenses from "../licenses.js";
import advancedLicence from "../plugins/advancedLicence.js";

const listLicences = () => {
    const allLicenses = [...licenses, ...advancedLicence];
    console.log(`${chalk.cyan("Available Licenses:")} ${chalk.greenBright(licenses.length)}\n`);
    allLicenses.forEach((license, index) => {
        console.log(chalk.yellow(`${index + 1}. ${license.name} (${license.id})`));
    });
}

export default listLicences;