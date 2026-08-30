# LifeExtended Security Architecture

LifeExtended was designed around **Defense in Depth**, **Least Privilege**, **Zero Trust toward the client**, and **Privacy by Design**.

## Security goals

The security design focuses on:

- protecting vote integrity,
- preventing duplicate voting under concurrency,
- reducing exposure of backend resources,
- separating user and administrative privileges,
- avoiding storage of raw voter identity,
- keeping workflows auditable.

## Trust boundaries

The system separates the public user flow from the privileged administrative flow.

Key boundaries include:

- separate User and Admin frontend applications,
- separate API paths,
- separate Step Functions workflows,
- privileged Admin authentication with Cognito,
- AWS IAM roles between internal services.

Client-side route protection is a usability layer, not the final security boundary. Privileged actions must remain protected by backend/AWS authorization.

## Single external delivery layer

The deployed frontends are served through Amazon CloudFront over HTTPS.

CloudFront provides the public delivery layer for the static applications and enables the backend origins to remain behind managed AWS routing rather than exposing Lambda or DynamoDB directly to browsers.

## Input validation

Vote requests pass through explicit validation before critical writes.

The backend source includes `ValidateInput.js`, which uses an allow-list style validation approach rather than trusting arbitrary client-provided data.

## Privacy-preserving voter identity

The raw email address is normalized and converted to a SHA-256 identifier using a secret pepper.

The backend reads the pepper from runtime environment configuration:

```text
PEPPER
```

The raw email is not used as the persistent DynamoDB vote key.

This reduces exposure if the vote table is inspected and helps prevent straightforward precomputed-hash attacks against known email addresses.

## Duplicate-vote protection

Duplicate prevention is enforced in DynamoDB with a conditional write, not with browser cookies or local state.

Conceptually:

```text
write vote only if userHash does not already exist
```

This matters because the database performs the check and write atomically. Concurrent requests for the same user hash cannot both pass an earlier non-atomic application check.

## Data integrity

Critical vote state is changed through backend/AWS execution paths rather than direct browser writes to DynamoDB.

The deployed voting workflow also uses DynamoDB atomic update semantics for shared statistics.

## Administrative access

The Admin application includes Amazon Cognito authentication and protected routes.

Administrative functions are separated from public user routes and belong to a distinct administrative workflow.

## IAM and least privilege

The deployed AWS design uses dedicated IAM roles between services. The architecture is designed so that a component receives only the permissions required for its responsibility, for example:

- API Gateway starting a workflow,
- Step Functions invoking required Lambda functions,
- Lambda functions accessing only required DynamoDB/AppSync/SNS resources.

## Event-layer security

SNS is used as an internal event-distribution layer. Clients do not directly publish internal business events.

This preserves loose coupling while keeping event publication behind AWS permissions.

## Real-time security consideration

The Admin frontend currently contains AppSync client integration and uses runtime configuration for AppSync authentication values.

A Vite `VITE_*` value is **not a secret at runtime** because it is embedded into the browser bundle. Therefore API-key-based AppSync access must be treated as public-client authorization, not secret storage.

The exposed legacy AppSync key is scheduled for safe rotation, and privileged AppSync operations should use Cognito/IAM authorization where appropriate.

## Logging and privacy

The design principle is to avoid logging raw PII. Operational logs should contain request identifiers, hashes, status and failure details rather than raw voter email addresses.

## Known security maintenance work

The unified repository no longer commits real API keys. Runtime values are represented using environment configuration and `.env.example` files.

Remaining security work includes:

- safe rotation/revocation of the previously exposed AppSync API key,
- verification of AppSync authorization modes for privileged operations,
- continued secret scanning,
- eventual Infrastructure as Code for auditable IAM/resource configuration.

## Security principles summary

- Defense in Depth
- Least Privilege
- Zero Trust toward client input
- Privacy by Design
- Atomic duplicate-vote enforcement
- Separated User/Admin trust boundaries
- Managed AWS service boundaries
- Auditable serverless workflows
