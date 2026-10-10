# Bookinfo Serverless on AWS

A hands-on project demonstrating how to deploy a microservices-style application
with **AWS Lambda, Amazon API Gateway, and the Serverless Framework**.

Inspired by the [Istio Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/),
this project focuses on independently deployed services and communication
between them through HTTP APIs. The backend handlers currently return greeting
messages, so this is an example of serverless deployment and service
integration—not a complete book catalog.

## Architecture

![Bookinfo Serverless architecture](./architecture.png)

The application consists of four independently deployed services:

| Service | API route(s) | Current purpose |
| --- | --- | --- |
| `productpage` | `GET /`, `GET /productpage` | Serves a browser UI at `/` and aggregates backend responses as JSON at `/productpage`. |
| `detail` | `GET /detail` | Detail-service greeting placeholder. |
| `rating` | `GET /rating` | Rating-service greeting placeholder. |
| `review` | `GET /review1`, `GET /review2`, `GET /review3` | Three review-service greeting placeholders. |

### How it works

1. A client sends a request to the productpage API through Amazon API Gateway.
2. API Gateway invokes the `productpage` Lambda function.
3. `productpage` calls the detail and rating endpoints and all three review
   endpoints over HTTP.
4. Each backend Lambda returns its response.
5. `productpage` aggregates the responses for the JSON API; the browser UI
   displays them in service cards.

Each service is deployed independently using the Serverless Framework.

## Example result

![Example Bookinfo productpage result](./result.png)

The screenshot shows the UI displaying the current greeting placeholders, not
real book details, ratings, or reviews.

## Project structure

```text
pov-serviceless-bookinfo/
├── detail/
│   ├── handler.js
│   ├── README.md
│   └── serverless.yml
├── productpage/
│   ├── handler.js
│   ├── README.md
│   └── serverless.yml
├── rating/
│   ├── handler.js
│   ├── README.md
│   └── serverless.yml
├── review/
│   ├── handler.js
│   ├── README.md
│   └── serverless.yml
├── architecture.png
├── result.png
└── README.md
```

## AWS services used

| AWS service | Purpose |
| --- | --- |
| AWS Lambda | Runs each application service as a function. |
| Amazon API Gateway | Exposes HTTP API endpoints for the functions. |
| AWS IAM | Provides deployment and function execution permissions. |
| Amazon CloudWatch | Stores Lambda logs for monitoring and troubleshooting. |
| AWS CloudFormation | Creates and manages the resources deployed by Serverless Framework. |

## Prerequisites

- An AWS account
- Node.js and npm
- AWS CLI installed and configured with credentials
- Serverless Framework installed
- IAM permissions to deploy Lambda, API Gateway, and related resources

Check that the AWS CLI can access your account:

```sh
aws sts get-caller-identity
```

Check that the Serverless Framework is installed:

```sh
serverless --version
```

For setup instructions, see the [Serverless Framework Getting Started
guide](https://www.serverless.com/framework/docs/getting-started).

## Deployment

### 1. Clone the repository

```sh
git clone https://github.com/iamlwinkoko/pov-serviceless-bookinfo.git
cd pov-serviceless-bookinfo
```

### 2. Deploy the backend services

Deploy each backend service and record the API Gateway base URL shown by
`serverless info`:

```sh
cd detail
serverless deploy
serverless info

cd ../rating
serverless deploy
serverless info

cd ../review
serverless deploy
serverless info
```

### 3. Configure productpage

Before deploying productpage, set the backend API base URLs in
[`productpage/serverless.yml`](./productpage/serverless.yml) using the URLs
reported above:

```yaml
environment:
  DETAIL_API_URL: https://your-detail-api-id.execute-api.your-region.amazonaws.com
  RATING_API_URL: https://your-rating-api-id.execute-api.your-region.amazonaws.com
  REVIEW_API_URL: https://your-review-api-id.execute-api.your-region.amazonaws.com
```

Use each API's base URL without a route path. The productpage handler appends
`/detail`, `/rating`, and `/review1`, `/review2`, or `/review3` as needed.

### 4. Deploy productpage

```sh
cd ../productpage
serverless deploy
serverless info
```

## Testing

In the `productpage` directory, run `serverless info` and use the API Gateway
base URL it reports:

- Open the base URL in a browser to view the UI.
- Append `/productpage` to the base URL to call the JSON API.

For example, replace the value below with the URL from your deployment:

```sh
PRODUCTPAGE_URL="https://your-productpage-api-id.execute-api.your-region.amazonaws.com"
curl "$PRODUCTPAGE_URL/productpage"
```

## Cleanup

When testing is complete, remove the deployed services to avoid unnecessary AWS
charges. This deletes their Lambda functions, API Gateway APIs, and related
CloudFormation stacks, so their endpoints will stop working.

From the repository root, remove productpage first, followed by its backends:

```sh
cd productpage
serverless remove

cd ../review
serverless remove

cd ../rating
serverless remove

cd ../detail
serverless remove
```

## References

- [Istio Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/)
- [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
- [Amazon API Gateway documentation](https://docs.aws.amazon.com/apigateway/)
- [Serverless Framework documentation](https://www.serverless.com/framework/docs/)
