import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 
 * @param {string} licenceId - The ID of the license to write (e.g., "mit", "gpl-3.0")
 * @param {string} userName - The name to include in the license (e.g., the author's name)
 * @throws Will throw an error if the license template is not found or if writing fails.
 */
const writeLicence = (licenceId, userName) => {
    const licencePath = path.join(__dirname, '..', 'templates', 'licence', `${licenceId}.txt`);
    const snippetPath = path.join(__dirname, '..', 'templates', 'snippet', `${licenceId}.txt`);

    if (!fs.existsSync(licencePath)) {
        console.error(chalk.red(`License template for ${licenceId} not found!`));
        throw new Error(`License template for ${licenceId} not found!`);
    }

    // Snippet is optional, but if it exists, we can use it for more detailed templates
    if (!fs.existsSync(snippetPath)) {
        console.error(chalk.red(`License snippet for ${licenceId} not found!`));
    }

    let licenceContent = fs.readFileSync(licencePath, 'utf-8');
    let snippetContent = fs.readFileSync(snippetPath, 'utf-8');

    const year = new Date().getFullYear();
    licenceContent = licenceContent.replaceAll('[fullname]', userName).replace('[year]', year);
    snippetContent = snippetContent.replaceAll('[fullname]', userName).replace('[year]', year);

    fs.writeFileSync('LICENSE', licenceContent);
    console.log(chalk.green(`LICENSE created successfully with ${licenceId} template!`));

    const headerPath = 'licence-header.txt';
    if (fs.existsSync(headerPath)) {
        console.warn(chalk.yellow(`Warning: ${headerPath} already exists and will be overwritten!`));
    }
    fs.writeFileSync(headerPath, snippetContent);

    const headerResponse = `
File: ${headerPath}

Next step:
  - Copy this header into the top of your source files (optional but recommended)
  - Keep the full license in the LICENSE file (required)

Full license is available in LICENSE.

Tip: Headers help clearly show license ownership per file.`;
    console.log(chalk.green('✔ Header created successfully'));
    console.log(chalk.cyan(headerResponse));
}

export default writeLicence;
