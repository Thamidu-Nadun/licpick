#!/usr/bin/env node

/*
MIT License

Copyright (c) 2026 Nadun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
    console.log(chalk.yellow("\n⊘ Process interrupted. Exiting..."));
    process.exit(0);
})