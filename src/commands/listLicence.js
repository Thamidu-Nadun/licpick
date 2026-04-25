import chalk from "chalk";
import licenses from "../licenses.js";
import advancedLicence from "../plugins/advancedLicence.js";

const listLicences = () => {
    const allLicenses = [...licenses, ...advancedLicence];
    console.log(chalk.cyanBright.bold(`\n📚 Available Licenses: ${chalk.greenBright(allLicenses.length)}\n`));
    allLicenses.forEach((license, index) => {
        console.log(chalk.white(`  ${chalk.dim(String(index + 1).padStart(2, ' '))}. ${chalk.cyanBright(license.name)} ${chalk.dim(`(${license.id})`)}`));
    });
    console.log();
}

export default listLicences;