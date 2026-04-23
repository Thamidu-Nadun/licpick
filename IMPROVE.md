# IMPROVE.md - Development Guide for licpick

This document outlines areas for improvement, architectural considerations, and best practices for contributing to and maintaining the licpick project.

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Code Quality Improvements](#code-quality-improvements)
3. [Feature Enhancements](#feature-enhancements)
4. [Performance Optimizations](#performance-optimizations)
5. [Testing Strategy](#testing-strategy)
6. [Documentation Improvements](#documentation-improvements)
7. [Bug Fixes and Known Issues](#bug-fixes-and-known-issues)

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

### 1. Error Handling & Validation ⚠️

**Current Issues:**

- Limited error messages in several commands
- No centralized error handling strategy
- Missing input validation in some places

**Improvements:**

```javascript
// Create error handling utility
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

// Use in commands with try-catch blocks
try {
  // operation
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(chalk.red(`Validation Error: ${error.message}`));
  } else if (error instanceof FileOperationError) {
    console.error(chalk.red(`File Operation Error: ${error.message}`));
    if (process.env.DEBUG) console.error(error.originalError);
  }
  process.exit(1);
}
```

**Priority:** HIGH

---

### 2. Configuration Management 📋

**Current State:** No configuration support

**Improvements:**

- Add `~/.licpickrc` support for user preferences
- Add project-level `.licpickrc.json` for project-specific settings
- Support environment variables like `LICPICK_DEBUG=true`

**Implementation:**

```javascript
// src/utils/config.js
import os from "os";
import path from "path";
import fs from "fs";

export const loadConfig = () => {
  const userConfig = path.join(os.homedir(), ".licpickrc");
  const projectConfig = path.join(process.cwd(), ".licpickrc.json");

  let config = {
    debug: process.env.LICPICK_DEBUG === "true",
    defaultName: "Public Domain",
  };

  if (fs.existsSync(userConfig)) {
    // merge user config
  }
  if (fs.existsSync(projectConfig)) {
    // merge project config
  }

  return config;
};
```

**Priority:** MEDIUM

---

### 3. Type Safety with JSDoc 🔍

**Current State:** No type annotations

**Improvements:** Add comprehensive JSDoc comments for better IDE support and documentation

```javascript
/**
 * Scores a license against user answers
 * @param {Object} licence - License metadata object
 * @param {string} licence.id - Unique license identifier
 * @param {Object} licence.traits - License traits (copyleft, patent, etc.)
 * @param {Object} licence.weight - Trait weights for scoring
 * @param {string[]} licence.explain - Explanation strings
 * @param {Object} answers - User's questionnaire answers
 * @returns {{score: number, reasons: string[]}} Scoring result
 */
export const score = (licence, answers) => {
  // implementation
};
```

**Priority:** MEDIUM

---

### 4. Logging System 📝

**Current State:** Mixed console.log/console.error calls

**Improvements:** Create centralized logging utility

```javascript
// src/utils/logger.js
import chalk from "chalk";

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

### 1. License Comparison Tool 🔄

**Feature:** Compare multiple licenses side-by-side

```bash
licpick compare mit apache-2.0 gpl-3.0
```

**Benefits:**

- Helps users understand differences
- Encourages informed decisions
- Shows compatibility matrix

**Implementation:**

```javascript
// src/commands/compare.js
export default function compare(licenses) {
  // Create comparison table
  // Show trait differences
  // Highlight trade-offs
}
```

**Priority:** HIGH

---

### 2. Web-Based Interface 🌐

**Feature:** Interactive web UI for license selection

**Benefits:**

- Broader audience (non-CLI users)
- Visual comparisons
- Better for beginners

**Tech Stack Suggestion:** React/Next.js

**Priority:** LOW (Future Release)

---

### 3. SPDX License Support 📦

**Feature:** Support SPDX license identifiers and expressions

```bash
licpick write --licence MIT OR Apache-2.0
```

**Benefits:**

- Industry standard support
- License combination support
- Better integration with other tools

**Priority:** MEDIUM

---

### 4. License Compatibility Checker ✅

**Feature:** Check if selected license is compatible with dependencies

```bash
licpick check-compatibility
```

**Implementation:**

- Parse package.json
- Check licenses of dependencies
- Show compatibility matrix
- Warn about potential conflicts

**Priority:** MEDIUM

---

### 5. GitHub Integration 🐙

**Feature:** Direct GitHub license creation and PR support

```bash
licpick init --github user/repo
```

**Benefits:**

- Direct integration with GitHub repos
- Create LICENSE via GitHub API
- Automatic PR for license addition

**Priority:** LOW

---

### 6. Interactive License Editor 📝

**Feature:** Edit license templates within the CLI

```bash
licpick edit mit
```

**Benefits:**

- Customize licenses for specific needs
- Better than manual file editing
- Syntax validation

**Priority:** LOW

---

## Performance Optimizations

### 1. Caching System 💾

**Issue:** Currently fetches custom licenses on each `install` command

**Solution:**

```javascript
// src/utils/cache.js
export const createCache = () => {
  const cacheDir = path.join(os.homedir(), ".licpick_cache");

  return {
    get: (key) => {
      // Check if cached version exists
    },
    set: (key, value, ttl = 3600) => {
      // Store with TTL
    },
    clear: () => {
      // Clear all cache
    },
  };
};
```

**Priority:** LOW (unless remote installs become common)

---

### 2. Lazy Loading 🚀

**Issue:** All licenses loaded on startup

**Solution:**

- Load core licenses immediately
- Load advanced/custom licenses only when needed
- Implement demand-based loading

**Priority:** LOW (not yet a performance issue)

---

## Testing Strategy

### 1. Unit Tests

**Areas to Test:**

- `engine.js` - Scoring algorithm
- `utils/validateLicence.js` - License validation

```javascript
// test/engine.test.js
import { score } from "../src/engine.js";

describe("License Scoring", () => {
  test("should add weight for matching traits", () => {
    const licence = {
      traits: { copyleft: false },
      weight: { copyleft: 3 },
      explain: [],
    };
    const answers = { copyleft: false };
    const result = score(licence, answers);
    expect(result.score).toBe(3);
  });

  test("should subtract weight for non-matching traits", () => {
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

**Recommended Tool:** Jest

**Priority:** HIGH

---

### 2. Integration Tests

**Areas to Test:**

- Command execution flow
- File system operations
- Remote license installation

```bash
# test/integration/commands.test.js
Test: licpick list returns all licenses
Test: licpick write creates valid LICENSE file
Test: licpick install adds custom license
```

**Priority:** HIGH

---

### 3. E2E Tests

**Scenario Testing:**

```javascript
// test/e2e/user-flows.test.js
describe("User Flows", () => {
  test("Complete init flow: answer -> recommend -> write", async () => {
    // Simulate user interaction
    // Verify output
    // Check file creation
  });
});
```

**Priority:** MEDIUM

---

### 4. Test Coverage Goals

```
Target: 80%+ coverage
- engine.js: 100%
- utils: 95%
- commands: 70%
- plugins: 60%
```

---

## Documentation Improvements

### 1. API Documentation

**Create:** `docs/API.md`

```markdown
## Module: engine.js

### score(licence, answers) → Object

Calculates compatibility score between license and user answers.

**Parameters:**

- licence: License object with traits and weights
- answers: User questionnaire answers

**Returns:** {score: number, reasons: string[]}

**Example:**
```

**Priority:** MEDIUM

---

### 2. Architecture Documentation

**Create:** `docs/ARCHITECTURE.md`

Explain:

- Data flow diagram
- How scoring works
- Plugin system architecture
- Extensibility points

**Priority:** MEDIUM

---

### 3. Tutorial Videos

**Create:** Video tutorials for:

- Getting started
- Adding custom licenses
- Using debug mode

**Priority:** LOW

---

## Bug Fixes and Known Issues

### 1. File Path Handling on Windows 🪟

**Issue:** Inconsistent path handling on Windows systems

**Current:**

```javascript
const licenceFilePath = path.join(
  __dirname,
  "../templates/",
  `${licenceName}.txt`,
);
```

**Status:** Needs validation on Windows

**Fix:**

```javascript
// Use path.resolve for consistency
const licenceFilePath = path.resolve(
  __dirname,
  "..",
  "templates",
  `${licenceName}.txt`,
);
```

**Priority:** MEDIUM

---

### 2. License Template Placeholders 🏷️

**Issue:** Limited placeholder support (only `[fullname]` and `[year]`)

**Enhancement:**

```javascript
// Support more placeholders:
// [year] - Current year
// [fullname] - User/Organization name
// [email] - User email
// [url] - Project URL
// [description] - Project description
```

**Priority:** MEDIUM

---

### 3. License Metadata Validation

**Issue:** `validateLicence.js` validation rules unclear

**Enhancement:**

```javascript
// src/utils/validateLicence.js - Add comprehensive validation
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

### 4. Promise Handling

**Issue:** Mixed Promise/async-await patterns

**Current State:**

```javascript
inquirer
  .prompt(questions)
  .then(async (answers) => {
    // mixing .then() with async
  })
  .catch((error) => {
    // error handling
  });
```

**Fix:** Standardize to async/await

```javascript
export default async function init(options) {
  try {
    const answers = await inquirer.prompt(questions);
    // use answers
  } catch (error) {
    // handle error
  }
}
```

**Priority:** HIGH

---

### 5. Missing Error Messages

**Issue:** Some errors are too generic

**Current:**

```javascript
if (!res.ok) {
  console.error(
    chalk.red(`Failed to fetch licence from ${remoteURL}: ${res.statusText}`),
  );
  return;
}
```

**Improvement:**

```javascript
if (res.status === 404) {
  console.error(chalk.red(`License not found at ${remoteURL} (404)`));
} else if (res.status === 403) {
  console.error(chalk.red(`Access denied to ${remoteURL} (403)`));
} else {
  console.error(
    chalk.red(
      `Failed to fetch from ${remoteURL}: ${res.status} ${res.statusText}`,
    ),
  );
}
```

**Priority:** MEDIUM

---

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/Thamidu-Nadun/licpick.git
cd licpick

# Install dependencies
npm install

# Run in development
npm start -- init

# Test commands
npm start -- list
npm start -- write --licence mit

# Debug mode
NODE_DEBUG=* npm start -- init --debug
```

### Code Style Guidelines

- Use ESM (import/export)
- 4-space indentation
- Descriptive variable names
- Comments for complex logic
- 80 character line length preference

### Commit Message Format

```
[type]: [description]

# Types: feat, fix, docs, refactor, test, perf, chore
# Example: feat: add license comparison command
```

### Pull Request Process

1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes with tests
3. Update documentation
4. Ensure all tests pass: `npm test`
5. Submit PR with description of changes

---

## Performance Metrics to Track

- Command execution time
- Memory usage with large license sets
- File I/O operations time
- Network request time for remote installs

---

## Security Considerations

1. **Remote URL Validation**: Validate URLs before fetching
2. **License Content Sanitization**: Ensure template content is safe
3. **File Permissions**: Validate write permissions before creating files
4. **Input Validation**: Sanitize all user inputs

---

## Future Roadmap

### Phase 1 (Current)

- [x] 8 core licenses
- [x] Interactive recommendation
- [x] Custom license installation

### Phase 2 (Next)

- [ ] Unit test coverage (80%+)
- [ ] License comparison tool
- [ ] Enhanced error messages
- [ ] Configuration support

### Phase 3 (Future)

- [ ] Web interface
- [ ] GitHub integration
- [ ] License compatibility checker
- [ ] SPDX expression support

### Phase 4 (Long-term)

- [ ] Desktop application
- [ ] IDE plugins (VS Code, JetBrains)
- [ ] Pre-commit hook integration
- [ ] AI-powered recommendations

---

## Contributing to Improvements

When implementing improvements:

1. **Create an issue** first to discuss the change
2. **Reference the issue** in your PR
3. **Add tests** for new functionality
4. **Update README.md** if user-facing changes
5. **Update this file** if developer-facing changes

---

## Questions or Suggestions?

Open an issue on GitHub or contact the maintainers.

Happy coding! 🚀
