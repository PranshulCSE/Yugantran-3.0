# Registrations UI Redesign

## Goal
Redesign the `RegistrationsManager.tsx` interface to improve the UX for verifying incoming event registrations. The current full-width data table is too wide and requires excessive horizontal scanning and modal toggling. The new design uses a split-view "mailbox" architecture to prioritize rapid verification.

## Architecture & Layout
The interface will be converted from a `<table>` layout to a CSS Grid 2-column layout.

### 1. The Feed (Left Column)
- **Width:** ~35% (lg: 4/12 or 5/12 grid span).
- **Behavior:** Scrollable list (Y-axis) with hidden/styled scrollbars.
- **Top Bar:** Search input and Status filters (All, Pending, Confirmed, Rejected).
- **Cards:** Each registration is rendered as a compact card displaying:
  - Participant Name
  - Event Name (Badge)
  - Team Name
  - Status indicator (Dot)
- **Interaction:** Clicking a card updates the `selectedReg` state, applying a distinct active style (e.g. cyan border/glow) to the card.

### 2. The Inspector (Right Column)
- **Width:** ~65% (lg: 8/12 or 7/12 grid span).
- **Behavior:** Sticky/fixed position relative to the viewport, ensuring it remains visible while scrolling the feed.
- **Header:** Large typography for the participant's name and event.
- **Metadata Grid:** A 2-column or 3-column subgrid displaying textual data:
  - Transaction ID (Highlight this as it's critical for verification)
  - College/University
  - Contact Number
  - Email (and Sync status)
- **Payment Proof Viewer:** A large, constrained aspect-ratio container (e.g. `aspect-video` or max-height) displaying the payment proof image directly inline.
- **Action Bar:** Full-width bottom bar with primary verification actions:
  - Approve & Sync (Large Emerald button)
  - Reject (Large Rose/Red outline button)
  - Email action (Secondary)
- **Empty State:** If `selectedReg` is null, display a centered placeholder graphic/text ("Select a registration from the list to begin verification").

## Data Flow & State
- **No Backend Changes:** The component will reuse the existing `adminApi.getRegistrations`, `updateRegistration`, `sendConfirmationEmail`, etc.
- **State Reuse:** Existing React state (`registrations`, `selectedReg`, `filter`, `loading`) remains exactly the same. Only the JSX rendering logic changes.

## UI/UX Pro Max Guidelines Applied
- **Style:** OLED Dark Theme (`#020617` base, `#0F172A` cards).
- **Interactions:** Hover states with smooth transitions (150-300ms). Visible focus states.
- **Typography:** Fira Code/Mono used for Transaction IDs for readability. Orbitron/Space Mono for headers.
- **Accessibility:** Ensure high contrast for text (4.5:1).
- **Layout:** Mobile-responsive. On smaller screens, the layout gracefully collapses (e.g. Inspector takes full screen when a registration is selected, or stacks vertically).

## Scope
This design is fully contained within `RegistrationsManager.tsx`. No other pages or components require modification.
