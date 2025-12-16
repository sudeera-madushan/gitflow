# Pull Request Title and Description Generator

Generate a comprehensive PR title and description following the project's Pull Request template format.

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
   - Default: `develop` (for feature branches)
   - Alternative: `main` (for release/hotfix branches)
   - Ask user if unclear: "Which branch should this PR target? (develop/main)"

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

9. **Determine the PR type** from the following options:

   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, missing semi-colons, etc.)
   - `refactor`: Code refactoring (no new features, no bug fixes)
   - `perf`: Performance improvements
   - `test`: Adding or modifying tests
   - `chore`: Maintenance tasks (e.g., build process, dependencies)
   - `revert`: Revert a previous commit

10. **Determine the scope** (optional but recommended) from common scopes:

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

12. **Generate the PR title** following these rules:

    - Use **imperative mood** (e.g., "add feature" not "added feature")
    - Keep it **concise** (60 characters maximum recommended)
    - **Capitalize** the first letter
    - **Do NOT** end with a period
    - Be specific and descriptive
    - Format: `<type>(<scope>): <jira issue key> - <short description>`

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

    **Description Section Guidelines:**

    a. **Opening statement**: Start with what was introduced/added/fixed at a high level

    - Example: "This PR implements a complete items management system with full CRUD operations..."

    b. **Key changes**: List the major changes made across all files

    - Use specific language: "Introduced", "Added", "Updated", "Removed", "Enhanced", "Implemented"
    - Group related changes together
    - Mention specific files, components, or features
    - Example: "Implemented Item model class with properties for id, name, description, price, and category..."

    c. **API endpoints** (if applicable): List all new/modified endpoints

    - Example: "The API endpoints include: GET /api/items, POST /api/items, etc."

    d. **Features implemented**: List key features, validations, error handling

    - Example: "Features implemented: Name validation (required field), Price validation..."

    e. **Additional details**: Include secondary changes or improvements

    - Use "Additionally," or "Also," to connect multiple changes
    - Example: "Additionally, refactored index.js to integrate the items routing system..."

    **How Has This Been Tested Section:**

    - List specific test cases/scenarios
    - Mention test environment
    - Include edge cases tested
    - Example: "Tested with valid data, invalid data, missing required fields, etc."

    **Additional Information Section:**

    - Architecture notes
    - Future enhancements
    - Breaking changes (if any)
    - Dependencies or setup requirements

    **Description should be:**

    - Comprehensive (cover all significant changes)
    - Specific (mention file names, features, components affected)
    - Narrative-style (tell the story of what changed)
    - Professional (use past tense: "Introduced", "Added", "Updated")
    - Detailed (5-10 sentences minimum for substantial changes)

## Examples

### Example 1: New Feature with Multiple Files

**PR Title:**
```
feat(api): SOF-1202 - Implement items CRUD with MVC architecture
```

**PR Description:**
```markdown
## Description

This PR implements a complete items management system with full CRUD (Create, Read, Update, Delete) operations following the MVC (Model-View-Controller) architecture pattern, consistent with the existing user management implementation. The implementation includes:

- **Item Model**: Class-based item model with properties (id, name, description, price, category) and automatic timestamp tracking (createdAt, updatedAt)
- **ItemRepository**: Data access layer for item persistence using in-memory storage with methods for find, create, update, and delete operations, plus additional search capabilities (findByCategory, findByName)
- **ItemController**: Handles all HTTP requests and responses with proper validation, error handling, and appropriate status codes
- **ItemRoutes**: RESTful API routing module defining endpoints for all CRUD operations
- **Server Integration**: Updated index.js to integrate item routes with a centralized routing mechanism that handles both users and items endpoints

The API endpoints include:
- `GET /api/items` - Retrieve all items
- `GET /api/items/:id` - Retrieve a specific item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an existing item
- `DELETE /api/items/:id` - Delete an item

Features implemented:
- Name validation (required field)
- Price validation (must be a valid positive number)
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Comprehensive error handling with detailed error messages
- Development mode error details
- Consistent JSON response structure
- CORS support for cross-origin requests

## Related Issue

SOF-1202

## Type of Change

Check all that apply:

- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

The implementation has been tested manually using the following methods:

1. **GET /api/items**: Verified retrieval of all items returns correct count and data structure
2. **GET /api/items/:id**: Tested with valid and invalid IDs to verify 404 handling
3. **POST /api/items**: Tested with valid data, missing required fields, and invalid price values
4. **PUT /api/items/:id**: Tested updating existing items and handling non-existent IDs
5. **DELETE /api/items/:id**: Tested deletion of existing items and 404 handling
6. **Routing**: Verified that both `/api/users` and `/api/items` endpoints work correctly
7. **Error Handling**: Confirmed proper error responses with appropriate status codes

**Test Environment**: 
- Node.js server running on port 3000
- Manual testing using HTTP client (Postman/curl)
- Tested with various edge cases and error scenarios

## Additional Information

- The implementation follows the same MVC architecture pattern as the existing User CRUD, ensuring consistency across the codebase
- The implementation uses in-memory storage (ItemRepository) which means data is not persisted across server restarts
- Future enhancements could include database integration for persistent storage
- All endpoints return JSON responses with consistent structure
- Error messages include details in development mode for easier debugging
```

