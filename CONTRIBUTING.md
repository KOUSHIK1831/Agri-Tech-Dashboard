# Contributing to Agri-Tech Dashboard 🌾

Thank you for your interest in contributing! We value clean code, thorough documentation, and a friendly developer experience. This project follows high quality standards to ensure a reliable tool for the agricultural community.

---

## Local Setup

1. **Fork & Clone:** Create your own branch from `main`.
2. **Setup:** Install dependencies and tools:
   ```bash
   npm install
   ```
3. **Quality Check:** Before pushing, ensure your code passes the same checks that CI runs.

---

## Quality & DX Commands

Use these commands locally to maintain the "Minimal & Clean" standard:

| Task              | Command             |
| :---------------- | :------------------ |
| **Linting**       | `npm run lint`      |
| **Formatting**    | `npm run format`    |
| **Type Checking** | `npm run typecheck` |
| **Tests**         | `npm run test:run`  |
| **Coverage**      | `npm run coverage`  |
| **Dead Code**     | `npm run deadcode`  |
| **Build**         | `npm run build`     |

---

## Commit Guidelines

We follow **Conventional Commits** to keep our history readable and automated:

- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `test:` for adding or updating tests.
- `chore:` for maintenance or configuration.
- `ci:` for CI/CD changes.

Example: `feat: add price alerts for specific commodities`

---

## Workflow Requirements

1. **Keep it Small:** Prefer small, focused pull requests.
2. **Parity Check:** If you add a new translation key to `src/i18n/en.ts`, ensure you also update `hi.ts` and `te.ts` (using placeholders if necessary).
3. **Test Your Changes:**
   - Every utility function must have a unit test.
   - UI changes should be verified in the browser and covered by component tests.
4. **CI Success:** Your branch must pass the GitLab CI pipeline (Install ➔ Lint ➔ Build) before merging.

---

## 🤝 Code of Conduct

Be respectful, patient, and helpful. We are building this for the community!
