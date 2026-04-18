# Copilot Project Instructions — POS System

You are assisting in a Point of Sale (POS) system for a bar.

## Tech Stack
- React
- TypeScript
- NextJS
- TailwindCSS
- tailwind-merge
- Jotai
- Radix UI
- ExcelJS
- Lucide React
- React Day Picker
- React Hot Toast
- Recharts

## General Rules

Always:

- Respect existing project architecture
- Use strict TypeScript
- Prefer reusable hooks
- Keep business logic outside UI components
- Use Jotai for global shared state
- Use utility functions for calculations
- Avoid duplicated logic
- Keep components small and focused
- Use descriptive naming
- Keep code readable
- Prefer composition over large components
- Maintain scalability for future modules

## Folder Responsibilities

Use:
- components/ → UI only
- hooks/ → reusable logic
- store/ → atoms and state
- utils/ → calculations/helpers
- types/ → interfaces and types

Never mix responsibilities.

## UI Rules

Always:
- Use TailwindCSS
- Keep responsive design
- Use accessible components
- Keep visual consistency
- Use clean spacing
- Avoid cluttered interfaces
- Preserve POS speed for touch usage

## Business Logic Rules

For sales:
- Validate stock before selling
- Prevent invalid totals
- Support:
  - cash
  - card
  - mixed payments
- Calculate change correctly
- Prevent negative balances

For reports:
- Group by:
  - product
  - category
  - payment method
- Support daily summaries
- Support Excel export

## Debugging

When finding bugs:
- Explain root cause
- Suggest minimal fix
- Avoid rewriting entire modules

## Code Quality Rules

Always:
- Add types to everything
- Handle edge cases
- Prevent null issues
- Avoid any type
- Suggest refactors when needed
- Explain architectural changes before applying them

## When generating code

First:
1. Explain the implementation plan
2. List affected files
3. Mention possible risks
4. Then generate code

## Never

Never:
- Rewrite unrelated files
- Break existing architecture
- Add unnecessary dependencies
- Generate overly complex code
- Duplicate logic already present

## Cash Closing Rules

For cash closing:
- Calculate expected drawer amount
- Compare against physical cash
- Show differences
- Separate by payment method
- Include opening and closing time

## Order Rules

For orders:
- Support notes
- Support item modifiers
- Track kitchen status
- Allow partial payments

If unsure:
ask before making assumptions.