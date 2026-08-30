# Deployed AWS Infrastructure

LifeExtended is deployed on AWS using managed serverless services. A substantial part of the cloud infrastructure was configured directly in AWS rather than committed as Infrastructure as Code.

This directory documents that boundary explicitly so the repository does not imply that every deployed resource is represented by Terraform, CloudFormation or CDK.

## Deployed platform components

The current architecture documentation identifies the following AWS services as part of the deployed platform:

- Amazon CloudFront
- Amazon S3
- Amazon API Gateway
- AWS Step Functions
- AWS Lambda
- Amazon DynamoDB
- Amazon SNS
- AWS AppSync
- Amazon Cognito
- Amazon SES
- Amazon CloudWatch
- AWS IAM

## Main workflows

### VoteProcess

User-facing vote orchestration, including validation, privacy-preserving hashing, duplicate-vote enforcement, statistics handling and event publication.

### CloseElectionProcess

Administrative closure/result workflow, separated from the public User flow and used for final result processing and administrative event distribution.

## Live distributions

- User: https://d1133uoqbajo0.cloudfront.net
- Admin: https://d3u3dcclp55ly7.cloudfront.net

## Source-code relationship

The repository contains the application code and Lambda handlers, while resources such as CloudFront distributions, S3 buckets, API Gateway integrations, Step Functions definitions, SNS subscriptions, AppSync resolvers, IAM policies and CloudWatch configuration may be represented only in the deployed AWS account.

For a recruiter/engineer walkthrough, see:

- `../docs/ARCHITECTURE.md`
- `../docs/SECURITY.md`
- `../docs/OBSERVABILITY.md`

## Future improvement

A natural future improvement is to codify the currently deployed infrastructure using AWS CDK, CloudFormation or Terraform. That would make resource configuration reviewable, reproducible and version-controlled alongside the application source.