### Example 2: Bug Fix

**PR Title:**
```
fix(api): SOF-1202 - Resolve CORS issue for external clients
```

**PR Description:**
```markdown
## Description

Fixed critical CORS configuration preventing external domains from accessing the API endpoints. Updated API middleware to properly handle preflight OPTIONS requests and added necessary CORS headers for cross-origin resource sharing. The fix includes whitelisting approved domains, implementing proper credentials handling, and ensuring compatibility with both development and production environments.

## Related Issue

SOF-1202

## Type of Change

Check all that apply:

- [x] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

1. Tested CORS preflight requests from different origins
2. Verified allowed origins can successfully make requests
3. Confirmed blocked origins receive proper CORS error responses
4. Tested in both development and production environments

**Test Environment**: 
- Local development server
- Production staging environment
- Multiple browser clients (Chrome, Firefox, Safari)

## Additional Information

- Added comprehensive logging to track CORS-related requests for better debugging and monitoring
- Updated CORS configuration to support credentials for authenticated requests
```

### Example 3: Refactoring

**PR Title:**
```
refactor(components): SOF-1234 - Extract common button logic into reusable hook
```

**PR Description:**
```markdown
## Description

Introduced useButton custom hook to eliminate code duplication and centralize button state management across the application. The hook encapsulates loading states, disabled states, click handlers, and accessibility attributes previously scattered across multiple button components. Refactored Button, IconButton, and SubmitButton components to utilize the new hook, reducing overall codebase by approximately 200 lines while improving maintainability.

## Related Issue

SOF-1234

## Type of Change

Check all that apply:

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [x] Documentation update

## How Has This Been Tested?

1. Verified all button components render correctly with the new hook
2. Tested button interactions (click, hover, disabled states)
3. Confirmed accessibility attributes are properly applied
4. Ran existing test suite - all tests passing

**Test Environment**: 
- React development environment
- Jest unit tests
- Manual browser testing

## Additional Information

- Added comprehensive TypeScript types for better type safety and developer experience
- No breaking changes - all existing button components maintain the same API
```

## Output Format

When generating the PR title and description:

1. **First, provide a summary of analyzed changes**:

   - List all modified, added, and deleted files
   - Briefly describe the nature of changes in each file
   - Identify patterns or themes across changes
   - Show commit history summary

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
   - Check current branch: `git branch --show-current`
   - Default to `develop` for feature branches
   - Use `main` for release/hotfix branches
   - Ask user if unclear

2. **Analyze branch differences using optimized approach**:

   - Run `git log <target-branch>..HEAD --oneline` to see commits
   - Run `git diff <target-branch>..HEAD --stat` to see file sizes and change summary
   - **Filter files** using exclusion patterns (see Performance Optimizations)
   - For small files (<50KB): Run `git diff <target-branch>..HEAD -- <filename>`
   - For large files (50KB-100KB): Run `git diff <target-branch>..HEAD --numstat <filename>`
   - Skip generated/lock files entirely (package-lock.json, etc.)
   - Identify ALL relevant files (excluding filtered ones)
   - Understand the context and purpose of each change
   - **Timeout protection**: If analysis takes >30 seconds, skip remaining large files

3. **Categorize the changes**:

   - Determine the primary PR type
   - Identify the main scope/module affected
   - Note if multiple scopes are involved

4. **Extract or request JIRA issue key** from commits or user

5. **Generate comprehensive PR title and description**:

   - Write concise title (60 chars max recommended)
   - Write detailed description covering:
     - What was introduced/added/changed
     - Key features or fixes implemented
     - API endpoints (if applicable)
     - Additional improvements or updates
     - Testing approach
     - Overall impact or purpose
   - Use narrative style with specific details
   - Fill out all sections of the PR template

6. **Present the PR title and description** with analysis summary

## Important Notes

### PR Title Requirements

- **Always include a JIRA issue key** - this is mandatory
- **Use imperative mood** for the title (e.g., "add" not "added")
- **Title should be 60 characters or less** (recommended)
- **Capitalize the first letter**
- **Do NOT** end with a period
- **Scope is optional** but recommended for better organization

### PR Description Requirements

- **Use past tense** for the description (e.g., "Introduced", "Added", "Updated")
- **Capitalize the first letter** of sentences
- **Detailed description is mandatory** - always provide comprehensive context (minimum 5-10 sentences)
- **Be specific** - mention file names, component names, and specific features
- **Cover all changes** - don't just describe the main change, include additional updates too
- **Use connecting words** - "Additionally," "Also," "Furthermore," to link multiple changes
- **Explain impact** - describe what the changes enable or improve
- **Fill out all template sections** - Description, Related Issue, Type of Change, Testing, Additional Information

### Performance Requirements (To Prevent Hanging)

