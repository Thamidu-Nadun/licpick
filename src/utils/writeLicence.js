import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeLicence = (licenceId, userName) => {
    const licencePath = path.join(__dirname, '../templates', `${licenceId}.txt`);

    if (!fs.existsSync(licencePath)) {
        console.error(chalk.red(`License template for ${licenceId} not found!`));
        throw new Error(`License template for ${licenceId} not found!`);
    }

    let licenceContent = fs.readFileSync(licencePath, 'utf-8');
    const year = new Date().getFullYear();
    licenceContent = licenceContent.replaceAll('[fullname]', userName).replace('[year]', year);

    fs.writeFileSync('LICENSE', licenceContent);
    console.log(chalk.green(`LICENSE created successfully with ${licenceId} template!`));
}

export default writeLicence;
