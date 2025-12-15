# Commit Message Generator

Generate a comprehensive commit message following the GitHub Commit Guidelines format.

## Commit Message Format

**Required Format:**

```
<type>(<scope>): <jira issue key> - <short description>

<detailed longer description>
```

## Instructions

### Performance Optimizations (CRITICAL)

**To prevent hanging on large files, follow these steps in order:**

1. **First, get a summary of staged files with sizes**:

   ```bash
   git diff --staged --stat
   ```

2. **Exclude these file patterns from detailed analysis** (skip for commit message):

   - `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - `*.min.js`, `*.min.css`
   - `dist/**`, `build/**`, `out/**`
   - `node_modules/**`
   - `*.log`, `*.map`
   - `*.jpg`, `*.png`, `*.gif`, `*.svg` (images)
   - `*.pdf`, `*.zip`, `*.tar.gz` (binary files)
   - Any file larger than 100KB

3. **For large files (50KB-100KB)**, use summary only:

   ```bash
   git diff --staged --numstat <filename>
   ```

   This shows: `<lines-added> <lines-deleted> <filename>`

4. **For small files (<50KB)**, use detailed diff:

   ```bash
   git diff --staged -- <filename>
   ```

5. **If more than 5 large files are detected**, only summarize changes:
   - Mention that large files were modified
   - Focus on small file changes for detailed description
   - Add note: "Also includes changes to [list large files]"

### File Analysis Strategy

**Step-by-step process:**

1. Run `git status` to list all staged files
2. Run `git diff --staged --stat` to see file sizes and change counts
3. Filter files into categories:
   - **Skip entirely**: Generated/lock files (from exclusion patterns above)
   - **Summary only**: Large files (50KB-100KB)
   - **Detailed analysis**: Small files (<50KB)
4. Only run full `git diff --staged` on files in the "Detailed analysis" category
5. Use `--numstat` for "Summary only" files

6. **Thoroughly analyze the git changes** using the optimized approach:

   - **Start with**: `git status` to see modified files
   - **Then use**: `git diff --staged --stat` for overview with sizes
   - **Filter files**: Apply exclusion patterns (see Performance Optimizations above)
   - **Analyze small files**: Run full diff only on files <50KB
   - **Summarize large files**: Use `--numstat` for files 50KB-100KB
   - **Skip generated files**: Exclude lock files, builds, node_modules
   - Identify ALL relevant files (excluding filtered ones)
   - Understand the nature of each change (new files, modifications, deletions)
   - Analyze the actual code changes in analyzed files
   - Look for patterns across multiple files
   - Identify the overall purpose and impact of the changes

7. **Determine the commit type** from the following options:

   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, missing semi-colons, etc.)
   - `refactor`: Code refactoring (no new features, no bug fixes)
   - `perf`: Performance improvements
   - `test`: Adding or modifying tests
   - `chore`: Maintenance tasks (e.g., build process, dependencies)
   - `revert`: Revert a previous commit

8. **Determine the scope** (optional but recommended) from common scopes:

   - `auth` (authentication)
   - `dashboard`
   - `api`
   - `checkout`
   - `database`
   - `components`
   - `routing`
   - `hooks`
   - `utils`
   - `styles`
   - `config`
   - Or other relevant module/feature name

9. **Request or infer the JIRA issue key**:

   - If the user hasn't provided it, ask: "Please provide the JIRA issue key (e.g., SOF-1202, JIRA-123)"
   - If the branch name or recent commits contain an issue key, you may infer it
   - Format: `SOF-1202`, `JIRA-123`, `CUS-45`, etc.

10. **Generate the short description** following these rules:

    - Use **imperative mood** (e.g., "add feature" not "added feature")
    - Keep it **concise** (50 characters maximum for the subject line)
    - **Capitalize** the first letter
    - **Do NOT** end with a period
    - Be specific and descriptive

11. **Generate a comprehensive longer description** that includes:

    **Structure for detailed description:**

    a. **Opening statement**: Start with what was introduced/added/fixed at a high level

    - Example: "Introduced a new script for automated code reviews..."

    b. **Key changes**: List the major changes made across all files

    - Use specific language: "Introduced", "Added", "Updated", "Removed", "Enhanced", "Implemented"
    - Group related changes together
    - Example: "The review highlights critical issues, security vulnerabilities, and code quality improvements..."

    c. **Additional details**: Include secondary changes or improvements

    - Use "Additionally," or "Also," to connect multiple changes
    - Example: "Additionally, updated debug log messages in LeadsContent for better clarity."

    d. **Impact/Purpose**: Explain what these changes achieve or enable

    - Example: "This enables automated quality checks and improves debugging capabilities."

    **Description should be:**

    - Comprehensive (cover all significant changes)
    - Specific (mention file names, features, components affected)
    - Narrative-style (tell the story of what changed)
    - Professional (use past tense: "Introduced", "Added", "Updated")
    - Detailed (3-5 sentences minimum for substantial changes)

## Examples

### Example 1: New Feature with Multiple Files

```
feat(auth): SOF-1202 - add OTP authentication for login

Introduced comprehensive OTP-based authentication system for enhanced login security. Implemented email-based OTP generation and validation in the authentication service, added new OTP input component with auto-focus and paste handling, and integrated OTP verification flow into the existing login process. Additionally, updated the user interface to display OTP entry screens and added proper error handling for invalid or expired OTPs. This implementation includes rate limiting to prevent abuse and ensures secure token generation using cryptographic standards.
```

### Example 2: Bug Fix with Impact

```
fix(api): SOF-1202 - resolve CORS issue for external clients

Fixed critical CORS configuration preventing external domains from accessing the API endpoints. Updated API middleware to properly handle preflight OPTIONS requests and added necessary CORS headers for cross-origin resource sharing. The fix includes whitelisting approved domains, implementing proper credentials handling, and ensuring compatibility with both development and production environments. Additionally, added comprehensive logging to track CORS-related requests for better debugging and monitoring.
```

### Example 3: Refactoring with Rationale

```
refactor(components): SOF-1234 - extract common button logic into reusable hook

Introduced useButton custom hook to eliminate code duplication and centralize button state management across the application. The hook encapsulates loading states, disabled states, click handlers, and accessibility attributes previously scattered across multiple button components. Refactored Button, IconButton, and SubmitButton components to utilize the new hook, reducing overall codebase by approximately 200 lines while improving maintainability. Additionally, added comprehensive TypeScript types for better type safety and developer experience.
```

### Example 4: Multiple Changes

```
chore(tooling): SOF-5678 - add automated code review system

Introduced a new automated code review script that analyzes the entire React TypeScript codebase for quality issues, security vulnerabilities, and best practice violations. The script generates comprehensive review reports highlighting critical issues such as missing error handling, accessibility concerns, and performance optimization opportunities. Implemented custom rules for React component analysis, TypeScript type checking, and Tailwind CSS usage patterns. Additionally, updated debug log messages in LeadsContent component to include contextual information for better log identification and debugging. This enhancement enables proactive code quality monitoring and facilitates systematic improvements across the application.
```

### Example 5: Documentation Updates

```
docs(guides): SOF-5678 - update installation and configuration guides

Added comprehensive step-by-step installation guide covering prerequisites, dependency management, and environment setup for both development and production environments. Introduced new troubleshooting section addressing common installation issues including Node version conflicts, dependency resolution problems, and build configuration errors. Updated API configuration documentation to reflect recent authentication changes and added examples for all supported authentication methods. Additionally, created quick-start guide for new developers with annotated code examples and best practices.
```

### Example 6: Handling Large Files

```
chore(deps): SOF-9999 - update project dependencies

Updated multiple project dependencies to their latest stable versions for improved security and performance. Modified package.json to include React 18.2.0, TypeScript 5.0.4, and Vite 4.3.9, along with their corresponding type definitions and related packages. The package-lock.json reflects these dependency updates with resolved version conflicts and updated transitive dependencies. Additionally, verified compatibility of all updated packages and confirmed successful build process with the new dependency versions.

Note: package-lock.json changes (~5000 lines) summarized for commit efficiency.
```

## Output Format

When generating the commit message:

1. **First, provide a summary of analyzed changes**:

   - List all modified, added, and deleted files
   - Briefly describe the nature of changes in each file
   - Identify patterns or themes across changes

2. **Then, show the commit message** in the exact format:

   ```
   <type>(<scope>): <jira issue key> - <short description>

   <comprehensive detailed description covering all changes>
   ```

3. **Provide the full commit message** ready to use with `git commit -m "..." -m "..."`

## Workflow

1. **Analyze staged changes using optimized approach**:

   - Run `git status` to see modified files
   - Run `git diff --staged --stat` to see file sizes and change summary
   - **Filter files** using exclusion patterns (see Performance Optimizations)
   - For small files (<50KB): Run `git diff --staged -- <filename>`
   - For large files (50KB-100KB): Run `git diff --staged --numstat <filename>`
   - Skip generated/lock files entirely (package-lock.json, etc.)
   - Identify ALL relevant files (excluding filtered ones)
   - Understand the context and purpose of each change
   - **Timeout protection**: If analysis takes >30 seconds, skip remaining large files

2. **Categorize the changes**:

   - Determine the primary commit type
   - Identify the main scope/module affected
   - Note if multiple scopes are involved

3. **Request JIRA issue key** if not provided or inferred

4. **Generate comprehensive commit message**:

   - Write concise subject line (50 chars max)
   - Write detailed description covering:
     - What was introduced/added/changed
     - Key features or fixes implemented
     - Additional improvements or updates
     - Overall impact or purpose
   - Use narrative style with specific details

5. **Present the commit message** with analysis summary

## Important Notes

### Commit Message Requirements

- **Always include a JIRA issue key** - this is mandatory
- **Use imperative mood** for the subject line (e.g., "add" not "added")
- **Use past tense** for the detailed description (e.g., "Introduced", "Added", "Updated")
- **Subject line must be 50 characters or less**
- **Capitalize the first letter** of the description
- **No period** at the end of the subject line
- **Scope is optional** but recommended for better organization
- **Detailed description is mandatory** - always provide comprehensive context (minimum 3-5 sentences)
- **Be specific** - mention file names, component names, and specific features
- **Cover all changes** - don't just describe the main change, include additional updates too
- **Use connecting words** - "Additionally," "Also," "Furthermore," to link multiple changes
- **Explain impact** - describe what the changes enable or improve

### Performance Requirements (To Prevent Hanging)

- **Always check file sizes first** using `git diff --staged --stat`
- **Skip generated files** (package-lock.json, yarn.lock, dist/**, build/**)
- **Skip large files >100KB** from detailed analysis
- **Use --numstat for files 50KB-100KB** instead of full diff
- **Only analyze small files <50KB in detail**
- **Stop if >5 large files detected** - provide summary instead
- **Timeout protection**: If analysis exceeds 30 seconds, skip remaining files
- **Mention skipped files** in commit message if relevant to changes (e.g., "Updated dependencies in package-lock.json")

## Tips for Writing Comprehensive Descriptions

1. **Start broad, then get specific**: Begin with high-level overview, then dive into details
2. **Use action verbs**: Introduced, Implemented, Added, Updated, Enhanced, Refactored, Fixed
3. **Mention file/component names**: Be explicit about what was changed where
4. **Group related changes**: Combine similar updates into cohesive statements
5. **Include context**: Explain why changes were made or what problem they solve
6. **Note side effects**: Mention any additional improvements or fixes included
7. **Think like documentation**: Write as if explaining to someone reviewing the codebase later

## Analysis Process Example

When you run this command, follow this **optimized** process:

### Step 1: Gather Information (Optimized)

```bash
# Check what files are staged
git status

# Get file summary with sizes (FAST)
git diff --staged --stat

# Identify large files and filter
# Skip: package-lock.json, *.min.js, dist/**, build/**, etc.

# For small files (<50KB), get detailed diff
git diff --staged -- path/to/small-file.tsx

# For large files (50KB-100KB), get summary only
git diff --staged --numstat path/to/large-file.tsx

# For very large files (>100KB) or generated files, skip entirely
```

### Step 1a: File Filtering Logic

```
Example staged files:
1. src/components/Button.tsx (5KB) → ✓ Analyze in detail
2. package-lock.json (250KB) → ✗ Skip (generated file)
3. src/pages/Dashboard.tsx (45KB) → ✓ Analyze in detail
4. dist/bundle.js (1.2MB) → ✗ Skip (build output)
5. src/utils/helpers.ts (80KB) → ⚠ Summary only (--numstat)

Result: Analyze files 1 and 3 in detail, summarize file 5, skip files 2 and 4
```

### Step 2: Analyze the Changes

For each file, ask:

- **What changed?** (Added new file, modified existing, deleted?)
- **Why?** (New feature, bug fix, refactoring?)
- **What's the purpose?** (What does this enable or improve?)

### Step 3: Synthesize the Information

Create a mental (or written) summary:

```
Files changed:
1. review.sh (new file) - Shell script for automated code review
2. review.txt (new file) - Generated review report with findings
3. src/pages/leads/LeadsContent.tsx (modified) - Updated debug logs

Primary change: Added automated review tooling
Secondary change: Improved debug logging

Overall purpose: Enable automated code quality monitoring and improve debugging
```

### Step 4: Write the Commit Message

Subject line:

- Type: `chore` (tooling/maintenance)
- Scope: `tooling` or `review` (based on primary change)
- Description: Focus on the main addition/change

Detailed description:

- Sentence 1: "Introduced..." (main change at high level)
- Sentence 2-3: Specific details about what was added/changed
- Sentence 4: "Additionally,..." (secondary changes)
- Sentence 5: Impact/purpose statement

### Step 5: Present to User

Show:

1. Analysis summary (files changed and nature of changes)
2. Complete commit message (subject + detailed description)
3. Ready-to-use git command

## Troubleshooting Performance Issues

### If the Command Hangs or Takes Too Long

1. **Check staged files first**:

   ```bash
   git diff --staged --stat
   ```

   Look for:

   - Large files (>100KB)
   - Generated files (package-lock.json, yarn.lock)
   - Build output (dist/**, build/**)

2. **Unstage large generated files temporarily** (if they're causing issues):

   ```bash
   git reset HEAD package-lock.json
   git reset HEAD dist/
   ```

   Generate commit message for remaining files, then re-stage:

   ```bash
   git add package-lock.json dist/
   git commit --amend --no-edit
   ```

3. **Use summary-only mode for large changes**:
   - Skip detailed diff analysis
   - Rely on `git diff --staged --stat` and `--numstat`
   - Mention in commit message: "Includes [X] large files with dependency/build updates"

### Common Large File Patterns to Watch For

| File Pattern        | Size Range  | Action                                    |
| ------------------- | ----------- | ----------------------------------------- |
| `package-lock.json` | 200KB-500KB | Skip detailed analysis, mention in commit |
| `yarn.lock`         | 150KB-400KB | Skip detailed analysis, mention in commit |
| `pnpm-lock.yaml`    | 100KB-300KB | Skip detailed analysis, mention in commit |
| `dist/**/*.js`      | 500KB-5MB   | Skip entirely (build output)              |
| `build/**/*`        | Variable    | Skip entirely (build output)              |
| `*.min.js`          | 100KB-1MB   | Skip entirely (minified code)             |
| `*.map`             | 500KB-10MB  | Skip entirely (source maps)               |

### Example: Handling Mixed Small and Large Files

```
Staged files:
✓ src/components/Button.tsx (4KB) - Analyze
✓ src/hooks/useAuth.ts (8KB) - Analyze
⚠ src/utils/helpers.ts (75KB) - Summary only (--numstat)
✗ package-lock.json (350KB) - Skip (generated)
✗ dist/bundle.js (1.8MB) - Skip (build output)

Commit message focus:
- Detail changes in Button.tsx and useAuth.ts
- Mention helpers.ts has 150 lines added
- Note: "Additionally, updated project dependencies (package-lock.json) and rebuilt production bundle."
```

### Performance Checklist

Before analyzing changes:

- [ ] Run `git diff --staged --stat` first
- [ ] Identify files >50KB
- [ ] Skip generated files (package-lock, yarn.lock, etc.)
- [ ] Skip build output (dist/**, build/**)
- [ ] Use `--numstat` for files 50KB-100KB
- [ ] Use full diff only for files <50KB
- [ ] Set mental timeout of 30 seconds
- [ ] If hanging, cancel and use summary mode
