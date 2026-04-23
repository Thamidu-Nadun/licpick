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
    console.log(chalk.green(`Successfully installed licence '${metadata.name}' to advancedLicence plugin.`));
}

const writeFullLicenceData = (licenceId, licenceData) => {
    const licencesFilePath = path.join(__dirname, "../templates/", `${licenceId}.txt`);
    licenceData = licenceData.replaceAll(/\\n\\r|\\r\\n|\\n|\\r/g, "\n");
    fs.writeFileSync(licencesFilePath, licenceData, "utf-8");
    console.log(chalk.green(`Successfully saved full licence data to ${licencesFilePath}.`));
};

const installLicence = async (options) => {
    const { url: remoteURL } = options;
    if (!remoteURL) {
        console.error(chalk.red("Please provide a remote URL to fetch the licence data from using the -u or --url option."));
        return;
    }

    const res = await fetch(remoteURL);
    console.log(chalk.blue(`Fetching licence data from ${remoteURL}...`));

    if (!res.ok) {
        console.error(chalk.red(`Failed to fetch licence from ${remoteURL}: ${res.statusText}`));
        return;
    }
    const licence = await res.json();
    // validate the structure of the remote licence data
    if (typeof licence !== "object" || licence === null || typeof licence.metadata !== "object" || typeof licence.template !== "string") {
        console.error(chalk.red(`Invalid licence format from ${remoteURL}. Expected an object with 'metadata' and 'template' properties.`));
        return;
    }

    // validate the licence data
    const { valid, errors } = validateLicence(licence.metadata);
    if (!valid) {
        console.error(chalk.red(`Invalid licence data from ${remoteURL}:`));
        errors.forEach(err => console.error(chalk.red(`- ${err}`)));
        return;
    }
    // check if the licence metadata already exists
    if (await isMetadataExist(licence.metadata)) {
        console.error(chalk.red(`Licence with id '${licence.metadata.id}' already exists in the advancedLicence plugin.\nPlease provide a different licence or update the existing one.`));
        return;
    }
    // write the valid licence metadata to the advancedLicence plugin
    writeMetadataToPlugin(licence.metadata);

    // save the full licence data to licencs file
    writeFullLicenceData(licence.metadata.id, JSON.stringify(licence.template, null, 4));

    console.log(chalk.green(`Successfully installed licence from ${remoteURL}.`));
};

export default installLicence;