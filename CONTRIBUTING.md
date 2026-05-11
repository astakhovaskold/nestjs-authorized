# Contributing

## Scope

This repository contains a small NestJS authorization library. Keep contributions focused, explicit, and aligned with the public API documented in [`README.md`](README.md) and [`docs/`](docs/README.md).

## Local Setup

1. Use Node.js `22` from [`.nvmrc`](.nvmrc).
2. Install dependencies:

```bash
npm install
```

3. Build the package:

```bash
npm run build
```

## Contribution Guidelines

- Keep the entrypoint exports in [`src/index.ts`](src/index.ts) aligned with what the README documents
- Prefer small, reviewable pull requests over broad refactors
- Update `README.md` and the relevant page in `docs/` when the public API or package behavior changes
- Do not add undocumented behavior to the bundled controller, guards, or strategies

## Verification

Before opening a pull request:

1. Run `npm run build`
2. Review generated API examples in `README.md` and `docs/`
3. Confirm code snippets still match the exported package surface

## Pull Requests

When opening a pull request, include:

- what changed
- why the change is needed
- whether the public API or runtime behavior changed
- which documentation pages were updated

## Questions

If a change affects the exported API, token flow, or controller behavior, document that explicitly in the pull request description so reviewers can check compatibility. 
