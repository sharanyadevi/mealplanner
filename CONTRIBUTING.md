# Contributing to TN Meal Planner

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/mealplanner.git
cd mealplanner
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add weekly summary view
fix: grocery reorder level calculation
docs: update backend setup guide
style: fix spacing in DishesScreen
refactor: extract meal card component
```

## Pull Request Guidelines

- **One feature/fix per PR** — keep PRs focused
- **Describe what and why** — not just what changed
- **TypeScript** — no `any` types; pass `npm run typecheck`
- **No new dependencies** without discussion in an issue first
- **Mobile-first** — test at 375px viewport width

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template. Include:
- Steps to reproduce
- Expected vs actual behaviour
- Browser + OS

## Suggesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template.

## Code Style

- Tailwind for all styling — no inline styles
- Components in `src/components/`, screens in `src/screens/`
- API calls only through `src/api/index.ts`
- Types in `src/types/index.ts`

## License

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE).
