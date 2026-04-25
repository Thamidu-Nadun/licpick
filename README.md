# licpick

> Pick the right open source license for your project without the headache

[![npm version](https://img.shields.io/npm/v/licpick.svg)](https://www.npmjs.com/package/licpick)
[![npm downloads](https://img.shields.io/npm/dm/licpick.svg)](https://www.npmjs.com/package/licpick)
[![License: GPL](https://img.shields.io/badge/License--yellow.svg)](https://opensource.org/licenses/MIT)

Licenses are confusing. MIT? Apache 2.0? GPL? **licpick** asks you a few simple questions about your project and shows you the best options. Then you can pick one and it writes the LICENSE file for you.

## What It Does

- Asks 5 simple questions about your project
- Scores all 8 licenses based on your answers
- Shows top 3 matches with reasons why
- Writes the license file with your name and current year
- Supports 8 common licenses: MIT, Apache 2.0, GPL 3.0, AGPL 3.0, BSD 3-Clause, ISC, CC0, MPL 2.0
- Lets you add custom licenses via URL
- Has a debug mode to see the scoring in detail

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

## Quick Start

### Get a Recommendation

Answer a few questions and see what licenses match your needs:

```bash
licpick init
```

You'll be asked:

1. Give up all rights (public domain)?
2. Require modifications to stay open source?
3. Need patent protection?
4. Is this a backend/SaaS project?
5. Want strict copyleft?

Based on your answers, licpick shows the top 3 licenses and asks if you want to write one to your LICENSE file.

**See the scoring:**

```bash
licpick init --debug
```

This shows your answers and how each license scored.

### Write Any License

Pick a license and write it to your project. licpick will ask which one you want:

```bash
licpick write
```

Or specify it directly:

```bash
licpick write --licence mit
licpick write -l apache-2.0
```

Either way, you'll be prompted for your name/organization, then the file gets created with your info and the current year filled in.

### See All Available Licenses

```bash
licpick list
```

Shows all 8 built-in licenses plus any custom ones you've installed.

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

Write a license directly to your LICENSE file. You can pick one from a menu or specify it:

```bash
licpick write
```

This shows a list of licenses and lets you pick.

Or specify it directly:

```bash
licpick write --licence mit
licpick write -l apache-2.0
```

Licpick will ask for your name/organization, then create the file with your info and year filled in.

Supported IDs: `mit`, `apache-2.0`, `gpl-3.0`, `agpl-3.0`, `bsd-3-clause`, `cc0`, `isc`, `mpl-2.0`

---

### `licpick list`

See all available licenses:

```bash
licpick list
```

Shows the 8 built-in licenses plus any custom ones you've installed.

---

### `licpick install`

Add a custom license from a URL:

```bash
licpick install --url https://example.com/license.json
licpick install -u https://api.licenses.com/custom-license.json
```

The license gets downloaded, validated, and added to your available options.

**License Format** (JSON):

```json
{
  "metadata": {
    "id": "custom-license",
    "name": "My Custom License",
    "traits": { "copyleft": false, "patent": true },
    "weight": { "copyleft": 2, "patent": 3 },
    "explain": ["Why you'd use this license"]
  },
  "template": "Full license text here with [fullname] and [year] placeholders..."
}
```

---

## How the Scoring Works

Licpick scores each license based on your answers. Each license has:

- **Traits**: What it requires or allows (copyleft, patents, etc.)
- **Weights**: How important each trait is for that license
- **Reasons**: Short explanations of when to use it

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

## LICENSE

```java
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
```

---

Made with ❤️ for the open source community
