# API Gateway → AWS Service Map

This document records the **deployed `voting-api` routing model verified directly from the AWS API Gateway console**.

The API uses two integration strategies intentionally:

- **Direct Lambda integrations** for simple CRUD/read operations.
- **AWS Step Functions `StartExecution` integrations** for multi-step business workflows that require orchestration, branching, error handling, and event fan-out.

## Verified routes

| Route | API Gateway integration | Target | Why this shape fits |
| --- | --- | --- | --- |
| `POST /api/vote` | AWS service integration | Step Functions → `VoteProcess` | Multi-step workflow: validation, hashing, vote write, duplicate-vote decision, statistics update, event publication |
| `GET /api/active-poll` | Lambda proxy integration | `get-active-poll` | Simple read operation against poll configuration |
| `GET /admin/active-poll` | Lambda proxy integration | `get-active-poll` | Admin-side read of the current poll configuration |
| `POST /admin/create-poll` | Lambda proxy integration | `create-poll` | Simple poll creation operation |
| `PUT /admin/update-poll` | Lambda proxy integration | `update-poll` | Simple poll update operation |
| `DELETE /admin/delete-poll` | Lambda proxy integration | `delete-poll` | Simple poll deletion operation |
| `POST /admin/close-poll` | AWS service integration | Step Functions → `CloseElectionProcess` | Multi-step administrative workflow for closing the poll, computing results, and publishing notifications/events |

## Vote workflow integration

`POST /api/vote` does **not** invoke a Lambda directly from API Gateway.

The deployed integration is:

```text
API Gateway
  ↓  StartExecution
AWS Step Functions
  ↓
VoteProcess
```

The API Gateway integration passes `$request.body` as the state-machine input and uses a dedicated invocation role (`APIGatewayStepFuncRole`).

The `VoteProcess` workflow then coordinates the voting path, including the Lambda-based validation/hash/write stages and subsequent branching/event publication described in the architecture documentation.

## Poll-closing workflow integration

`POST /admin/close-poll` follows the same functionless API-to-orchestrator pattern:

```text
API Gateway
  ↓  StartExecution
AWS Step Functions
  ↓
CloseElectionProcess
```

This keeps orchestration concerns out of API glue code and gives the administrative closing process a traceable workflow with explicit failure handling.

## Direct CRUD integrations

The CRUD/read routes intentionally avoid Step Functions:

```text
API Gateway
  ↓
Lambda
  ↓
DynamoDB
```

Examples include `create-poll`, `update-poll`, `delete-poll`, and `get-active-poll`.

This is an important architectural choice: **Step Functions are used where orchestration adds value, while simple request/response operations stay direct and lightweight.**

## Architectural takeaway

The API is not built with one integration pattern everywhere. Instead, the deployed architecture chooses the smallest appropriate AWS primitive for each operation:

- CRUD/read request → direct Lambda
- Multi-stage voting/closure process → Step Functions orchestration
- Persistence → DynamoDB
- Event fan-out → SNS
- Realtime admin updates → AppSync

That separation reduces unnecessary Lambda glue while keeping complex business processes observable and auditable.

## Verification note

The API Gateway console currently shows additional saved integration entries, including multiple Step Functions and duplicate-named Lambda integrations. The route map above documents the **active route-to-target relationships verified during the current architecture review**; unused/legacy integration records should be audited separately before being removed.