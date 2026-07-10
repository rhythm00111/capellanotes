# Architecture Standards

## Permanent engineering rules for the Notes feature

1. One responsibility per folder.
2. One canonical implementation per domain.
3. No duplicate utilities across feature layers.
4. No deep imports outside the feature boundary unless explicitly approved.
5. No provider-specific AI code inside core note domain modules.
6. No cross-feature dependencies for domain logic.
7. All external access should flow through the feature public API.
8. UI components should not own persistence concerns directly.
9. State mutations should be routed through a single feature-owned store or service contract.
10. Feature behavior should be testable without relying on implementation shims.

## Additional standards
- New folders should be introduced only when they correspond to a new domain with a clear boundary.
- Compatibility shims should be temporary and explicitly marked.
- Shared utilities should be owned by a single canonical module.
- Business logic should be split from presentation logic where practical.
- The editor domain should not become a transport layer for unrelated concerns.