- **Always check file sizes first** using `git diff <target-branch>..HEAD --stat`
- **Skip generated files** (package-lock.json, yarn.lock, dist/**, build/**)
- **Skip large files >100KB** from detailed analysis
- **Use --numstat for files 50KB-100KB** instead of full diff
- **Only analyze small files <50KB in detail**
- **Stop if >5 large files detected** - provide summary instead
- **Timeout protection**: If analysis exceeds 30 seconds, skip remaining files
- **Mention skipped files** in PR description if relevant to changes

## Tips for Writing Comprehensive PR Descriptions

1. **Start broad, then get specific**: Begin with high-level overview, then dive into details
2. **Use action verbs**: Introduced, Implemented, Added, Updated, Enhanced, Refactored, Fixed
3. **Mention file/component names**: Be explicit about what was changed where
4. **Group related changes**: Combine similar updates into cohesive statements
5. **Include context**: Explain why changes were made or what problem they solve
6. **Note side effects**: Mention any additional improvements or fixes included
7. **Think like documentation**: Write as if explaining to someone reviewing the codebase later
8. **List API endpoints**: If adding/modifying APIs, explicitly list all endpoints
9. **Detail testing approach**: Be specific about what was tested and how
10. **Mention architecture**: Note if following specific patterns (MVC, etc.)

## Analysis Process Example

When you run this command, follow this **optimized** process:

### Step 1: Gather Information (Optimized)

```bash
# Check current branch
git branch --show-current

# Check commits in branch
git log develop..HEAD --oneline

# Get file summary with sizes (FAST)
git diff develop..HEAD --stat

# Identify large files and filter
# Skip: package-lock.json, *.min.js, dist/**, build/**, etc.

# For small files (<50KB), get detailed diff
git diff develop..HEAD -- path/to/small-file.tsx

# For large files (50KB-100KB), get summary only
git diff develop..HEAD --numstat path/to/large-file.tsx

# For very large files (>100KB) or generated files, skip entirely
```

### Step 2: Analyze the Changes

For each file, ask:

- **What changed?** (Added new file, modified existing, deleted?)
- **Why?** (New feature, bug fix, refactoring?)
- **What's the purpose?** (What does this enable or improve?)

### Step 3: Synthesize the Information

Create a summary:

```
Files changed:
1. controllers/ItemController.js (new file) - Controller for items CRUD
2. models/Item.js (new file) - Item model class
3. routes/itemRoutes.js (new file) - Routing for items endpoints
4. index.js (modified) - Added items routing

Commits:
- feat(api): SOF-1202 - implement items CRUD with MVC architecture

Primary change: Added items CRUD API
Secondary change: Updated server routing

Overall purpose: Enable items management functionality
```

### Step 4: Write the PR Title and Description

Title:
- Type: `feat` (new feature)
- Scope: `api` (API endpoints)
- JIRA: `SOF-1202` (from commit)
- Description: Focus on the main addition

Description:
- Section 1: "This PR implements..." (main change at high level)
- Section 2: Specific details about what was added/changed
- Section 3: API endpoints list
- Section 4: Features and validations
- Section 5: "Additionally,..." (secondary changes)
- Section 6: Testing approach
- Section 7: Additional information

### Step 5: Present to User

Show:

1. Analysis summary (commits, files changed and nature of changes)
2. Complete PR title
3. Complete PR description (all template sections filled)
4. Ready-to-copy format

## Troubleshooting Performance Issues

### If the Command Hangs or Takes Too Long

1. **Check branch differences first**:

   ```bash
   git diff <target-branch>..HEAD --stat
   ```

   Look for:

   - Large files (>100KB)
   - Generated files (package-lock.json, yarn.lock)
   - Build output (dist/**, build/**)

2. **Use summary-only mode for large changes**:
   - Skip detailed diff analysis
   - Rely on `git diff <target-branch>..HEAD --stat` and `--numstat`
   - Mention in PR description: "Includes [X] large files with dependency/build updates"

### Common Large File Patterns to Watch For

| File Pattern        | Size Range  | Action                                    |
| ------------------- | ----------- | ----------------------------------------- |
| `package-lock.json` | 200KB-500KB | Skip detailed analysis, mention in PR     |
| `yarn.lock`         | 150KB-400KB | Skip detailed analysis, mention in PR      |
| `pnpm-lock.yaml`    | 100KB-300KB | Skip detailed analysis, mention in PR      |
| `dist/**/*.js`      | 500KB-5MB   | Skip entirely (build output)               |
| `build/**/*`        | Variable    | Skip entirely (build output)              |
| `*.min.js`          | 100KB-1MB   | Skip entirely (minified code)             |
| `*.map`             | 500KB-10MB  | Skip entirely (source maps)               |

### Performance Checklist

Before analyzing changes:

- [ ] Determine target branch (develop/main)
- [ ] Run `git log <target-branch>..HEAD --oneline` to see commits
- [ ] Run `git diff <target-branch>..HEAD --stat` first
- [ ] Identify files >50KB
- [ ] Skip generated files (package-lock, yarn.lock, etc.)
- [ ] Skip build output (dist/**, build/**)
- [ ] Use `--numstat` for files 50KB-100KB
- [ ] Use full diff only for files <50KB
- [ ] Set mental timeout of 30 seconds
- [ ] If hanging, cancel and use summary mode

