# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A demo website for a **fictional** HVAC company ("Summit Air Heating & Cooling"), used as a portfolio piece for HVAC prospects. Brand details (name, phone, hours) live in `src/app/data/company.ts`; services, service areas and sample reviews are static data in `src/app/data/`. Forms validate locally and show a confirmation. Nothing is sent to a backend. Design and plan: `docs/superpowers/specs/` and `docs/superpowers/plans/`.

## Repository layout

The git root is the parent directory (`Desktop/ItOne`); the Angular app lives in this nested `ItOne/` folder. Run all npm/ng commands from here.

## Commands

- `npm start` (`ng serve`) — dev server at http://localhost:4200
- `npm run build` — production build to `dist/` (default configuration is `production`)
- `npm run watch` — development build in watch mode
- `npm test` (`ng test`) — Vitest unit tests via `@angular/build:unit-test` (jsdom)
- `npx ng test --include src/app/app.spec.ts --watch=false` — run a single spec file once
- `npx prettier --write .` — format (printWidth 100, single quotes, Angular parser for `.html`)

No linter is configured.

## Architecture

- Angular 22 standalone app: `src/main.ts` calls `bootstrapApplication(App, appConfig)`. App-wide providers go in `src/app/app.config.ts`; routes in `src/app/app.routes.ts` (currently empty — add feature routes as lazy `loadComponent`/`loadChildren`).
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` (`.postcssrc.json`), pulled in with `@import 'tailwindcss'` in `src/styles.css`. There is no `tailwind.config.js`; configure Tailwind in CSS.
- Production budgets (`angular.json`): initial bundle warns at 500kB / errors at 1MB; each component stylesheet warns at 4kB / errors at 8kB — prefer Tailwind utilities over large component CSS.
- `.mcp.json` registers the Angular CLI MCP server (`npx @angular/cli mcp`) for Angular docs and best-practice lookups.

## Coding conventions

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
