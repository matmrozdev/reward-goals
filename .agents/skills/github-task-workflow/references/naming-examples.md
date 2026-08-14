# Issue and branch naming examples

| Issue title                                       | Branch                                         |
| ------------------------------------------------- | ---------------------------------------------- |
| `chore(repo): configure ESLint and Prettier`      | `chore/4-configure-eslint-and-prettier`        |
| `feat(api): implement user registration`          | `feat/10-implement-user-registration`          |
| `feat(mobile): implement authentication flow`     | `feat/12-implement-authentication-flow`        |
| `test(api): add authentication integration tests` | `test/14-add-authentication-integration-tests` |

Keep the issue scope in the issue title, but omit it from the branch description
because the branch already contains the type and issue ID.

Convert descriptions to lowercase kebab-case, remove punctuation, and preserve
meaningful technology names as lowercase words. Never shorten the name until its
purpose becomes ambiguous.
