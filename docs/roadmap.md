# PayGate Roadmap

## Milestones
### 1. Scaffold Next.js frontend, API service, database schema, and shared UI shell.
- Deliverable: a working, testable slice that can be committed and reviewed independently.
- Acceptance: docs updated, local checks pass, and any onchain or x402 behavior verified on Base mainnet with demo limits before production scale.

### 2. Implement creator publish/edit flow with draft and published states.
- Deliverable: persisted creator console with draft creation, inventory inspection, and publish-state transitions.
- Acceptance: browser flow creates a draft through the API, updates draft count, publishes the selected report, and disables duplicate publish.

### 3. Add x402-protected full content endpoint and paid reader unlock flow.
- Deliverable: 402 challenge, facilitator-ready `x-payment` verification, demo-mode local unlock, and persisted receipt logging.
- Acceptance: unpaid requests return 402, paid/demo requests return content plus receipt, stats update after unlock, and smoke checks cover the flow.

### 4. Build PayGate MCP plugin spec and tool handlers for search, preview, and paid access.
- Deliverable: a working, testable slice that can be committed and reviewed independently.
- Acceptance: docs updated, local checks pass, and any onchain or x402 behavior verified on Base mainnet with demo limits before production scale.

### 5. Ship analytics dashboard, demo content, docs, Base mainnet verification, and Base mainnet launch.
- Deliverable: a working, testable slice that can be committed and reviewed independently.
- Acceptance: docs updated, local checks pass, and any onchain or x402 behavior verified on Base mainnet with demo limits before production scale.

## Commit Standard
- `feat:` user-facing behavior.
- `fix:` bug fixes.
- `docs:` documentation and launch notes.
- `test:` automated tests.
- `chore:` tooling and maintenance.
- `contracts:` Solidity and deployment changes.

## Launch Standard
- Public README is current.
- Demo script is executable by another builder.
- x402 and Base MCP flows are documented.
- Mainnet actions are small, explicit, and user-approved.
