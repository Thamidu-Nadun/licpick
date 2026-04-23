# licpick 🎯

> A smart, interactive CLI tool that recommends the perfect open source license for your project

[![npm version](https://img.shields.io/npm/v/licpick.svg)](https://www.npmjs.com/package/licpick)
[![npm downloads](https://img.shields.io/npm/dm/licpick.svg)](https://www.npmjs.com/package/licpick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Choosing the right open source license can be overwhelming. **licpick** takes the guesswork out by asking simple questions about your project and recommending the most suitable license from a curated list of popular options.

## Features ✨

- 🤖 **Smart Recommendation Engine**: AI-powered scoring system based on your project's needs
- ❓ **Interactive Questions**: Simple yes/no questions to understand your requirements
- 📋 **8 Pre-built Licenses**: MIT, Apache 2.0, GPL 3.0, AGPL 3.0, BSD 3-Clause, ISC, CC0, and Mozilla Public License 2.0
- 🔧 **Extensible Plugin System**: Add custom licenses to your project
- 🎨 **Beautiful CLI**: Color-coded output with clear formatting
- 📝 **Automatic License Installation**: Write license files directly to your project
- 🔍 **Debug Mode**: Detailed reasoning behind recommendations
- 🌐 **Remote License Support**: Install custom licenses from remote URLs

## Installation

### Global Installation (Recommended)

```bash
npm install -g licpick
```

Then use it from anywhere:

```bash
licpick init
```

### Local Installation

```bash
npm install --save-dev licpick
```

Then run it via npm scripts or `npx`:

```bash
npx licpick init
```

## Quick Start 🚀

### Recommended License (Interactive)

Get personalized license recommendations:

```bash
licpick init
```

This will ask you 5 questions:

1. Do you want to give up all rights (public domain)?
2. Require open source for modifications?
3. Need patent protection?
4. Is this a SaaS/backend project?
5. Do you want strict copyleft?

The tool will then recommend the top 3 matching licenses and ask if you want to write the best one to your LICENSE file.

**With Debug Mode:**

```bash
licpick init --debug
```

or

```bash
licpick init -d
```

Shows detailed scoring, your answers, and reasoning behind each recommendation.

### List All Available Licenses

See all licenses available in your system:

```bash
licpick list
```

Output example:

```
Available Licenses: 8

1. MIT License (mit)
2. Apache License 2.0 (apache-2.0)
3. GNU GPL v3 (gpl-3.0)
4. GNU Affero GPL v3 (agpl-3.0)
5. BSD 3-Clause License (bsd-3-clause)
6. Creative Commons Zero (cc0)
7. ISC License (isc)
8. Mozilla Public License 2.0 (mpl-2.0)
```

### Write a Specific License

Write a license directly without going through recommendations:

```bash
licpick write --licence mit
```

or

```bash
licpick write -l apache-2.0
```

Supported license IDs: `mit`, `apache-2.0`, `gpl-3.0`, `agpl-3.0`, `bsd-3-clause`, `cc0`, `isc`, `mpl-2.0`

The tool will prompt for your name/organization and create a LICENSE file in your current directory.

### Install Custom Licenses

Extend licpick with custom licenses from a remote URL:

```bash
licpick install --url https://example.com/my-custom-license.json
```

or

```bash
licpick install -u https://example.com/my-custom-license.json
```

**License Format** (JSON):

```json
{
  "metadata": {
    "id": "custom-license",
    "name": "My Custom License",
    "traits": {
      "copyleft": false,
      "patent": true
    },
    "weight": {
      "copyleft": 2,
      "patent": 3
    },
    "explain": ["Explanation of why to use this license", "Another benefit"]
  },
  "template": "Full license text here with [fullname] and [year] placeholders..."
}
```

## Command Reference

### `licpick init`

Start the interactive license recommendation process.

**Options:**

- `-d, --debug` - Enable debug mode to see detailed recommendation reasoning and your answers

**Example:**

```bash
licpick init
licpick init --debug
licpick init -d
```

**What it does:**

1. Asks 5 questions about your project
2. Analyzes your answers against all available licenses
3. Provides top 3 recommendations with reasoning
4. Optionally writes the best license to LICENSE file

---

### `licpick list`

Display all available licenses with their IDs.

**Options:** None

**Example:**

```bash
licpick list
```

**Output:**
Shows numbered list of all licenses with their names and IDs for use with the `write` command.

---

### `licpick write`

Write a specific license template to a LICENSE file in the current directory.

**Options:**

- `-l, --licence <licenceName>` - **REQUIRED** - Name/ID of the license to write (e.g., `mit`, `gpl-3.0`)

**Example:**

```bash
licpick write --licence mit
licpick write -l apache-2.0
licpick write --licence gpl-3.0
```

**What it does:**

1. Validates the license ID
2. Prompts for your name/organization
3. Creates a LICENSE file with personalized information
4. Auto-fills `[fullname]` and `[year]` placeholders

---

### `licpick install`

Install a custom license from a remote source and add it to your project's license set.

**Options:**

- `-u, --url <remoteURL>` - **REQUIRED** - URL pointing to the custom license JSON file

**Example:**

```bash
licpick install --url https://example.com/license.json
licpick install -u https://api.licenses.com/custom-license.json
```

**What it does:**

1. Fetches the license data from the remote URL
2. Validates the license structure and metadata
3. Saves the metadata to `src/plugins/advancedLicence.js`
4. Saves the full license template to `src/templates/`
5. Makes it available for use with `init`, `list`, and `write` commands

---

### `licpick` (no command)

Shows help information and version.

**Options:**

- `-v, --version` - Display version number

---

## Understanding the Recommendation Engine

The recommendation system works by scoring each license based on your answers:

### Scoring Algorithm

Each license has:

- **Traits**: Boolean properties (copyleft, patent protection, etc.)
- **Weight**: Numerical importance for each trait
- **Explanations**: Reasons why this license is recommended

When you answer questions:

- ✅ **Matching Answer**: Add the license's weight for that question
- ❌ **Non-matching Answer**: Subtract the license's weight
- Final Score: Sum of all weighted answers

**Top 3 licenses** with the highest scores are recommended.

### Recommendation Criteria

The questionnaire helps determine your needs:

| Question              | When to Answer YES                              | When to Answer NO                  |
| --------------------- | ----------------------------------------------- | ---------------------------------- |
| **Public Domain**     | You don't want any copyright restrictions       | You want copyright attribution     |
| **Copyleft**          | You want derivative works to be open source too | You want commercial flexibility    |
| **Patent Protection** | You develop patents alongside code              | You don't have patent concerns     |
| **SaaS/Backend**      | Building web services or cloud software         | Building libraries or applications |
| **Strict Copyleft**   | Maximum freedom protection (GPL level)          | Lighter copyleft (like MPL)        |

## Available Licenses

### Permissive Licenses

**MIT License** (`mit`)

- Perfect for: Personal projects, libraries, commercial use
- Characteristics: Minimal restrictions, requires attribution
- Use if: You want maximum adoption and simplicity

**Apache License 2.0** (`apache-2.0`)

- Perfect for: Enterprise projects, companies with patents
- Characteristics: Patent protection included, permissive
- Use if: You want legal protection for your patents

**BSD 3-Clause** (`bsd-3-clause`)

- Perfect for: Academic projects, educational use
- Characteristics: Similar to MIT with additional clause
- Use if: You want simple yet established licensing

**ISC License** (`isc`)

- Perfect for: Minimal licensing overhead
- Characteristics: Functionally identical to MIT
- Use if: You prefer ISC's cleaner wording

### Copyleft Licenses

**GNU GPL v3** (`gpl-3.0`)

- Perfect for: Open source projects, avoiding proprietary forks
- Characteristics: Strong copyleft, requires distribution
- Use if: All modifications must remain open source

**GNU Affero GPL v3** (`agpl-3.0`)

- Perfect for: Web services, SaaS platforms
- Characteristics: Stricter than GPL for network use
- Use if: You want source code shared for services using your code

**Mozilla Public License 2.0** (`mpl-2.0`)

- Perfect for: Balanced approach between permissive and copyleft
- Characteristics: File-level copyleft, patent protection
- Use if: You want flexibility with some copyleft requirements

### Other

**Creative Commons Zero** (`cc0`)

- Perfect for: Data, documentation, content
- Characteristics: Public domain dedication
- Use if: You want absolutely no restrictions

## Examples

### Example 1: Building a React Library

```bash
$ licpick init

? Do you want to give up all rights (public domain)? (Y/n) n
? Require open source for modifications? (Y/n) n
? Need patent protection? (Y/n) n
? Is this a SaaS/backend project? (Y/n) n
? Do you want strict copyleft? (Y/n) n

License information collected successfully!

Recommended License: MIT License

Reasons:
  ✔ Allows commercial use
  ✔ No requirement to open source changes
  ✔ Very simple and popular

? Enter your name for the license (or leave blank for public domain): John Doe
? Do you want to write the MIT License license to a LICENSE file? (Y/n) y

Successfully wrote mit license to D:\projects\my-library\LICENSE
```

### Example 2: Building a SaaS Platform

```bash
$ licpick init --debug

? Do you want to give up all rights (public domain)? (Y/n) n
? Require open source for modifications? (Y/n) y
? Need patent protection? (Y/n) y
? Is this a SaaS/backend project? (Y/n) y
? Do you want strict copyleft? (Y/n) y

License information collected successfully!

Debug mode enabled. Detailed reasoning will be shown.
Your Answers:
{ copyleft: true, patent: true, saas: true, strict: true }

Top License Recommendations:

1. GNU Affero GPL v3 (Score: 15)
Reasons:
  • Stricter than GPL - requires source for network use
  • Requires open source distribution
  • Strongest copyleft protection

2. GNU GPL v3 (Score: 10)
Reasons:
  • Requires open source distribution
  • Strong copyleft protection

3. Mozilla Public License 2.0 (Score: 8)
Reasons:
  • Weak copyleft - file-scoped
  • Includes patent protection
  • Balance between permissive and copyleft

Recommended License: GNU Affero GPL v3

Reasons:
  ✔ Stricter than GPL - requires source for network use
  ✔ Requires open source distribution
  ✔ Strongest copyleft protection
```

## Troubleshooting

### License template not found

**Error:** `Licence template 'mit' does not exist in the templates directory.`

**Solution:** Make sure you're using a valid license ID. Run `licpick list` to see all available licenses.

### Invalid license format when installing custom license

**Error:** `Invalid licence format from <url>. Expected an object with 'metadata' and 'template' properties.`

**Solution:** Ensure your remote license JSON has both `metadata` and `template` properties as shown in the [Custom Licenses](#install-custom-licenses) section.

### Permission denied when writing LICENSE file

**Error:** `Failed to write LICENSE file: EACCES: permission denied`

**Solution:** Ensure you have write permissions in the current directory. Try running the command from a different directory or with appropriate permissions.

### Installation fails

**Error:** `npm ERR! code EACCES`

**Solution:** Try using `sudo npm install -g licpick` or configure npm to use a different directory for global installations.

## FAQ

**Q: What's the difference between GPL and AGPL?**
A: AGPL is stricter. It requires source code to be shared even when the software is accessed over a network (like a web service), while GPL only requires it when distributing the software.

**Q: Can I use multiple licenses for different parts of my project?**
A: Yes, but it's complex. You'd typically use SPDX license expressions. We recommend choosing one primary license for simplicity.

**Q: What if none of the recommendations feel right?**
A: Use the `licpick list` command to review all options, then use `licpick write` to directly write a license. Or use `licpick install` to add a custom license that better fits your needs.

**Q: Is my project's information stored?**
A: No! licpick runs completely locally. Your answers are never transmitted or stored anywhere.

**Q: Can I contribute a new license?**
A: Yes! We welcome contributions. See the [Contributing](#contributing) section.

**Q: How do I update licpick?**
A: Use `npm install -g licpick@latest` for global installations, or `npm install --save-dev licpick@latest` for local installations.

## Contributing

We welcome contributions! Here's how you can help:

### Adding a New License

1. Create a new license template file in `src/templates/{license-id}.txt`
2. Add metadata to `src/plugins/advancedLicence.js` or `src/licenses.js`
3. Include the license ID, name, traits, weights, and explanations
4. Test with `licpick list` and `licpick init`

### Improving the Tool

- **Bug Fixes:** Open an issue and submit a PR
- **Features:** Discuss in issues first before implementing
- **Documentation:** Help improve our README and guides

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Thamidu-Nadun/licpick.git
cd licpick

# Install dependencies
npm install

# Test the CLI
npm start -- init
npm start -- list
npm start -- write --licence mit
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Thamidu-Nadun](https://github.com/Thamidu-Nadun)

## Changelog

### v1.0.0 (Current)

- Initial release
- 8 built-in licenses
- Interactive recommendation engine
- Custom license installation support
- Debug mode with detailed reasoning

## Roadmap

- [ ] Support for more license templates
- [ ] License comparison tool
- [ ] Integration with GitHub/GitLab
- [ ] Web-based interface
- [ ] Configuration file support
- [ ] License compatibility checker

---

Made with ❤️ for the open source community
