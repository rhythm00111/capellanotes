# Migration Roadmap

## Recommended migration order

1. Constants
2. Types
3. Utils
4. Config
5. Hooks
6. Services
7. Providers
8. Editor
9. Notes
10. Organization
11. Widgets
12. AI
13. Root API

## Rationale

### 1. Constants
Constants should be stabilized first because they are low-risk and used broadly.

### 2. Types
Domain types should be formalized next so that downstream modules can depend on a shared vocabulary.

### 3. Utils
Utility logic should be consolidated before higher-level modules are migrated, to avoid duplicated behavior.

### 4. Config
Route and environment-related configuration should be normalized before feature modules begin to depend on it.

### 5. Hooks
Hooks sit between UI and state; they should be standardized before service and editor logic are reorganized.

### 6. Services
The service layer should be aligned with the domain types and store usage before the app grows more complex.

### 7. Providers
Any provider-based behavior should be defined after the domain contracts exist, so that providers can depend on stable interfaces.

### 8. Editor
The editor is the most complex domain and should be migrated after the foundational contracts exist.

### 9. Notes
Notes-specific behavior should then be organized around the stabilized editor and service abstractions.

### 10. Organization
Sidebar and organizational structures should follow after notes behavior is stable.

### 11. Widgets
Shared UI primitives and widget-level components should be normalized after feature logic is stabilised.

### 12. AI
AI features should come after the core domain contracts are in place and provider abstractions are understood.

### 13. Root API
The root feature API should be simplified last so that the internal structure can be consolidated first.

## Migration principle
The safest migration path is to stabilize the lowest-risk, most-shared layers first and leave the most complex, highest-coupling areas until the foundation is clear.
