# Pull Request Title and Description Generator (Release to Main)

Generate a comprehensive PR title and description for release branches targeting the main branch, following the project's Pull Request template format.

## PR Title and Description Format

**Required Format:**

```
PR Title: <type>(<scope>): <jira issue key> - <short description>

PR Description: [Follows the PR template structure]
```

## Instructions

### Performance Optimizations (CRITICAL)

**To prevent hanging on large files, follow these steps in order:**

1. **First, get a summary of changes between branches with sizes**:

   ```bash
   git diff <target-branch>..HEAD --stat
   ```

2. **Exclude these file patterns from detailed analysis** (skip for PR description):

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
   git diff <target-branch>..HEAD --numstat <filename>
   ```

   This shows: `<lines-added> <lines-deleted> <filename>`

4. **For small files (<50KB)**, use detailed diff:

   ```bash
   git diff <target-branch>..HEAD -- <filename>
   ```

5. **If more than 5 large files are detected**, only summarize changes:
   - Mention that large files were modified
   - Focus on small file changes for detailed description
   - Add note: "Also includes changes to [list large files]"

### File Analysis Strategy

**Step-by-step process:**

1. **Determine target branch**:

   - **Default: `main`** (for release branches)
   - This command is specifically for release branches targeting main
   - Verify current branch is a release branch: `release/X.Y.Z` format

2. Run `git branch --show-current` to see current branch
3. Run `git log --oneline <target-branch>..HEAD` to see commits
4. Run `git diff <target-branch>..HEAD --stat` to see file sizes and change counts
5. Filter files into categories:
   - **Skip entirely**: Generated/lock files (from exclusion patterns above)
   - **Summary only**: Large files (50KB-100KB)
   - **Detailed analysis**: Small files (<50KB)
6. Only run full `git diff` on files in the "Detailed analysis" category
7. Use `--numstat` for "Summary only" files

8. **Thoroughly analyze the git changes** using the optimized approach:

   - **Start with**: `git log <target-branch>..HEAD` to see commit history
   - **Then use**: `git diff <target-branch>..HEAD --stat` for overview with sizes
   - **Filter files**: Apply exclusion patterns (see Performance Optimizations above)
   - **Analyze small files**: Run full diff only on files <50KB
   - **Summarize large files**: Use `--numstat` for files 50KB-100KB
   - **Skip generated files**: Exclude lock files, builds, node_modules
   - Identify ALL relevant files (excluding filtered ones)
   - Understand the nature of each change (new files, modifications, deletions)
   - Analyze the actual code changes in analyzed files
   - Look for patterns across multiple files
   - Identify the overall purpose and impact of the changes
   - **Check for version bumps**: Look for version number changes in package.json, version files, etc.
   - **Identify release-specific changes**: Bug fixes, last-minute patches, version updates

9. **Determine the PR type** from the following options:

   - `feat`: A new feature (if release includes new features)
   - `fix`: Bug fixes (common in releases)
   - `chore`: Release preparation (version bumps, release notes)
   - `docs`: Documentation updates
   - `refactor`: Code refactoring (no new features, no bug fixes)
   - `perf`: Performance improvements
   - `test`: Adding or modifying tests

10. **Determine the scope** (optional but recommended) from common scopes:

    - `release` (for release-specific changes)
    - `version` (for version bumps)
    - `auth` (authentication)
    - `dashboard`
    - `api`
    - `checkout`
    - `database`
    - `leads`
    - `contacts`
    - `components`
    - `routing`
    - `hooks`
    - `utils`
    - `styles`
    - `config`
    - Or other relevant module/feature name

11. **Request or infer the JIRA issue key**:

    - If the user hasn't provided it, check commit messages: `git log <target-branch>..HEAD --format="%B"`
    - If the branch name contains an issue key, you may infer it
    - Format: `SOF-1202`, `JIRA-123`, `CUS-45`, etc.
    - If not found, ask: "Please provide the JIRA issue key (e.g., SOF-1202, JIRA-123)"
    - **For releases**: The JIRA key might be associated with the release ticket

12. **Generate the PR title** following these rules:

    - Use **imperative mood** (e.g., "release version" not "released version")
    - Keep it **concise** (60 characters maximum recommended)
    - **Capitalize** the first letter
    - **Do NOT** end with a period
    - Be specific and descriptive
    - Format: `<type>(<scope>): <jira issue key> - <short description>`
    - **For releases**: Include version number if relevant (e.g., "release v0.2.1")

13. **Generate a comprehensive PR description** that follows the PR template structure:

    **PR Template Structure:**

    ```markdown
    ## Description

    Describe the changes made and why they were made (e.g., related issue, bug fix, new feature).

    ## Related Issue

    Link to or list the issue(s) this PR addresses (e.g., #123).

    ## Type of Change

    Check all that apply:

    - [ ] Bug fix
    - [ ] New feature
    - [ ] Breaking change
    - [ ] Documentation update

    ## How Has This Been Tested?

    Describe the tests that you ran to verify your changes, including test cases and environments.

    ## Additional Information

    Add any other context, such as screenshots, recordings, or specific instructions for reviewers.
    ```

    **Description Section Guidelines for Releases:**

    a. **Opening statement**: Start with release information at a high level

    - Example: "This release (v0.2.1) includes bug fixes, performance improvements, and prepares the codebase for production deployment..."
    - Mention the version number if applicable

    b. **Key changes**: List the major changes made across all files

    - Use specific language: "Introduced", "Added", "Updated", "Removed", "Enhanced", "Implemented", "Fixed"
    - Group related changes together
    - Mention specific files, components, or features
    - **Highlight version bumps**: Mention if version numbers were updated
    - **List bug fixes**: Detail any critical fixes included in this release
    - Example: "Updated version to 0.2.1 in package.json and version files. Fixed critical authentication bug in UserController..."

    c. **API endpoints** (if applicable): List all new/modified endpoints

    - Example: "The API endpoints include: GET /api/items, POST /api/items, etc."

    d. **Features implemented**: List key features, validations, error handling

    - Example: "Features implemented: Name validation (required field), Price validation..."

    e. **Release-specific information**:

    - Version number changes
    - Bug fixes included
    - Last-minute patches
    - Breaking changes (if any)
    - Migration notes (if applicable)

    f. **Additional details**: Include secondary changes or improvements

    - Use "Additionally," or "Also," to connect multiple changes
    - Example: "Additionally, updated documentation to reflect the new version..."

    **How Has This Been Tested Section:**

    - List specific test cases/scenarios
    - Mention test environment
    - Include edge cases tested
    - **For releases**: Mention staging/production testing if applicable
    - Example: "Tested with valid data, invalid data, missing required fields, etc. Verified in staging environment before release..."

    **Additional Information Section:**

    - Architecture notes
    - Future enhancements
    - Breaking changes (if any)
    - Dependencies or setup requirements
    - **Release notes summary**: Brief summary of what's in this release
    - **Deployment notes**: Any special instructions for deployment

    **Description should be:**

    - Comprehensive (cover all significant changes)
    - Specific (mention file names, features, components affected)
    - Narrative-style (tell the story of what changed)
    - Professional (use past tense: "Introduced", "Added", "Updated")
    - Detailed (5-10 sentences minimum for substantial changes)
    - **Release-focused**: Emphasize what's being released and why

## Examples

### Example 1: Release with Bug Fixes and Version Bump

**PR Title:**

```
chore(release): SOF-1202 - Release v0.2.1 with critical bug fixes
```

**PR Description:**

```markdown
## Description

This release (v0.2.1) includes critical bug fixes and prepares the codebase for production deployment. The release addresses authentication issues discovered during testing and includes version number updates across the project. Key changes include:

- **Version Update**: Updated version to 0.2.1 in package.json and all version-related files
- **Bug Fixes**: Fixed critical authentication bug in UserController that was causing unauthorized access in certain scenarios
- **Error Handling**: Enhanced error handling in OrderController to provide more descriptive error messages
- **Documentation**: Updated API documentation to reflect the latest changes

The release has been thoroughly tested in the staging environment and is ready for production deployment.

## Related Issue

SOF-1202

## Type of Change

Check all that apply:

- [x] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

The release has been tested in the following environments:

1. **Staging Environment**:

   - Verified all authentication flows work correctly
   - Tested order creation and retrieval endpoints
   - Confirmed error handling provides appropriate responses
   - Validated version numbers are correctly updated

2. **Integration Testing**:

   - Tested API endpoints with various input scenarios
   - Verified backward compatibility with existing clients
   - Confirmed no breaking changes were introduced

3. **Manual Testing**:
   - Tested authentication with valid and invalid credentials
   - Verified error messages are user-friendly and informative
   - Confirmed version information is correctly displayed

**Test Environment**:

- Staging server (staging.example.com)
- Node.js v18.x
- PostgreSQL database
- Manual testing using Postman and browser clients

## Additional Information

- **Version**: 0.2.1
- **Breaking Changes**: None
- **Migration Required**: No database migrations needed for this release
- **Deployment Notes**:
  - No special deployment steps required
  - Standard deployment process can be followed
  - Recommend clearing cache after deployment
- **Rollback Plan**: Previous version (0.2.0) can be rolled back if needed
```

### Example 2: Release with New Features

**PR Title:**

```
feat(release): SOF-1202 - Release v0.2.1 with order management features
```

**PR Description:**

```markdown
## Description

This release (v0.2.1) introduces a complete order management system with full CRUD operations, following the MVC architecture pattern. The implementation includes new API endpoints for order management, comprehensive validation, and error handling. Additionally, the version has been updated to 0.2.1 across all relevant files.

Key changes include:

- **Order Management System**: Implemented complete order CRUD operations with Order model, OrderRepository, and OrderController
- **API Endpoints**: Added RESTful endpoints for order management (GET, POST, PUT, DELETE)
- **Version Update**: Updated version to 0.2.1 in package.json
- **Server Integration**: Integrated order routes into the main server application

The API endpoints include:

- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/:id` - Retrieve a specific order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an existing order
- `DELETE /api/orders/:id` - Delete an order

Features implemented:

- Order validation (required fields, data type validation)
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Comprehensive error handling with detailed error messages
- Consistent JSON response structure

## Related Issue

SOF-1202

## Type of Change

Check all that apply:

- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

1. **API Endpoint Testing**:

   - Tested all CRUD operations with valid and invalid data
   - Verified proper error handling for missing or invalid inputs
   - Confirmed appropriate HTTP status codes are returned

2. **Integration Testing**:

   - Tested order creation and retrieval workflows
   - Verified order updates and deletions work correctly
   - Confirmed API responses match expected structure

3. **Staging Environment**:
   - Deployed to staging and verified all endpoints function correctly
   - Tested with various edge cases and error scenarios
   - Validated performance under normal load

**Test Environment**:

- Staging server
- Node.js server running on port 3000
- Manual testing using Postman
- Automated integration tests

## Additional Information

- **Version**: 0.2.1
- **Breaking Changes**: None - all changes are backward compatible
- **Database**: Uses in-memory storage (OrderRepository) - data not persisted across restarts
- **Future Enhancements**: Database integration for persistent storage planned for next release
- **Deployment Notes**: Standard deployment process. No special configuration required.
```

### Example 3: Release with Bug Fixes Only

**PR Title:**

```
fix(release): SOF-1202 - Release v0.2.1 with critical security fixes
```

**PR Description:**

```markdown
## Description

This release (v0.2.1) addresses critical security vulnerabilities and bug fixes discovered during security audit and testing. The release includes fixes for authentication bypass issues, CORS configuration problems, and input validation vulnerabilities. Version has been updated to 0.2.1 to reflect these important fixes.

Key fixes include:

- **Security Fix**: Fixed authentication bypass vulnerability in UserController that allowed unauthorized access
- **CORS Fix**: Resolved CORS configuration issue preventing legitimate cross-origin requests
- **Input Validation**: Enhanced input validation to prevent SQL injection and XSS vulnerabilities
- **Error Handling**: Improved error messages to avoid information leakage
- **Version Update**: Updated version to 0.2.1 in package.json

## Related Issue

SOF-1202

## Type of Change

Check all that apply:

- [x] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

1. **Security Testing**:

   - Tested authentication bypass scenarios - confirmed fix prevents unauthorized access
   - Verified CORS configuration allows legitimate requests while blocking unauthorized origins
   - Tested input validation with various malicious payloads

2. **Functional Testing**:

   - Verified all existing functionality still works correctly
   - Tested error handling to ensure no sensitive information is leaked
   - Confirmed backward compatibility is maintained

3. **Penetration Testing**:
   - Conducted security audit on staging environment
   - Verified all identified vulnerabilities are resolved
   - Confirmed no new vulnerabilities introduced

**Test Environment**:

- Staging server
- Security testing tools
- Manual penetration testing
- Automated security scans

## Additional Information

- **Version**: 0.2.1
- **Security Impact**: High - addresses critical security vulnerabilities
- **Breaking Changes**: None
- **Deployment Priority**: High - recommend immediate deployment
- **Rollback**: Previous version (0.2.0) available if needed, but not recommended due to security issues
- **Deployment Notes**:
  - Immediate deployment recommended
  - No database migrations required
  - Clear cache after deployment
```

## Output Format

When generating the PR title and description:

1. **First, provide a summary of analyzed changes**:

   - List all modified, added, and deleted files
   - Briefly describe the nature of changes in each file
   - Identify patterns or themes across changes
   - Show commit history summary
   - **Highlight version changes**: Note any version number updates
   - **Identify release-specific changes**: Bug fixes, patches, etc.

2. **Then, show the PR title** in the exact format:

   ```
   <type>(<scope>): <jira issue key> - <short description>
   ```

3. **Then, show the complete PR description** following the template structure:

   ```markdown
   ## Description

   ...

   ## Related Issue

   ...

   ## Type of Change

   ...

   ## How Has This Been Tested?

   ...

   ## Additional Information

   ...
   ```

4. **Provide the full PR title and description** ready to copy and paste

## Workflow

1. **Determine target branch**:

   - **Default: `main`** (this command is for release branches)
   - Check current branch: `git branch --show-current`
   - Verify it's a release branch (format: `release/X.Y.Z`)
   - If not a release branch, inform the user this command is for release branches

2. **Analyze branch differences using optimized approach**:

   - Run `git log <target-branch>..HEAD --oneline` to see commits
   - Run `git diff <target-branch>..HEAD --stat` to see file sizes and change summary
   - **Filter files** using exclusion patterns (see Performance Optimizations)
   - For small files (<50KB): Run `git diff <target-branch>..HEAD -- <filename>`
   - For large files (50KB-100KB): Run `git diff <target-branch>..HEAD --numstat <filename>`
   - Skip generated/lock files entirely (package-lock.json, etc.)
   - Identify ALL relevant files (excluding filtered ones)
   - Understand the context and purpose of each change
   - **Check for version bumps**: Look in package.json, version files, etc.
   - **Timeout protection**: If analysis takes >30 seconds, skip remaining large files

3. **Categorize the changes**:

   - Determine the primary PR type (often `chore` for releases, `fix` if bug fixes, `feat` if new features)
   - Identify the main scope/module affected
   - Note if multiple scopes are involved
   - **Identify release nature**: Bug fixes, new features, or maintenance

4. **Extract or request JIRA issue key** from commits or user

5. **Generate comprehensive PR title and description**:

   - Write concise title (60 chars max recommended)
   - Include version number if relevant
   - Write detailed description covering:
     - What's being released (version number)
     - What was introduced/added/changed
     - Key features or fixes implemented
     - API endpoints (if applicable)
     - Version updates
     - Bug fixes included
     - Additional improvements or updates
     - Testing approach
     - Overall impact or purpose
   - Use narrative style with specific details
   - Fill out all sections of the PR template
   - **Emphasize release readiness**: Mention staging testing, production readiness

6. **Present the PR title and description** with analysis summary

## Important Notes

### PR Title Requirements

- **Always include a JIRA issue key** - this is mandatory
- **Use imperative mood** for the title (e.g., "release" not "released")
- **Title should be 60 characters or less** (recommended)
- **Capitalize the first letter**
- **Do NOT** end with a period
- **Scope is optional** but recommended for better organization
- **For releases**: Consider using `release` or `version` as scope

### PR Description Requirements

- **Use past tense** for the description (e.g., "Introduced", "Added", "Updated")
- **Capitalize the first letter** of sentences
- **Detailed description is mandatory** - always provide comprehensive context (minimum 5-10 sentences)
- **Be specific** - mention file names, component names, and specific features
- **Cover all changes** - don't just describe the main change, include additional updates too
- **Use connecting words** - "Additionally," "Also," "Furthermore," to link multiple changes
- **Explain impact** - describe what the changes enable or improve
- **Fill out all template sections** - Description, Related Issue, Type of Change, Testing, Additional Information
- **Mention version number** - Always include the release version in the description
- **Highlight release readiness** - Mention if tested in staging, ready for production, etc.

### Performance Requirements (To Prevent Hanging)

- **Always check file sizes first** using `git diff <target-branch>..HEAD --stat`
- **Skip generated files** (package-lock.json, yarn.lock, dist/**, build/**)
- **Skip large files >100KB** from detailed analysis
- **Use --numstat for files 50KB-100KB** instead of full diff
- **Only analyze small files <50KB in detail**
- **Stop if >5 large files detected** - provide summary instead
- **Timeout protection**: If analysis exceeds 30 seconds, skip remaining files
- **Mention skipped files** in PR description if relevant to changes

## Tips for Writing Comprehensive Release PR Descriptions

1. **Start with version and purpose**: Begin with "This release (vX.Y.Z) includes..."
2. **Use action verbs**: Introduced, Implemented, Added, Updated, Enhanced, Refactored, Fixed
3. **Mention file/component names**: Be explicit about what was changed where
4. **Group related changes**: Combine similar updates into cohesive statements
5. **Include context**: Explain why changes were made or what problem they solve
6. **Note side effects**: Mention any additional improvements or fixes included
7. **Think like documentation**: Write as if explaining to someone reviewing the codebase later
8. **List API endpoints**: If adding/modifying APIs, explicitly list all endpoints
9. **Detail testing approach**: Be specific about what was tested and how
10. **Mention architecture**: Note if following specific patterns (MVC, etc.)
11. **Highlight version changes**: Always mention version number updates
12. **Emphasize release readiness**: Mention staging testing, production readiness
13. **Include deployment notes**: Any special instructions for deployment

## Analysis Process Example

When you run this command, follow this **optimized** process:

### Step 1: Gather Information (Optimized)

```bash
# Check current branch (should be release/X.Y.Z)
git branch --show-current

# Check commits in branch
git log main..HEAD --oneline

# Get file summary with sizes (FAST)
git diff main..HEAD --stat

# Identify large files and filter
# Skip: package-lock.json, *.min.js, dist/**, build/**, etc.

# Check for version changes
git diff main..HEAD -- package.json
git diff main..HEAD -- **/version*

# For small files (<50KB), get detailed diff
git diff main..HEAD -- path/to/small-file.tsx

# For large files (50KB-100KB), get summary only
git diff main..HEAD --numstat path/to/large-file.tsx

# For very large files (>100KB) or generated files, skip entirely
```

### Step 2: Analyze the Changes

For each file, ask:

- **What changed?** (Added new file, modified existing, deleted?)
- **Why?** (New feature, bug fix, refactoring, version bump?)
- **What's the purpose?** (What does this enable or improve?)
- **Is this release-specific?** (Version bump, last-minute fix, etc.)

### Step 3: Synthesize the Information

Create a summary:

```
Files changed:
1. package.json (modified) - Version updated to 0.2.1
2. controllers/UserController.js (modified) - Fixed authentication bug
3. models/Order.js (new file) - Order model for new feature
4. routes/orderRoutes.js (new file) - Routing for orders endpoints

Commits:
- fix(auth): SOF-1202 - fix authentication bypass vulnerability
- feat(api): SOF-1202 - implement order management system
- chore(release): SOF-1202 - bump version to 0.2.1

Primary change: Release v0.2.1 with bug fixes and new features
Secondary change: Version updates

Overall purpose: Prepare codebase for production release
```

### Step 4: Write the PR Title and Description

Title:

- Type: `chore` or `feat` or `fix` (depending on primary change)
- Scope: `release` (for release-specific) or specific module
- JIRA: `SOF-1202` (from commit)
- Description: Focus on the release and main changes

Description:

- Section 1: "This release (v0.2.1) includes..." (main change at high level)
- Section 2: Specific details about what was added/changed/fixed
- Section 3: Version updates
- Section 4: Bug fixes (if any)
- Section 5: API endpoints list (if applicable)
- Section 6: Features and validations (if applicable)
- Section 7: "Additionally,..." (secondary changes)
- Section 8: Testing approach (mention staging/production)
- Section 9: Additional information (deployment notes, etc.)

### Step 5: Present to User

Show:

1. Analysis summary (commits, files changed and nature of changes, version info)
2. Complete PR title
3. Complete PR description (all template sections filled)
4. Ready-to-copy format

## Troubleshooting Performance Issues

### If the Command Hangs or Takes Too Long

1. **Check branch differences first**:

   ```bash
   git diff main..HEAD --stat
   ```

   Look for:

   - Large files (>100KB)
   - Generated files (package-lock.json, yarn.lock)
   - Build output (dist/**, build/**)

2. **Use summary-only mode for large changes**:
   - Skip detailed diff analysis
   - Rely on `git diff main..HEAD --stat` and `--numstat`
   - Mention in PR description: "Includes [X] large files with dependency/build updates"

### Common Large File Patterns to Watch For

| File Pattern        | Size Range  | Action                                |
| ------------------- | ----------- | ------------------------------------- |
| `package-lock.json` | 200KB-500KB | Skip detailed analysis, mention in PR |
| `yarn.lock`         | 150KB-400KB | Skip detailed analysis, mention in PR |
| `pnpm-lock.yaml`    | 100KB-300KB | Skip detailed analysis, mention in PR |
| `dist/**/*.js`      | 500KB-5MB   | Skip entirely (build output)          |
| `build/**/*`        | Variable    | Skip entirely (build output)          |
| `*.min.js`          | 100KB-1MB   | Skip entirely (minified code)         |
| `*.map`             | 500KB-10MB  | Skip entirely (source maps)           |

### Performance Checklist

Before analyzing changes:

- [ ] Verify current branch is a release branch (release/X.Y.Z format)
- [ ] Determine target branch is `main`
- [ ] Run `git log main..HEAD --oneline` to see commits
- [ ] Run `git diff main..HEAD --stat` first
- [ ] Check for version changes in package.json
- [ ] Identify files >50KB
- [ ] Skip generated files (package-lock, yarn.lock, etc.)
- [ ] Skip build output (dist/**, build/**)
- [ ] Use `--numstat` for files 50KB-100KB
- [ ] Use full diff only for files <50KB
- [ ] Set mental timeout of 30 seconds
- [ ] If hanging, cancel and use summary mode
