# IMPROVE.md - Development Guide for licpick

This document tracks what needs work, how the code is organized, and how to contribute effectively.

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Code Quality Improvements](#code-quality-improvements)
3. [Feature Enhancements](#feature-enhancements)
4. [Performance Optimizations](#performance-optimizations)
5. [Testing Strategy](#testing-strategy)
6. [Bug Fixes and Known Issues](#bug-fixes-and-known-issues)
7. [Development Workflow](#development-workflow)

---

## Current Architecture

### Project Structure

```
licpick/
├── src/
│   ├── main.js              # CLI entry point using Commander.js
│   ├── engine.js            # Recommendation scoring algorithm
│   ├── licenses.js          # Built-in licenses metadata
│   ├── questions.js         # Interactive questionnaire
│   ├── commands/            # Command implementations
│   │   ├── init.js          # Interactive recommendation flow
│   │   ├── listLicence.js   # List licenses command
│   │   ├── installLicence.js # Install custom licenses
│   │   └── writeLicence.js  # Write license file
│   ├── plugins/             # Extensibility system
│   │   └── advancedLicence.js # User-installed licenses
│   ├── templates/           # License text templates
│   └── utils/               # Utility functions
│       ├── validateLicence.js
│       └── writeLicence.js
└── package.json
```

### Key Dependencies

- **commander**: CLI framework for command structure
- **inquirer**: Interactive prompts/questionnaire
- **chalk**: Terminal color and formatting

---

## Code Quality Improvements

### 1. Error Handling & Validation

Currently: Limited error messages, no centralized error handling

What needs to happen:

- Create custom error classes for different failure types
- Standardize error messages across commands
- Add input validation upfront instead of failing mid-operation

Example structure:

```javascript
// src/utils/errorHandler.js
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class FileOperationError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "FileOperationError";
    this.originalError = originalError;
  }
}
```

**Priority:** HIGH

---

### 2. Configuration Management

Currently: Settings are hardcoded

What would help:

- Let users set preferences in `~/.licpickrc`
- Support per-project config in `.licpickrc.json`
- Read from environment variables like `LICPICK_DEBUG=true`

This avoids forcing users to pass flags every time.

**Priority:** MEDIUM

---

### 3. Add JSDoc Type Hints

Currently: No type information in function signatures

Why it matters: IDEs can help autocomplete, and future readers know what to pass

```javascript
/**
 * Scores a license against user answers
 * @param {Object} licence - License with traits and weights
 * @param {string} licence.id - License identifier
 * @param {Object} answers - User's questionnaire answers
 * @returns {{score: number, reasons: string[]}} Final score and reasoning
 */
export const score = (licence, answers) => {
  // ...
};
```

**Priority:** MEDIUM

---

### 4. Centralized Logging

Currently: Mixed console.log and console.error scattered through code

Better approach: One place to handle all output, making it easy to adjust colors or add timestamps later

```javascript
// src/utils/logger.js
export const logger = {
  info: (msg) => console.log(chalk.cyan(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  error: (msg) => console.error(chalk.red(msg)),
  debug: (msg) => {
    if (process.env.LICPICK_DEBUG === "true") {
      console.log(chalk.magenta(`[DEBUG] ${msg}`));
    }
  },
};
```

**Priority:** MEDIUM

---

## Feature Enhancements

### 1. License Comparison Tool

What users want: Pick two or three licenses and see how they differ side-by-side

```bash
licpick compare mit apache-2.0 gpl-3.0
```

Why it matters: People don't always trust the recommendation. Being able to compare helps them make smarter choices.

**Priority:** HIGH

---

### 2. Web-Based Interface

Not everyone uses the command line. A simple web app would help people who want to see recommendations in a browser.

**Tech stack:** React or Next.js

**Priority:** LOW (future release)

---

### 3. SPDX License Expression Support

Allow users to combine licenses:

```bash
licpick write --licence "MIT OR Apache-2.0"
```

This aligns with industry standards and helps with complex projects.

**Priority:** MEDIUM

---

### 4. License Compatibility Checker

When you install a package, its license matters. This tool would read your package.json and warn you about potential conflicts:

```bash
licpick check-compatibility
```

**Priority:** MEDIUM

---

### 5. GitHub Integration

Let users generate a LICENSE file directly to a GitHub repo without leaving the terminal.

**Priority:** LOW

---

### 6. Interactive License Editor

Sometimes you want to tweak a license template without manually editing files.

```bash
licpick edit mit
```

**Priority:** LOW

---

## Performance Optimizations

### 1. Caching System

Currently: Each `licpick install` fetches fresh data from remote

Better approach: Cache remote licenses locally with a TTL (time-to-live)

```javascript
// src/utils/cache.js
export const createCache = () => {
  const cacheDir = path.join(os.homedir(), ".licpick_cache");

  return {
    get: (key) => {
      /* check cache */
    },
    set: (key, value, ttl = 3600) => {
      /* store with TTL */
    },
    clear: () => {
      /* clear all */
    },
  };
};
```

**Priority:** LOW (only if installs become slow)

---

### 2. Lazy Load Licenses

Currently: Load all licenses at startup

Better: Load core licenses first, load custom ones only when needed

**Priority:** LOW (not a bottleneck yet)

---

## Testing Strategy

### 1. Unit Tests

Test the core logic: the scoring algorithm and license validation

```javascript
// test/engine.test.js
import { score } from "../src/engine.js";

describe("License Scoring", () => {
  test("scores matching traits positively", () => {
    const licence = {
      traits: { copyleft: false },
      weight: { copyleft: 3 },
      explain: [],
    };
    const answers = { copyleft: false };
    const result = score(licence, answers);
    expect(result.score).toBe(3);
  });

  test("scores mismatched traits negatively", () => {
    const licence = {
      traits: { copyleft: true },
      weight: { copyleft: 3 },
      explain: [],
    };
    const answers = { copyleft: false };
    const result = score(licence, answers);
    expect(result.score).toBe(-3);
  });
});
```

Use Jest. Target 100% coverage for engine.js and utils.

**Priority:** HIGH

---

### 2. Integration Tests

Test the full flow: run actual commands and verify output

```bash
Test: licpick list shows all licenses
Test: licpick write creates a valid LICENSE file
Test: licpick install adds a custom license correctly
```

**Priority:** HIGH

---

### 3. E2E Tests

Simulate real user workflows and verify they work end-to-end

```javascript
describe("User Flows", () => {
  test("answer questions -> get recommendations -> write license", async () => {
    // Run through complete flow
  });
});
```

**Priority:** MEDIUM

---

### Test Coverage Goals

- engine.js: 100%
- utils: 95%
- commands: 70%
- plugins: 60%
- Overall: 80%+

## Bug Fixes and Known Issues

### 1. Windows Path Handling

Problem: Path handling on Windows is inconsistent

Current approach:

```javascript
const licenceFilePath = path.join(
  __dirname,
  "../templates/",
  `${licenceName}.txt`,
);
```

Better: Use path.resolve for consistency across operating systems

```javascript
const licenceFilePath = path.resolve(
  __dirname,
  "..",
  "templates",
  `${licenceName}.txt`,
);
```

**Priority:** MEDIUM

---

### 2. Limited License Placeholders

Currently: Only `[fullname]` and `[year]` are replaced in templates

Could add:

- `[email]` - User email
- `[url]` - Project URL
- `[description]` - Project description

**Priority:** MEDIUM

---

### 3. License Metadata Validation

The validateLicence.js function needs clearer rules. It should check:

- ID format (alphanumeric + hyphens)
- Name exists and is non-empty
- Explain is an array
- Traits and weights are objects

```javascript
export const validateLicence = (metadata) => {
  const errors = [];

  if (!metadata.id || !/^[a-z0-9\-]+$/.test(metadata.id)) {
    errors.push("Invalid license ID format");
  }

  if (!metadata.name || metadata.name.length === 0) {
    errors.push("License name required");
  }

  if (!Array.isArray(metadata.explain)) {
    errors.push("License explain must be an array");
  }

  return { valid: errors.length === 0, errors };
};
```

**Priority:** MEDIUM

---

### 4. Inconsistent Async Patterns

Currently: Mixed use of .then() and async/await makes code harder to follow

Standardize to async/await:

```javascript
export default async function init(options) {
  try {
    const answers = await inquirer.prompt(questions);
    // do something with answers
  } catch (error) {
    // handle error
  }
}
```

**Priority:** HIGH

---

### 5. Generic Error Messages

Some errors are too vague and don't help users fix problems

Better: Give specific messages for common issues

```javascript
if (res.status === 404) {
  console.error(chalk.red(`License not found at ${remoteURL} (404)`));
} else if (res.status === 403) {
  console.error(chalk.red(`Access denied to ${remoteURL} (403)`));
} else {
  console.error(chalk.red(`Failed to fetch: ${res.status} ${res.statusText}`));
}
```

**Priority:** MEDIUM

## Development Workflow

### Setting Up to Work on licpick

```bash
# Get the code
git clone https://github.com/Thamidu-Nadun/licpick.git
cd licpick

# Install deps
npm install

# Test it
npm start -- init
npm start -- list
npm start -- write --licence mit

# Debug a command
NODE_DEBUG=* npm start -- init --debug
```

### Code Style

- Use ES modules (import/export)
- 4-space indents
- Descriptive variable names
- Comments on the tricky stuff
- Aim for 80 character lines

### Commit Messages

```
[type]: [short description]

Types: feat, fix, docs, refactor, test, perf, chore
Example: feat: add license comparison command
```

### Making a PR

1. Create a branch: `git checkout -b feat/your-feature`
2. Make changes with tests
3. Update README if it's user-facing
4. Update this file if it's developer-facing
5. Make sure tests pass: `npm test`
6. Submit your PR with a good description

---

## Security

When adding new features, keep these in mind:

1. **Validate URLs** before fetching from them
2. **Don't execute** license content as code
3. **Check file permissions** before writing
4. **Validate user input** early

---

## Roadmap

### Now (Phase 1)

- [x] 8 core licenses
- [x] Interactive recommendation
- [x] Custom license installation

### Next (Phase 2)

- [ ] 80%+ test coverage
- [ ] License comparison
- [ ] Better error messages
- [ ] Config file support

### Later (Phase 3)

- [ ] Web interface
- [ ] GitHub integration
- [ ] Compatibility checker
- [ ] SPDX support

### Future (Phase 4)

- [ ] Desktop app
- [ ] IDE plugins (VS Code, JetBrains)
- [ ] Pre-commit hooks
- [ ] Smarter recommendations

---

## Want to Contribute?

1. Open an issue first to discuss the change
2. Link your issue in the PR
3. Add tests for new features
4. Update docs if needed

Open an issue on GitHub if you have questions. Happy coding! 🚀
