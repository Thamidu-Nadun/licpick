import chalk from "chalk";
import validateLicence from "../utils/validateLicence.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isMetadataExist = async (metadata) => {
    const licenceFilePath = path.join(__dirname, "../plugins/advancedLicence.js");
    const module = await import(pathToFileURL(licenceFilePath).href);
    const advancedLicence = module.default || [];
    return advancedLicence.some(licence => licence.id === metadata.id);
};

const writeMetadataToPlugin = async (metadata) => {
    const licenceFilePath = path.join(__dirname, "../plugins/advancedLicence.js");
    const module = await import(pathToFileURL(licenceFilePath).href);
    const advancedLicence = module.default || [];

    // append the new licence metadata to the existing advancedLicence array
    const content = `export default ${JSON.stringify([...advancedLicence, metadata], null, 4)};`;
    fs.writeFileSync(licenceFilePath, content, "utf-8");
    console.log(chalk.greenBright(`✓ Installed licence '${chalk.bold(metadata.name)}' to advancedLicence plugin.`));
}

const writeLicenceSnippet = (licenceId, licenceSnippet) => {
    const licencesFilePath = path.join(__dirname, "..", "templates", "snippet", `${licenceId}.txt`);
    licenceSnippet = licenceSnippet.replaceAll(/\\n\\r|\\r\\n|\\n|\\r/g, "\n");
    fs.writeFileSync(licencesFilePath, licenceSnippet, "utf-8");
    console.log(chalk.greenBright(`✓ Saved licence snippet to ${chalk.underline(licencesFilePath)}.`));
};

const writeFullLicenceData = (licenceId, licenceData) => {
    const licencesFilePath = path.join(__dirname, "..", "templates", "licence", `${licenceId}.txt`);
    licenceData = licenceData.replaceAll(/\\n\\r|\\r\\n|\\n|\\r/g, "\n");
    fs.writeFileSync(licencesFilePath, licenceData, "utf-8");
    console.log(chalk.greenBright(`✓ Saved full licence data to ${chalk.underline(licencesFilePath)}.`));
};

const installLicence = async (options) => {
    const { url: remoteURL } = options;
    if (!remoteURL) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(" Please provide a remote URL using the -u or --url option."));
        return;
    }

    const res = await fetch(remoteURL);
    console.log(chalk.blueBright(`⬇ Fetching licence data from ${chalk.underline(remoteURL)}...`));

    if (!res.ok) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` Failed to fetch licence from ${remoteURL}: ${res.statusText}`));
        return;
    }
    const licence = await res.json();
    // validate the structure of the remote licence data
    if (typeof licence !== "object" || licence === null || typeof licence.metadata !== "object" || typeof licence.template !== "string" || typeof licence.snippet !== "string") {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` Invalid licence format from ${remoteURL}. Expected 'metadata', 'template', and 'snippet' properties.`));
        return;
    }

    // validate the licence data
    const { valid, errors } = validateLicence(licence.metadata);
    if (!valid) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` Invalid licence data from ${remoteURL}:`));
        errors.forEach(err => console.error(chalk.red(`  ${err}`)));
        return;
    }
    // check if the licence metadata already exists
    if (await isMetadataExist(licence.metadata)) {
        console.error(chalk.bgRed.white(" ✗ ERROR ") + chalk.red(` Licence '${licence.metadata.id}' already exists.\nPlease provide a different licence or update the existing one.`));
        return;
    }
    // write the valid licence metadata to the advancedLicence plugin
    writeMetadataToPlugin(licence.metadata);

    // save the full licence data to licencs file
    writeFullLicenceData(licence.metadata.id, JSON.stringify(licence.template, null, 4));

    // save the licence snippet to snippet file
    writeLicenceSnippet(licence.metadata.id, licence.snippet);

    console.log(chalk.greenBright(`✓ Successfully installed licence from ${chalk.underline(remoteURL)}.`));
};

export default installLicence;