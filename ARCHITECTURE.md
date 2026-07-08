# Nasayem Alkhair Architecture

Nasayem Alkhair uses a feature-based Clean Architecture foundation on top of the Next.js App Router.

## Direction Of Dependencies

Application code depends inward:

1. `app` composes routes and providers only.
2. `features` own domain models, repository contracts, use cases, and feature-specific presentation.
3. `services` wrap external SDKs and platforms.
4. `components`, `hooks`, `lib`, `constants`, `utils`, and `types` provide shared primitives.

Firebase is isolated in `src/services/firebase`. Pages and route segments must not import Firebase SDKs directly.

## Folder Responsibilities

- `src/app`: Next.js App Router files, metadata, global styles, and route composition.
- `src/components`: Shared UI components that are not owned by a single feature.
- `src/features`: Bounded application capabilities. Each feature can contain domain, application, infrastructure, and presentation layers.
- `src/services`: External service adapters, SDK initialization, and platform clients.
- `src/hooks`: Reusable generic React hooks.
- `src/lib`: Shared framework helpers and app-level utilities with stable APIs.
- `src/constants`: Static app configuration values.
- `src/utils`: Pure generic functions with no React, Next.js, or SDK dependencies.
- `src/types`: Shared TypeScript contracts used across layers.

## Feature Layout

Each feature may grow with this internal structure:

- `domain`: Entities, value objects, and repository interfaces.
- `application`: Use cases and orchestration that depend on domain contracts.
- `infrastructure`: Implementations that talk to services, APIs, or storage.
- `presentation`: Feature-owned UI and view models.

Only the layers needed by a feature should exist.
