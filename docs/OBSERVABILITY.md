# LifeExtended Observability

LifeExtended treats observability as part of the architecture rather than an afterthought.

The deployed AWS design uses Amazon CloudWatch as the central operational visibility layer for the serverless workflows.

## Goals

The logging and monitoring strategy is intended to support:

- end-to-end workflow tracing,
- rapid debugging,
- failure analysis,
- auditability of sensitive operations,
- visibility into logical failures such as duplicate votes,
- future alerting and security monitoring.

## Step Functions logging

Step Functions are the central orchestration layer for the core User and Admin workflows.

The deployed architecture enables execution logging so each workflow run can be inspected as a sequence of states, including:

- state input/output,
- branching decisions,
- Lambda invocation results,
- failure paths,
- execution duration.

For the voting workflow, this makes it possible to distinguish failures such as:

- invalid input,
- duplicate vote attempts,
- Lambda errors,
- DynamoDB failures.

A Step Functions execution ARN can act as a correlation point when tracing a workflow across services.

## Lambda logging

Lambda handlers emit application-level logs using standard runtime logging (`console.log`, `console.warn`, `console.error`).

Useful structured fields include:

- request ID,
- timestamp,
- operation name,
- logical decision,
- success/failure status,
- error details.

The goal is to keep logs useful for debugging without storing raw voter PII.

## API / edge visibility

The deployed architecture routes user traffic through managed AWS edge/API services. CloudFront and API Gateway provide operational metrics and request-level visibility such as:

- request volume,
- latency,
- HTTP error rates,
- delivery failures.

These signals are useful for identifying both operational incidents and unusual traffic patterns.

## SNS visibility

SNS sits at the event-distribution boundary after important business actions.

Monitoring this layer helps answer questions such as:

- Was the event published?
- Was it delivered to subscribers?
- Did a downstream consumer fail independently?

This is especially useful because downstream event consumers are intentionally decoupled from the main vote transaction.

## AppSync visibility

AppSync supports the real-time admin experience. Monitoring subscription activity helps diagnose:

- subscription connectivity,
- mutation/subscription delivery problems,
- realtime frontend issues.

## Business events

Beyond technical logs, the architecture naturally exposes meaningful business events such as:

- vote accepted,
- duplicate vote rejected,
- poll closed,
- final result generated.

These events make audit and troubleshooting easier than relying only on low-level infrastructure errors.

## Privacy considerations

Observability must not become a new data-leak surface.

The logging policy should avoid raw email addresses and other unnecessary PII. Prefer:

- hashed identifiers,
- request IDs,
- workflow execution IDs,
- status codes,
- logical outcome names.

## Future improvements

Potential future improvements include:

- CloudWatch alarms for error/latency thresholds,
- dashboards for workflow health,
- centralized structured-log schemas,
- automated anomaly detection,
- SIEM integration,
- tracing/IaC documentation of observability settings.
