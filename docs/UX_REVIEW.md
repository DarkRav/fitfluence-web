# UX Review: Influencer Workflows (web-admin)

## Scope

Role: influencer working daily with programs, versions, workouts, exercises, progression, and descriptions.

Reviewed scenarios:

1. Program creation from scratch
2. New version creation
3. Adding a workout
4. Adding exercises into a workout
5. Editing exercise parameters
6. Navigating between versions
7. Understanding statuses (draft/published)
8. Going back without losing data

## Current Flow Audit

### 1) Program creation from scratch

- Current path: Programs list -> "Create program" modal -> fill many fields -> submit -> program details.
- Typical clicks: 5-9 (open modal, fill + optional fields, submit, continue).
- Friction:
  - Create modal mixes required + optional metadata at once.
  - Goals input expects comma format (implicit rule).
  - No guard against accidental close with unsaved changes.

### 2) New version creation

- Current path: Program details -> version picker action "Create version" -> modal -> submit.
- Typical clicks: 3-5.
- Friction:
  - Version context is partially hidden in select labels.
  - Status visibility is weak at glance during editing.

### 3) Adding a workout

- Current path: Program details (workouts tab) -> "Create workout" -> modal -> submit -> stay on list.
- Typical clicks: 4-6.
- Friction:
  - Extra step after create: user must manually open created workout to continue editing.
  - Form includes optional long note in same step as required data.

### 4) Adding exercises to workout

- Current path: Workout details -> "Add exercise" -> search -> pick -> fill params -> submit.
- Typical clicks: 6-10 per exercise.
- Friction:
  - Repeated open/close cycle for bulk adding exercises.
  - Optional fields always visible, increasing cognitive load.

### 5) Editing exercise parameters

- Current path: Workout details -> select exercise in list -> edit fields -> save.
- Typical clicks: 3-6 per exercise.
- Friction:
  - Dense form with limited grouping.
  - No explicit unsaved-change guard if user navigates away.

### 6) Navigation between versions

- Current path: Program details -> version picker.
- Friction:
  - Version is query-param driven and not always obvious in page context.
  - Breadcrumb trail is inconsistent across screens.

### 7) Status understanding (draft/published)

- Current state:
  - Program status is visible in header.
  - Version status is visible mostly inside selector labels.
- Friction:
  - Low salience while editing workouts for a selected version.

### 8) Return back without data loss

- Current state:
  - Most forms rely on explicit save only.
- Friction:
  - User can close dialog with dirty form state accidentally.
  - No preventive confirmation in key forms.

## Core UX Problems (Prioritized)

1. Too many "full" forms for create actions; required and optional data are not separated.
2. Weak context awareness (where user is: program/version/workout).
3. Extra clicks in workouts workflow (create workout -> open workout).
4. Bulk adding exercises is slower than needed.
5. Unsaved change protection is missing in key forms.
6. Version status clarity is insufficient during editing.

## UX Improvements Implemented (This Change Set)

1. Unified breadcrumb + context blocks for program/version/workout navigation.
2. Program/workout create forms simplified: required first, optional fields in expandable "Advanced" sections.
3. Unsaved-changes guard for critical dialogs/forms (cancel/close confirmation).
4. Workout creation now redirects straight to created workout details.
5. Add-exercise flow optimized for repetitive use (keep-open mode for batch adding).
6. Version context visibility improved with explicit selected-version status chip.
7. Copy and hints unified to reduce hidden logic and ambiguity.

## Expected Outcome

- Fewer clicks in main creation/edit loops.
- Lower cognitive load in create dialogs.
- Faster "program -> version -> workout -> exercise" throughput.
- Reduced frustration from accidental form dismissal.
- Stronger orientation and status clarity for non-technical influencer users.
