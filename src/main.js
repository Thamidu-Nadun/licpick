#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import init from "./commands/init.js";
import listLicences from "./commands/listLicence.js";
import installLicence from "./commands/installLicence.js";
import writeLicence from "./commands/writeLicence.js";

const program = new Command();

program
    .name("license-recommender")
    .description("A CLI tool to recommend open source licenses based on your project needs")
    .version("1.0.0", "-v, --version", "Output the current version");

program
    .command("init")
    .description("Start the license recommendation process")
    .option("-d, --debug", "Show detailed recommendation reasoning")
    .option("-a, --advanced", "Use an advanced questionnaire for more tailored recommendations")
    .action(init);

program
    .command("list")
    .description("List all available licenses with their traits and explanations")
    .action(listLicences);

program
    .command("install")
    .description("Install the recommended license file.")
    .option("-u, --url <remoteURL>", "Remote URL to fetch the license data from")
    .action(installLicence)

program
    .command("write")
    .description("Write a license template to a LICENSE file in the current directory.\nYou should know the purpose of the license you want to write, as this command does not provide recommendations.")
    .option("-l, --licence <licenceName>", "Name of the license template to write (e.g., mit, gpl-3.0)")
    .action(writeLicence);


program.parse(process.argv);

process.on("SIGINT", () => {
    console.log(chalk.red("\nProcess interrupted. Exiting..."));
    process.exit(0);
})