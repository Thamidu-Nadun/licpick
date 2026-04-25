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
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` License template for ${licenceId} not found!`));
        throw new Error(`License template for ${licenceId} not found!`);
    }

    // Snippet is optional, but if it exists, we can use it for more detailed templates
    if (!fs.existsSync(snippetPath)) {
        console.error(chalk.yellow(`⚠ License snippet for ${licenceId} not found!`));
    }

    let licenceContent = fs.readFileSync(licencePath, 'utf-8');
    let snippetContent = fs.readFileSync(snippetPath, 'utf-8');

    const year = new Date().getFullYear();
    licenceContent = licenceContent.replaceAll('[fullname]', userName).replace('[year]', year);
    snippetContent = snippetContent.replaceAll('[fullname]', userName).replace('[year]', year);

    fs.writeFileSync('LICENSE', licenceContent);
    console.log(chalk.greenBright(`✓ LICENSE created successfully with ${chalk.bold(licenceId)} template!`));

    const headerPath = 'licence-header.txt';
    if (fs.existsSync(headerPath)) {
        console.warn(chalk.yellow(`⚠ ${headerPath} already exists and will be overwritten!`));
    }
    fs.writeFileSync(headerPath, snippetContent);

    const headerResponse = `
📋 File: ${chalk.cyan(headerPath)}

🔗 Next steps:
  → Copy this header into the top of your source files (optional)
  → Keep the full license in the LICENSE file (required)

📄 Full license available in ${chalk.cyan("LICENSE")}

💡 Tip: Headers help clearly show license ownership per file.`;
    console.log(chalk.greenBright('✓ Header created successfully'));
    console.log(chalk.dim(headerResponse));
}

export default writeLicence;
