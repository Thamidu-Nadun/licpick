#!/usr/bin/env node

/*
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2026 Thamidu-Nadun

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

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
    .option("-a, --advanced", "Use an advanced mode with more license options and detailed questions")
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